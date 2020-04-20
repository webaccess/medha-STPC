"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity,
} = require("strapi-utils");

const utils = require("../../../config/utils.js");
const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

const _ = require("lodash");

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("activity-batch")
      .model.query(
        buildQuery({
          model: strapi.models["activity-batch"],
          filters,
        })
      )
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0
            ? await utils.getTotalRecords("activity-batch")
            : pageSize,
      })
      .then((res) => {
        return utils.getPaginatedResponse(res);
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

    const { student_id, stream_id } = query;

    let sort;
    if (filters.sort) {
      sort = _.pick(filters, ["sort"]);

      let field = sort.sort[0].field.toString();

      if (field.includes(".")) {
        field = field.split(".");

        if (field.length > 1) {
          filters = _.omit(filters, ["sort"]);
        }
      }
    }

    const activityBatch = await strapi.query("activity-batch").findOne({ id });
    if (!activityBatch) {
      return ctx.response.notFound("Activity batch does not exist");
    }

    const activityBatchStudents = await strapi
      .query("activity-batch-attendance")

      .find({ activity_batch: id });

    const studentIds = activityBatchStudents.map((ab) => ab.student.id);

    let students = await strapi
      .query("student")
      .model.query(
        buildQuery({
          model: strapi.models["student"],
          filters,
        })
      )
      .fetchAll()
      .then((model) => model.toJSON());

    students = students.filter((s) => {
      if (_.includes(studentIds, s.id)) {
        return s;
      }
    });

    await utils.asyncForEach(students, async (student) => {
      const activityBatch = await strapi
        .query("activity-batch-attendance")
        .findOne({ activity_batch: id, student: student.id }, []);
      student.user = sanitizeUser(student.user);
      student.activityBatch = activityBatch;
    });

    if (student_id) {
      students = students.filter((student) => student.id == student_id);
    }

    if (stream_id) {
      students = students.filter((student) => (student.stream.id = stream_id));
    }
    if (sort) {
      const field = sort.sort[0].field.toString();
      const order = sort.sort[0].order.toString();

      if (order === "desc") students = _.sortBy(students, [field]).reverse();
      else if (order === "asc") students = _.sortBy(students, [field]);
    }
    const response = utils.paginate(students, page, pageSize);
    return {
      result: response.result,
      ...response.pagination,
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
      .query("activity-batch-attendance")
      .model.query((qb) => {
        qb.whereIn("student", students).andWhere("activity_batch", id);
      })
      .destroy({ require: false });

    return {
      result: "success",
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
      students.map((studentId) =>
        strapi.query("student").findOne({ id: studentId })
      )
    );

    if (studentsResponse.some((s) => s === null)) {
      return ctx.response.badRequest("Invalid Student Ids");
    }

    /**
     * Check whether student exist in activity batch
     */

    const areStudentPresentInActivityBatch = await Promise.all(
      students.map((studentId) =>
        strapi
          .query("activity-batch-attendance")
          .findOne({ activity_batch: id, student: studentId })
      )
    );

    if (areStudentPresentInActivityBatch.some((a) => a === null)) {
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
      students.map((studentId) =>
        strapi.query("student").findOne({ id: studentId })
      )
    );

    if (studentsResponse.some((s) => s === null)) {
      return ctx.response.badRequest("Invalid Student Ids");
    }

    /**
     * Check whether student exist in activity batch
     */

    const areStudentPresentInActivityBatch = await Promise.all(
      students.map((studentId) =>
        strapi
          .query("activity-batch-attendance")
          .findOne({ activity_batch: id, student: studentId })
      )
    );

    if (areStudentPresentInActivityBatch.some((a) => a === null)) {
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
      students.map((studentId) =>
        strapi.query("student").findOne({ id: studentId })
      )
    );

    if (studentsResponse.some((s) => s === null)) {
      return ctx.response.badRequest("Invalid Student Ids");
    }

    return strapi.services["activity-batch"].addStudentsToActivityBatch(ctx);
  },
};
