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
      await strapi.plugins.upload.services.upload.uploadToEntity(
        {
          id: entry.id || entry._id,
          model: "activity"
        },
        files,
        PLUGIN
      );
    } else {
      entry = await strapi.query("activity", PLUGIN).create(ctx.request.body);
    }

    return entry;
  },

  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
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
      })
      .then(res => {
        const response = utils.paginate(res, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
      });
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
    const { activity_batch_id } = query;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    let activityBatches = await strapi
      .query("activity-batch")
      .find({ activity: id });

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

    const { student_id, stream_id } = query;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

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

    let allStudents;
    if (activityBatch.length && activityBatchAttendance.length) {
      // Only get college student for given college Id
      // Get all student who are not in any activity batch
      const userIds = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getUsers(collegeId);
      const studentIds = activityBatchAttendance.map(ab => ab.contact.id);

      let students = await strapi
        .query("contact", PLUGIN)
        .find({ user_in: userIds, id_nin: studentIds });

      students = students.map(student => {
        student.user = sanitizeUser(student.user);
        return student;
      });

      allStudents = students;
    } else {
      // Get all users Ids belongs to college
      const userIds = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getUsers(collegeId);

      let students = await strapi
        .query("contact", PLUGIN)
        .find({ user_in: userIds });

      students = students.map(student => {
        student.user = sanitizeUser(student.user);
        return student;
      });

      allStudents = students;
    }

    // Filter student with stream and education year
    let isStreamEligible, isEducationEligible;

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

      const academicHistory = await strapi
        .query("academic-history")
        .find({ contact: student.id });

      const { education_year } = activity;
      const { academic_year } = activity;
      console.log(academic_year);
      isEducationEligible = true;

      const isEducationPresent = academicHistory.find(ah => {
        if (
          ah.education_year == education_year &&
          ah.academic_year.id == academic_year.id
        )
          return ah;
      });

      if (!isEducationPresent) {
        isEducationEligible = false;
      }

      if (isStreamEligible && isEducationEligible) {
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
        "description"
      ]);
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
        "description"
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
              .findOne({ id: question.role });
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
  }
};
