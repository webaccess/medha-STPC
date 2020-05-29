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

const _ = require("lodash");

const { PLUGIN } = require("../../../config/constants");

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("activity-batch")
      .model.query(
        buildQuery({
          model: strapi.models["activity-batch"],
          filters
        })
      )
      .fetchAll()
      .then(res => {
        const response = utils.pagination(res.toJSON(), page, pageSize);
        return {
          result: response.result,
          ...result.pagination
        };
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("activity-batch").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   * Get Activity batch students
   */
  async student(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    const activityBatch = await strapi.query("activity-batch").findOne({ id });
    if (!activityBatch) {
      return ctx.response.notFound("Activity batch does not exist");
    }

    const activityBatchStudents = await strapi
      .query("activityassignee", PLUGIN)
      .find({ activity_batch: id });

    const studentIds = activityBatchStudents.map(ab => ab.contact.id);

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

    students = students.filter(s => {
      if (_.includes(studentIds, s.id)) {
        return s;
      }
    });

    await utils.asyncForEach(students, async student => {
      const streamId = student.individual.stream;
      const stream = await strapi.query("stream").findOne({ id: streamId });
      student.individual.stream = stream;
      const activityBatch = await strapi
        .query("activityassignee", PLUGIN)
        .findOne({ activity_batch: id, contact: student.id }, []);
      student.user = sanitizeUser(student.user);
      student.activityBatch = activityBatch;
    });

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      students = utils.sort(students, sort);
    }

    const response = utils.paginate(students, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  async removeStudents(ctx) {
    const { id } = ctx.params;
    const activityBatch = await strapi.query("activity-batch").findOne({ id });
    if (!activityBatch) {
      return ctx.response.notFound("Activity Batch does not exist");
    }

    const { students } = ctx.request.body;

    if (!students) {
      return ctx.response.badRequest("Students field is missing");
    }

    await strapi
      .query("activityassignee", PLUGIN)
      .model.query(qb => {
        qb.whereIn("contact", students).andWhere("activity_batch", id);
      })
      .destroy({ require: false });

    return {
      result: "success"
    };
  },

  /**
   * @param {Object} ctx
   * @return {Object}
   *
   * check if activity exist
   * check if activity batch exist
   * validate student if they are in given activity batch
   */
  async validateActivityBatchStudents(ctx) {
    const { id } = ctx.params;
    const activityBatch = await strapi.query("activity-batch").findOne({ id });
    if (!activityBatch) {
      return ctx.response.notFound("Activity Batch does not exist");
    }

    const { students } = ctx.request.body;

    if (!students) {
      return ctx.response.badRequest("Students field is missing");
    }

    const studentsResponse = await Promise.all(
      students.map(studentId =>
        strapi.query("contact", PLUGIN).findOne({ id: studentId })
      )
    );

    if (studentsResponse.some(s => s === null)) {
      return ctx.response.badRequest("Invalid Student Ids");
    }

    /**
     * Check whether student exist in activity batch
     */

    const areStudentPresentInActivityBatch = await Promise.all(
      students.map(studentId =>
        strapi
          .query("activityassignee", PLUGIN)
          .findOne({ activity_batch: id, contact: studentId })
      )
    );

    if (areStudentPresentInActivityBatch.some(a => a === null)) {
      return ctx.response.badRequest(
        "Invalid Student Ids present in activity batch"
      );
    }

    return strapi.services["activity-batch"].validateStudentForActivityBatch(
      ctx
    );
  },

  async inValidateActivityBatchStudents(ctx) {
    const { id } = ctx.params;
    const activityBatch = await strapi.query("activity-batch").findOne({ id });
    if (!activityBatch) {
      return ctx.response.notFound("Activity Batch does not exist");
    }

    const { students } = ctx.request.body;

    if (!students) {
      return ctx.response.badRequest("Students field is missing");
    }

    const studentsResponse = await Promise.all(
      students.map(studentId =>
        strapi.query("contact", PLUGIN).findOne({ id: studentId })
      )
    );

    if (studentsResponse.some(s => s === null)) {
      return ctx.response.badRequest("Invalid Student Ids");
    }

    /**
     * Check whether student exist in activity batch
     */

    const areStudentPresentInActivityBatch = await Promise.all(
      students.map(studentId =>
        strapi
          .query("activityassignee", PLUGIN)
          .findOne({ activity_batch: id, contact: studentId })
      )
    );

    if (areStudentPresentInActivityBatch.some(a => a === null)) {
      return ctx.response.badRequest(
        "Invalid Student Ids present in activity batch"
      );
    }

    return strapi.services["activity-batch"].inValidateStudentForActivityBatch(
      ctx
    );
  },

  async addStudentsToActivityBatch(ctx) {
    const { id } = ctx.params;
    const activityBatch = await strapi.query("activity-batch").findOne({ id });

    if (!activityBatch) {
      return ctx.response.notFound("Activity Batch does not exist");
    }

    const { students } = ctx.request.body;
    const studentsResponse = await Promise.all(
      students.map(studentId =>
        strapi.query("student").findOne({ id: studentId })
      )
    );

    if (studentsResponse.some(s => s === null)) {
      return ctx.response.badRequest("Invalid Student Ids");
    }

    return strapi.services["activity-batch"].addStudentsToActivityBatch(ctx);
  }
};
