"use strict";

const { PLUGIN } = require("../../../config/constants");
const utils = require("../../../config/utils");

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

const _ = require("lodash");
module.exports = {
  /**
   * TODO policy to check required fields
   */
  create: async ctx => {
    const files = ctx.request.files;
    let entry;

    if (ctx.request.files && ctx.request.body.data) {
      let { data } = ctx.request.body;
      data = JSON.parse(data);
      entry = await strapi.query("activity", PLUGIN).create(data);
      // automatically uploads the files based on the entry and the model
      await strapi.plugins.upload.services.upload.upload({
        data: {
          fileInfo: {},
          refId: entry.id,
          ref: "activity",
          source: PLUGIN,
          field: "upload_logo"
        },
        files: files["files.upload_logo"]
      });
    } else {
      entry = await strapi.query("activity", PLUGIN).create(ctx.request.body);
    }

    return entry;
  },

  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query, { limit: -1 });

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }
    let activity = await strapi
      .query("activity", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("activity", PLUGIN).model,
          filters
        })
      )
      .fetchAll({
        withRelated: [
          "activitytype",
          "academic_year",
          "contact",
          "contact.organization",
          "contact.organization.stream_strength",
          "contact.organization.stream_strength.stream",
          "streams",
          "upload_logo"
        ]
      });
    let response;
    if (sort && sort.length) {
      activity = utils.sort(activity.toJSON(), sort);
    }

    response = utils.paginate(activity, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("activity", PLUGIN).findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   *
   * @param {Object} ctx
   * @returns {Object}
   *
   * Get all activity Batches
   */
  async activityBatch(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query, { limit: -1 });
    const { activity_batch_id } = query;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    let activityBatches = await strapi
      .query("activity-batch")
      .model.query(
        buildQuery({
          model: strapi.models["activity-batch"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    activityBatches = activityBatches.filter(ab => ab.activity.id == id);
    if (activity_batch_id) {
      activityBatches = activityBatches.filter(
        ab => ab.id == activity_batch_id
      );
    }
    const response = utils.paginate(activityBatches, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * @param {Object} ctx
   * @returns {Object}
   *
   * Check if activity exist
   * Create activity batch
   * Create activity batch attedances for all students
   */
  async createActivityBatch(ctx) {
    const { id } = ctx.params;
    const activity = await strapi.query("activity", PLUGIN).findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const { students, name } = ctx.request.body;

    if (!students) {
      return ctx.response.badRequest("Students field is missing");
    }

    if (!name) {
      return ctx.response.badRequest("Name field is missing");
    }
    /**
     * Check whether students exists
     */

    const studentsResponse = await Promise.all(
      students.map(studentId =>
        strapi.query("contact", PLUGIN).findOne({ id: studentId })
      )
    );

    if (studentsResponse.some(s => s === null)) {
      return ctx.response.badRequest("Invalid student Ids");
    }

    return strapi.plugins[
      "crm-plugin"
    ].services.activity.createBatchForStudents(id, ctx);
  },

  /**
   * Download student list attending activity
   */
  async download(ctx) {
    const { id } = ctx.params;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });
    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const activityBatches = await strapi
      .query("activity-batch")
      .find({ activity: id });

    if (!activityBatches.length) {
      return ctx.response.badRequest("No student data found for Activity");
    }

    const batchWiseStudentList = await strapi.plugins[
      "crm-plugin"
    ].services.activity.createBatchWiseStudentList(activityBatches);
    return utils.getFindOneResponse(batchWiseStudentList);
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const activity = await strapi.query("activity", PLUGIN).delete({ id });

    return utils.getFindOneResponse(activity);
  },
  /**
   *
   * @param {*} ctx
   * @return {Array}
   *
   * 1) Get all students if no activity batch is created
   * 2) If activity batch is created return student who are not in that batch
   */
  async student(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query, { limit: -1 });

    const { student_id, stream_id } = query;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });
    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }
    const { education_year, academic_year } = activity;

    const collegeId = activity.contact && activity.contact.id;
    const college = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: collegeId });

    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    /**
     * Check no activity batch is created for given activity then return all students
     * If activity batch exist then return student other than activity batch students
     */
    const activityBatch = await strapi
      .query("activity-batch")
      .find({ activity: activity.id });

    const activityBatchIds = activityBatch.map(ab => ab.id);

    const activityBatchAttendance = await strapi
      .query("activityassignee", PLUGIN)
      .find({ activity_batch_in: activityBatchIds });

    const userIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getUsers(collegeId);

    // Filtering educations and get contactIds who is eligible
    const educationFilter = {
      start: 0,
      limit: -1,
      where: [
        { field: "contact.user.id", operator: "in", value: userIds },
        {
          field: "education_year",
          operator: "eq",
          value: _.toLower(education_year)
        },
        {
          field: "year_of_passing.id",
          operator: "eq",
          value: academic_year.id
        }
      ]
    };

    // Filtering student with respect to education
    const educations = await strapi
      .query("education")
      .model.query(
        buildQuery({
          model: strapi.query("education").model,
          filters: educationFilter
        })
      )
      .fetchAll({ withRelated: [] })
      .then(model => {
        return model.toJSON().map(education => education.contact);
      });

    let allStudents;
    if (activityBatch.length && activityBatchAttendance.length) {
      /**
       * Get all student who fulfill education criteria
       * then filter student who already present in different activity batch
       * and individuals who are verified
       */

      const studentIds = activityBatchAttendance.map(ab => ab.contact.id);

      const studentFilter = [
        { field: "id", operator: "in", value: educations },
        { field: "id", operator: "nin", value: studentIds },
        { field: "individual.is_verified", operator: "eq", value: true }
      ];

      if (filters.where && filters.where.length > 0) {
        filters.where = [...filters.where, ...studentFilter];
      } else {
        filters.where = [...studentFilter];
      }

      let students = await strapi
        .query("contact", PLUGIN)
        .model.query(
          buildQuery({
            model: strapi.query("contact", PLUGIN).model,
            filters
          })
        )
        .fetchAll()
        .then(model => model.toJSON());

      students = students.map(student => {
        student.user = sanitizeUser(student.user);
        return student;
      });

      allStudents = students;
    } else {
      /**
       * Filter students who has fulfilled education criteria and who are verified
       */
      const studentFilter = [
        { field: "id", operator: "in", value: educations },
        { field: "individual.is_verified", operator: "eq", value: true }
      ];

      if (filters.where && filters.where.length > 0) {
        filters.where = [...filters.where, ...studentFilter];
      } else {
        filters.where = [...studentFilter];
      }

      let students = await strapi
        .query("contact", PLUGIN)
        .model.query(
          buildQuery({
            model: strapi.query("contact", PLUGIN).model,
            filters
          })
        )
        .fetchAll()
        .then(model => model.toJSON());
      console.log(students.length);
      students = students.map(student => {
        student.user = sanitizeUser(student.user);
        return student;
      });

      allStudents = students;
    }

    // Filter student with stream
    let isStreamEligible;

    let filtered = [];
    await utils.asyncForEach(allStudents, async student => {
      const { stream } = student.individual;

      if (stream) {
        const { streams } = activity;
        const streamIds = streams.map(s => s.id);
        if (streamIds.length == 0 || _.includes(streamIds, stream)) {
          isStreamEligible = true;
        } else {
          isStreamEligible = false;
        }
      } else {
        isStreamEligible = false;
      }

      if (isStreamEligible) {
        filtered.push(student);
      }
    });

    if (student_id) {
      filtered = filtered.filter(student => student.id == student_id);
    }

    if (stream_id) {
      filtered = filtered.filter(student => student.stream.id == stream_id);
    }
    await utils.asyncForEach(filtered, async student => {
      const streams = await strapi
        .query("stream")
        .findOne({ id: student.individual.stream });
      student.individual.stream = streams;
    });
    const response = utils.paginate(filtered, page, pageSize);
    return { result: response.result, ...response.pagination };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const activity = await strapi.query("activity", PLUGIN).findOne({ id });
    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    if (ctx.request.files && ctx.request.body.data) {
      const data = JSON.parse(ctx.request.body.data);
      const files = ctx.request.files;
      const body = _.pick(data, [
        "title",
        "start_date_time",
        "end_date_time",
        "activitytype",
        "academic_year",
        "contact",
        "education_year",
        "address",
        "trainer_name",
        "question_set",
        "description",
        "activity_status"
      ]);

      return await strapi
        .query("activity", PLUGIN)
        .model.where({ id })
        .save(body, { patch: true })
        .then(async model => {
          await model.related("streams").detach();
          await model.related("streams").attach(ctx.request.body.streams);
          await strapi.plugins.upload.services.upload.upload({
            data: {
              fileInfo: {},
              refId: id,
              ref: "activity",
              source: PLUGIN,
              field: "upload_logo"
            },
            files: files["files.upload_logo"]
          });

          return model;
        });
    } else {
      const body = _.pick(ctx.request.body, [
        "title",
        "start_date_time",
        "end_date_time",
        "activitytype",
        "academic_year",
        "contact",
        "education_year",
        "address",
        "trainer_name",
        "question_set",
        "description",
        "activity_status"
      ]);
      return await strapi
        .query("activity", PLUGIN)
        .model.where({ id })
        .save(body, { patch: true })
        .then(async model => {
          await model.related("streams").detach();
          await model.related("streams").attach(ctx.request.body.streams);
          return model;
        });
    }
  },

  async getQuestionSet(ctx) {
    const { id } = ctx.params;
    const activity = await strapi.query("activity", PLUGIN).findOne({ id: id });
    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }
    if (activity.question_set) {
      const activity_question_set = await strapi.query("question-set").findOne({
        id: activity.question_set.id
      });

      if (
        activity_question_set.questions &&
        activity_question_set.questions.length !== 0
      ) {
        await utils.asyncForEach(
          activity_question_set.questions,
          async question => {
            const role = await strapi
              .query("role", "users-permissions")
              .findOne({ id: question.role }, []);
            question.role = { id: role.id, name: role.name };
          }
        );
        return utils.getFindOneResponse(activity_question_set);
      } else {
        return ctx.response.notFound("No questions for activity");
      }
    } else {
      return ctx.response.notFound("No question set with this activity");
    }
  },

  async getFeedbacksForEventFromCollege(ctx) {
    const { activityId, collegeId, feedbackType } = ctx.params;
    const activity = await strapi
      .query("activity", PLUGIN)
      .findOne({ id: activityId });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    if (!activity.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ activity: activityId, question_set: activity.question_set.id });

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
    if (feedbackType === "rating") {
      let feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
        ctx,
        activity,
        students_contact_id,
        "Student"
      );
      return utils.getFindOneResponse(feedbackData);
    } else if (feedbackType === "comment") {
      let feedbackData = await strapi.services.event.getAllCommentsForActivity(
        ctx,
        activity,
        students_contact_id,
        "Student"
      );
      return utils.getFindOneResponse(feedbackData);
    }
  },

  /** Get Feedback for activity for rpc  */
  async getFeedbacksForActivityForRPC(ctx) {
    const { activityId, rpcId, feedbackType } = ctx.params;

    const activity = await strapi
      .query("activity", PLUGIN)
      .findOne({ id: activityId });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    if (!activity.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ activity: activityId, question_set: activity.question_set.id });

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
    if (feedbackType === "rating") {
      let feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
        ctx,
        activity,
        collegeAdminsIds,
        "College Admin"
      );
      return utils.getFindOneResponse(feedbackData);
    } else if (feedbackType === "comment") {
      let feedbackData = await strapi.services.event.getAllCommentsForActivity(
        ctx,
        activity,
        collegeAdminsIds,
        "College Admin"
      );
      return utils.getFindOneResponse(feedbackData);
    }
  },

  /** Get Feedback for activity for rpc  */
  async getFeedbacksForActivityForZone(ctx) {
    const { activityId, zoneId, dataFor, feedbackType } = ctx.params;

    const activity = await strapi
      .query("activity", PLUGIN)
      .findOne({ id: activityId });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    if (!activity.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ activity: activityId, question_set: activity.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    /** Check if zone exist */
    let feedbackData;
    if (dataFor === "college") {
      /** This gets contact ids of all the college admins under the RPC*/
      const collegeAdminIds = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getContactIdsForFeedback(
        ctx,
        zoneId,
        "Zonal Admin",
        "college"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
          ctx,
          activity,
          collegeAdminIds,
          "College Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForActivity(
          ctx,
          activity,
          collegeAdminIds,
          "College Admin"
        );
      }
    } else if (dataFor === "rpc") {
      /** This gets contact ids of all the college admins under the RPC*/
      const rpcAdmins = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getContactIdsForFeedback(
        ctx,
        zoneId,
        "Zonal Admin",
        "rpc"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
          ctx,
          activity,
          rpcAdmins,
          "RPC Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForActivity(
          ctx,
          activity,
          rpcAdmins,
          "RPC Admin"
        );
      }
    }
    return utils.getFindOneResponse(feedbackData);
  },

  /** Feedback data for medha admin */
  async getFeedbackForSuperAdmin(ctx) {
    const { activityId, id, dataFor, feedbackType } = ctx.params;

    const activity = await strapi
      .query("activity", PLUGIN)
      .findOne({ id: activityId });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    if (!activity.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ activity: activityId, question_set: activity.question_set.id });

    if (!checkIfFeedbackPresent.length) {
      return ctx.response.notFound("No feedback data present");
    }

    let feedbackData;
    if (dataFor === "college") {
      /** This gets contact ids of all the college admins under the RPC*/
      const collegeAdminIds = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getContactIdsForFeedback(
        ctx,
        null,
        "Medha Admin",
        "college"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
          ctx,
          activity,
          collegeAdminIds,
          "College Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForActivity(
          ctx,
          activity,
          collegeAdminIds,
          "College Admin"
        );
      }
    } else if (dataFor === "rpc") {
      /** This gets contact ids of all the college admins under the RPC*/
      const rpcAdmins = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getContactIdsForFeedback(
        ctx,
        null,
        "Medha Admin",
        "rpc"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
          ctx,
          activity,
          rpcAdmins,
          "RPC Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForActivity(
          ctx,
          activity,
          rpcAdmins,
          "RPC Admin"
        );
      }
    } else if (dataFor === "zone") {
      /** This gets contact ids of all the college admins under the RPC*/
      const zoneAdmins = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getContactIdsForFeedback(
        ctx,
        null,
        "Medha Admin",
        "zone"
      );
      if (feedbackType === "rating") {
        feedbackData = await strapi.services.event.getAggregateFeedbackForActivity(
          ctx,
          activity,
          zoneAdmins,
          "Zonal Admin"
        );
      } else if (feedbackType === "comment") {
        feedbackData = await strapi.services.event.getAllCommentsForActivity(
          ctx,
          activity,
          zoneAdmins,
          "Zonal Admin"
        );
      }
    }

    return utils.getFindOneResponse(feedbackData);
  }
};
