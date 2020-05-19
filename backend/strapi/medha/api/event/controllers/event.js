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
      .fetchAll()
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
    let students = await strapi.services.event.getIndividuals(organizationId);

    // Getting student data for given userIds
    //  students = await strapi
    //   .query("individual",PLUGIN)
    //   .model.query(
    //     buildQuery({
    //       model: strapi.plugins["crm-plugin"].models["individual"],
    //       filters
    //     })
    //   )
    //   .fetchAll()
    //   .then(model => model.toJSON());

    // students = students
    //   .map(student => {
    //     if (student.user && _.includes(userIds, student.user.id)) {
    //       student.user = sanitizeUser(student.user);
    //       return student;
    //     }
    //   })
    //   .filter(a => a);

    //Filter students who passes the given criteria for college
    let filtered = [];

    await utils.asyncForEach(students, async student => {
      /**Filtering stream */
      const { stream } = student;
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
        .find({ contact: student.contact.id });

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
        .find({ contact: student.contact.id });

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

      if (isStreamEligible && isQualificationEligible && isEducationEligible) {
        const qualifications = await strapi
          .query("academic-history")
          .find({ contact: student.contact.id }, []);
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
  }
};
