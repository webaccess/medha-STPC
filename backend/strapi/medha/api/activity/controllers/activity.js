"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");

const utils = require("../../../config/utils.js");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("activity")
      .model.query(
        buildQuery({
          model: strapi.models["activity"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("activity") : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("activity").findOne({ id });
    return utils.getFindOneResponse(response);
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
    const { page, pageSize } = utils.getRequestParams(ctx.request.query);

    const activity = await strapi.query("activity").findOne({ id });
    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const collegeId = activity.college && activity.college.id;
    const college = await strapi.query("college").findOne({ id: collegeId });

    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    /**
     * Check no activity batch is created for given activity then return all students
     * If activity batch exist then return student other than activity batch students
     */
    const activityBatch = await strapi
      .query("activity-batch")
      .find({ activity: id });

    const activityBatchIds = activityBatch.map(ab => ab.id);

    const activityBatchAttendance = await strapi
      .query("activity-batch-attendance")
      .find({ activity_batch_in: activityBatchIds });

    let response;
    if (activityBatch && activityBatchAttendance) {
      const studentIds = activityBatchAttendance.map(ab => ab.student.id);
      let students = await strapi.query("student").find({ id_nin: studentIds });
      students = students.map(student => {
        student.user = sanitizeUser(student.user);
        return student;
      });

      response = utils.paginate(students, page, pageSize);
    } else {
      // Get all users Ids belongs to college
      const userIds = await strapi.services.college.getUsers(id);
      let students = await strapi.query("student").find({ user_in: userIds });
      students = students.map(student => {
        student.user = sanitizeUser(student.user);
        return student;
      });

      response = utils.paginate(students, page, pageSize);
    }
    return { result: response.result, ...response.pagination };
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
    const { page, pageSize } = utils.getRequestParams(ctx.request.query);
    const activity = await strapi.query("activity").findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const activityBatches = await strapi
      .query("activity-batch")
      .find({ activity: id });
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
    const activity = await strapi.query("activity").findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const { students } = ctx.request.body;

    if (!students) {
      return ctx.response.badRequest("Students field is missing");
    }

    /**
     * Check whether students exists
     */

    const studentsResponse = await Promise.all(
      students.map(studentId =>
        strapi.query("student").findOne({ id: studentId })
      )
    );

    if (studentsResponse.some(s => s === null)) {
      return ctx.response.badRequest("Invalid student Ids");
    }

    await strapi.services.activity.createBatchForStudents(id, students);
  }
};
