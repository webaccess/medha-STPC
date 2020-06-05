"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");
const { PLUGIN } = require("../../../config/constants");
const utils = require("../../../config/utils.js");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

const _ = require("lodash");

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize < 0 ? await utils.getTotalRecords("event") : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    let response = await strapi.query("event").findOne({ id });

    const org = response.contacts.map(contact => {
      return contact.organization;
    });

    const organization = await strapi
      .query("organization", PLUGIN)
      .find({ id: org });

    response.contacts = organization;
    return utils.getFindOneResponse(response);
  },

  /**
   *
   * get student using event id
   */
  async individual(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    const event = await strapi.query("event").findOne({ id });
    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    const registrations = await strapi
      .query("event-registration")
      .find({ event: event.id });

    const contactIds = registrations.map(r => r.contact.id);
    let contact = await strapi
      .query("contact", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.plugins["crm-plugin"].models["contact"],
          filters
        })
      )
      .fetchAll({
        withRelated: [
          "state",
          "district",
          "individual.stream",
          "user",
          "activityassignees",
          "contacttags"
        ]
      })
      .then(model => model.toJSON());
    contact = contact
      .map(contact => {
        if (_.includes(contactIds, contact.id)) {
          contact.user = sanitizeUser(contact.user);
          return contact;
        }
      })
      .filter(a => a);

    let filtered = [];
    await utils.asyncForEach(contact, async contact => {
      if (_.includes(contactIds, contact.id)) {
        const qualifications = await strapi
          .query("academic-history")
          .find({ contact: contact.id }, []);

        // contact.user = sanitizeUser(contact.user);
        contact.qualifications = qualifications;
        filtered.push(contact);
      }
    });

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      filtered = utils.sort(filtered, sort);
    }

    const response = utils.paginate(filtered, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * Delete Image
   */

  async deleteImage(ctx) {
    const { imageId } = ctx.params;
    if (!imageId) {
      return ctx.response.badRequest("Image Id is absent");
    }

    const config = await strapi
      .store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "upload"
      })
      .get({ key: "provider" });

    const file = await strapi.plugins["upload"].services.upload.fetch({
      id: imageId
    });

    if (!file) {
      return ctx.notFound("Image.notFound");
    }

    const related = await bookshelf
      .model("uploadMorph")
      .where({ upload_file_id: imageId })
      .fetch();

    if (related) {
      await related.destroy();
    }

    await strapi.plugins["upload"].services.upload.remove(file, config);

    ctx.send(file);
  },

  async eligibleOrganizationIndividual(ctx) {
    const { id, organizationId } = ctx.params;

    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    const event = await strapi.query("event").findOne({ id });
    const college = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: organizationId });

    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    /**
     * Get eligible student for that college
     *
     * Get all student for that colleges
     * filter with given criteria
     * return list of students
     */

    // Getting students under that college
    let students = await strapi.services.event.getIndividuals(
      id,
      organizationId,
      filters
    );
    //Filter students who passes the given criteria for college
    let filtered = [];

    await utils.asyncForEach(students, async student => {
      /**Filtering stream */
      const { stream } = student.individual;
      let isStreamEligible, isEducationEligible, isQualificationEligible;

      if (stream) {
        const { streams } = event;
        const streamIds = streams.map(s => s.id);
        if (streamIds.length == 0 || _.includes(streamIds, stream.id)) {
          isStreamEligible = true;
        } else {
          isStreamEligible = false;
        }
      } else {
        isStreamEligible = false;
      }

      /** Filtering qualifications */
      const studentEducations = await strapi
        .query("education")
        .find({ contact: student.id });

      const { qualifications } = event;
      isQualificationEligible = true;
      qualifications.forEach(q => {
        const isQualificationPresent = studentEducations.find(
          e =>
            e.qualification == q.qualification && e.percentage >= q.percentage
        );

        if (!isQualificationPresent) {
          isQualificationEligible = false;
        }
      });

      /**Filtering educations */
      const academicHistory = await strapi
        .query("academic-history")
        .find({ contact: student.id });

      const { educations } = event;
      isEducationEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = academicHistory.find(
          ah =>
            ah.education_year == edu.education_year &&
            ah.percentage >= edu.percentage
        );

        if (!isEducationPresent) {
          isEducationEligible = false;
        }
      });

      if (
        isStreamEligible &&
        isQualificationEligible &&
        isEducationEligible &&
        student.individual.is_verified
      ) {
        const qualifications = await strapi
          .query("academic-history")
          .find({ contact: student.id }, []);
        student.qualifications = qualifications;
        filtered.push(student);
      }
    });

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      filtered = utils.sort(filtered, sort);
    }

    const response = utils.paginate(filtered, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  async getQuestionSet(ctx) {
    const { id } = ctx.params;
    const event = await strapi.query("event").findOne({ id: id });
    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }
    if (event.question_set) {
      const event_question_set = await strapi.query("question-set").findOne({
        id: event.question_set.id
      });

      if (
        event_question_set.questions &&
        event_question_set.questions.length !== 0
      ) {
        await utils.asyncForEach(
          event_question_set.questions,
          async question => {
            const role = await strapi
              .query("role", "users-permissions")
              .findOne({ id: question.role });
            question.role = { id: role.id, name: role.name };
          }
        );
        return utils.getFindOneResponse(event_question_set);
      } else {
        return ctx.response.notFound("No questions for event");
      }
    } else {
      return ctx.response.notFound("No event set with this activity");
    }
  },

  async getFeedbacksForEventFromCollege(ctx) {
    const { eventId, collegeId } = ctx.params;
    const event = await strapi.query("event").findOne({ id: eventId });

    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    if (!event.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    const contact = await strapi
      .query("contact", "crm-plugin")
      .find({ id: collegeId, contact_type: "organization" });

    if (!contact.length) {
      return ctx.response.notFound("No college found");
    }

    const userIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getUsers(collegeId);

    if (!userIds.length) {
      return ctx.response.notFound("No students with this college");
    }

    let students = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const students_contact_id = students.map(student => {
      return student.id;
    });

    /**------------------------------------------------ */
    let feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
      ctx,
      event,
      students_contact_id,
      "Student"
    );

    return utils.getFindOneResponse(feedbackData);
  },

  async getStudentCommentsForEventFromCollege(ctx) {
    const { eventId, collegeId } = ctx.params;

    const event = await strapi.query("event").findOne({ id: eventId });

    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    if (!event.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    const contact = await strapi
      .query("contact", "crm-plugin")
      .find({ id: collegeId, contact_type: "organization" });

    if (!contact.length) {
      return ctx.response.notFound("No college found");
    }

    const userIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getUsers(collegeId);

    if (!userIds.length) {
      return ctx.response.notFound("No students with this college");
    }

    let students = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const students_contact_id = students.map(student => {
      return student.id;
    });

    /**------------------------------------------------ */
    let feedbackData = await strapi.services.event.getAllCommentsForEvent(
      ctx,
      event,
      students_contact_id,
      "Student"
    );
    return utils.getFindOneResponse(feedbackData);
  },

  /*** Get feedback comments for rpc */

  async getFeedbacksCommentsForEventForRPC(ctx) {
    const { eventId, rpcId } = ctx.params;

    const event = await strapi.query("event").findOne({ id: eventId });

    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    if (!event.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    /** Check if rpc exist */
    const rpc = await strapi.query("rpc").findOne({ id: rpcId }, []);

    if (!rpc) {
      return ctx.response.notFound("RPC does not exist");
    }

    /** This gets contact ids of all the college admins under the RPC*/
    const collegeAdminUsers = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getCollegeAdminsFromRPC(rpcId);

    let collegeAdminContacts = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: collegeAdminUsers });

    const collegeAdminsIds = collegeAdminContacts.map(contact => {
      return contact.id;
    });

    /**------------------------------------------------ */
    let feedbackData = await strapi.services.event.getAllCommentsForEvent(
      ctx,
      event,
      collegeAdminsIds,
      "College Admin"
    );

    return utils.getFindOneResponse(feedbackData);
  },

  /** Get Feedback for rpc  */
  async getFeedbacksForEventForRPC(ctx) {
    const { eventId, rpcId } = ctx.params;

    const event = await strapi.query("event").findOne({ id: eventId });

    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    if (!event.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    /** Check if rpc exist */
    const rpc = await strapi.query("rpc").findOne({ id: rpcId }, []);

    if (!rpc) {
      return ctx.response.notFound("RPC does not exist");
    }

    /** This gets contact ids of all the college admins under the RPC*/
    const collegeAdminUsers = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getCollegeAdminsFromRPC(rpcId);

    let collegeAdminContacts = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: collegeAdminUsers });

    const collegeAdminsIds = collegeAdminContacts.map(contact => {
      return contact.id;
    });

    /**------------------------------------------------ */
    let feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
      ctx,
      event,
      collegeAdminsIds,
      "College Admin"
    );
    return utils.getFindOneResponse(feedbackData);
  },

  async getFeedbackForZone(ctx) {
    const { eventId, zoneId, dataFor, feedbackType } = ctx.params;

    /** Steps to check if event is present */
    const event = await strapi.services.event.checkIfEventExist(ctx, eventId);

    /** Steps to check if feedback exist for that event */
    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    /** Check if zone exist */
    const zone = await strapi.services.zone.checkIfZoneExist(zoneId);

    let feedbackData;
    if (dataFor === "college") {
      /** This gets contact ids of all the college admins under the RPC*/
      const collegeAdminIds = await strapi.services.event.getContactIdsForFeedback(
        ctx,
        zoneId,
        "Zonal Admin",
        "college"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
          ctx,
          event,
          collegeAdminIds,
          "College Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForEvent(
          ctx,
          event,
          collegeAdminIds,
          "College Admin"
        );
      }
    } else if (dataFor === "rpc") {
      /** This gets contact ids of all the college admins under the RPC*/
      const rpcAdmins = await strapi.services.event.getContactIdsForFeedback(
        ctx,
        zoneId,
        "Zonal Admin",
        "rpc"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
          ctx,
          event,
          rpcAdmins,
          "RPC Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForEvent(
          ctx,
          event,
          rpcAdmins,
          "RPC Admin"
        );
      }
    }

    return utils.getFindOneResponse(feedbackData);
  },

  /** Feedback data for medha admin */
  async getFeedbackForSuperAdmin(ctx) {
    const { eventId, id, dataFor, feedbackType } = ctx.params;

    /** Steps to check if event is present */
    const event = await strapi.services.event.checkIfEventExist(ctx, eventId);

    /** Steps to check if feedback exist for that event */
    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    let feedbackData;
    if (dataFor === "college") {
      /** This gets contact ids of all the college admins under the RPC*/
      const collegeAdminIds = await strapi.services.event.getContactIdsForFeedback(
        ctx,
        null,
        "Medha Admin",
        "college"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
          ctx,
          event,
          collegeAdminIds,
          "College Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForEvent(
          ctx,
          event,
          collegeAdminIds,
          "College Admin"
        );
      }
    } else if (dataFor === "rpc") {
      /** This gets contact ids of all the college admins under the RPC*/
      const rpcAdmins = await strapi.services.event.getContactIdsForFeedback(
        ctx,
        null,
        "Medha Admin",
        "rpc"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
          ctx,
          event,
          rpcAdmins,
          "RPC Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForEvent(
          ctx,
          event,
          rpcAdmins,
          "RPC Admin"
        );
      }
    } else if (dataFor === "zone") {
      /** This gets contact ids of all the college admins under the RPC*/
      const zoneAdmins = await strapi.services.event.getContactIdsForFeedback(
        ctx,
        null,
        "Medha Admin",
        "zone"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForEvent(
          ctx,
          event,
          zoneAdmins,
          "Zonal Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForEvent(
          ctx,
          event,
          zoneAdmins,
          "Zonal Admin"
        );
      }
    }

    return utils.getFindOneResponse(feedbackData);
  }
};
