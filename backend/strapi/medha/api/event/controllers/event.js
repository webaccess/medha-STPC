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
    const response = await strapi.query("event").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   *
   * get student using event id
   */
  async students(ctx) {
    // const { id } = ctx.params;
    // const { page, pageSize } = utils.getRequestParams(ctx.request.query);
    // const registrations = await strapi
    //   .query("event-registration")
    //   .find({ event: id });
    // const studentIds = registrations.map((r) => r.student.id);
    // let students = await strapi.query("student").find({ id_in: studentIds });
    // students = students.map((student) => {
    //   student.user = sanitizeUser(student.user);
    //   return student;
    // });
    // const response = utils.paginate(students, page, pageSize);
    // return {
    //   result: response.result,
    //   ...response.pagination
    // };

    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const event = await strapi.query("event").findOne({ id });
    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    const registrations = await strapi
      .query("event-registration")
      .find({ event: event.id });

    const studentIds = registrations.map(r => r.student.id);
    let students = await strapi
      .query("student")
      .model.query(
        buildQuery({
          model: strapi.models["student"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    students = students
      .map(student => {
        if (_.includes(studentIds, student.id)) {
          student.user = sanitizeUser(student.user);
          return student;
        }
      })
      .filter(a => a);

    const response = utils.paginate(students, page, pageSize);
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
  }
};
