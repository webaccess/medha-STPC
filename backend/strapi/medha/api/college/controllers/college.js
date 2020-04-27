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
const bookshelf = require("../../../config/config.js");
const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

const _ = require("lodash");
module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    // TODO add college admins to list
    /**
     * public route for colleges
     */
    if (!ctx.state.user) {
      return strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters,
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
          columns: ["id", "name"],
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });
    }

    /**
     * Authenticated user routes
     */
    const states = await strapi.query("state").find();

    const { role, rpc, zone, college } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters,
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
        };
      });
      return response;
    }

    if (role.name === "Zonal Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters,
          })
        )
        .where({ zone: zone })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
        };
      });
      return response;
    }

    if (role.name === "RPC Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters,
          })
        )
        .where({ rpc: rpc })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
        };
      });
      return response;
    }

    if (role.name === "College Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters,
          })
        )
        .where({ id: college })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
        };
      });
      return response;
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const states = await strapi.query("state").find();
    const response = await strapi.query("college").findOne({ id });
    const stateId = response.rpc.state || response.zone.state;
    response.state = states.find((s) => s.id === stateId);
    return utils.getFindOneResponse(response);
  },

  async showStudents(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const college = await strapi.query("college").findOne({ id });
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    // Get all users Ids belongs to college
    const userIds = await strapi.services.college.getUsers(id);

    let students = await strapi
      .query("student")
      .model.query(
        buildQuery({
          model: strapi.models.student,
          filters,
        })
      )
      .fetchAll()
      .then((model) => model.toJSON());

    let filtered = [];
    await utils.asyncForEach(students, async (student) => {
      const user = student.user;

      if (_.includes(userIds, student.user.id)) {
        const qualifications = await strapi
          .query("academic-history")
          .find({ student: student.id }, []);

        student.qualifications = qualifications;
        student.user = sanitizeUser(user);
        filtered.push(student);
      }
    });

    const response = utils.paginate(filtered, page, pageSize);

    return { result: response.result, ...response.pagination };
  },

  /**
   *
   * @param {ids} ctx
   * This will block single or multiple colleges from array
   */
  async block(ctx) {
    const { ids } = ctx.request.body;
    let idsToBlock;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("College Ids are empty");
    }

    await strapi
      .query("college")
      .model.query((qb) => {
        qb.whereIn("id", idsToBlock);
      })
      .save({ blocked: true }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   *
   * @param {ids} ctx
   * This will unblock single or multiple colleges from array
   */
  async unblock(ctx) {
    const { ids } = ctx.request.body;
    let idsToBlock;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("College Ids are empty");
    }

    await strapi
      .query("college")
      .model.query((qb) => {
        qb.whereIn("id", idsToBlock);
      })
      .save({ blocked: false }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   * @return {Array}
   * This will fetch all events related to college
   */
  async event(ctx) {
    const { id } = ctx.params;
    let { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const college = await strapi.query("college").findOne({ id }, []);
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters,
        })
      )
      .fetchAll()
      .then((model) => model.toJSON());

    /**
     * Get all events for specific college
     */
    const filtered = await strapi.services.college.getEvents(college, events);
    const { result, pagination } = utils.paginate(filtered, page, pageSize);
    return { result, ...pagination };
  },

  /**
   * @return {Array}
   * This will fetch all training related to college
   */
  async activity(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("activity")
      .model.query(
        buildQuery({
          model: strapi.models.activity,
          filters,
        })
      )
      .where({ college: id })
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("activity") : pageSize,
      })
      .then((res) => {
        return utils.getPaginatedResponse(res);
      });
  },
  async studentregister(ctx) {
    const { email, contact_number } = ctx.request.body;

    if (!contact_number) {
      return ctx.response.badRequest("Contact no. is missing");
    }

    const usr = await bookshelf
      .model("user")
      .where({ email: email })
      .fetch()
      .then((data) => {
        return data ? data.toJSON() : null;
      });
    console.log("email verification");
    console.log(usr);
    if (!!usr) {
      return ctx.response.forbidden("Email already taken");
    }

    const collegeId = ctx.params.id;
    console.log(collegeId);
    const college = await bookshelf
      .model("college")
      .where({ id: collegeId })
      .fetch({ require: false })
      .then((data) => {
        return data ? data.toJSON() : null;
      });

    if (!college) {
      return ctx.response.notFound("College does not exist");
    }
    const rpc = await bookshelf
      .model("rpc")
      .where({ id: college.rpc })
      .fetch({ require: false })
      .then((data) => {
        return data ? data.toJSON() : null;
      });

    if (!rpc) {
      return ctx.response.notFound("RPC does not exist");
    }

    const zone = await bookshelf
      .model("zone")
      .where({ id: college.zone })
      .fetch({ require: false })
      .then((data) => {
        return data ? data.toJSON() : null;
      });

    if (!zone) {
      return ctx.response.notFound("Zone does not exist");
    }

    // const studentRole = await bookshelf
    //   .model("role")
    //   .where({ name: "Student" })
    //   .fetch({ require: false })
    //   .then(model => (model ? model.toJSON() : null));

    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });
    const requestBody = ctx.request.body;
    console.log(ctx.request.body);
    const userRequestBody = Object.assign(
      {
        state: requestBody.state,
        zone: zone.id,
        rpc: rpc.id,
        college: college.id,
        role: studentRole.id,
        provider: "local",
        confirmed: false,
        blocked: false,
      },
      _.omit(requestBody, [
        "stream",
        "father_first_name",
        "father_last_name",
        "date_of_birth",
        "gender",
        "roll_number",
        "district",
        "physicallyHandicapped",
        "address",
        "otp",
        "college_id",
      ])
    );

    userRequestBody.password = await strapi.plugins[
      "users-permissions"
    ].services.user.hashPassword(userRequestBody);

    await bookshelf
      .transaction(async (t) => {
        const _user = await bookshelf
          .model("user")
          .forge(userRequestBody)
          .save(null, { transacting: t })
          .then((userModel) => userModel.toJSON());

        const studentRequestData = Object.assign(
          { user: _user.id, verifiedByCollege: true },
          _.omit(ctx.request.body, [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "contact_number",
            "otp",
            "college_id",
            "state",
          ])
        );
        return await bookshelf
          .model("student")
          .forge(studentRequestData)
          .save(null, { transacting: t });
      })
      .then((success) => {
        console.log(success);
        return ctx.send(utils.getResponse(success));
      })
      .catch((error) => {
        console.log(error);
        return ctx.response.badRequest(`Invalid ${error.detail}`);
      });
  },

  /**
   * Get college admins
   */
  async admins(ctx) {
    const { id } = ctx.params;

    const college = await strapi.query("college").findOne({ id });
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    const userIds = await strapi.services.college.getAdmins(id);
    const response = await strapi
      .query("user", "users-permissions")
      .find({ id_in: userIds });

    const list = response.map((user) => {
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        username: user.username,
      };
    });

    return utils.getFindOneResponse(list);
  },
  async deleteStudents(ctx) {
    let { id } = ctx.request.body;
    console.log(id);

    let user = [];
    let notStudent = await Promise.all(
      id.map(async (id) => {
        const student = await strapi.query("student").findOne({ id: id });
        if (student === null) {
          return null;
        } else {
          console.log(student);
          const data = { studentId: id, userId: student.user.id };
          user.push(data);
          return id;
        }
      })
    );
    console.log("user id list");
    console.log(user);

    notStudent = _.xor(id, notStudent).filter((c) => c);
    console.log("not a student:");
    console.log(notStudent);
    id = _.pullAll(id, notStudent);

    const stud = await strapi.query("student").findOne({ id: 1 });
    const documents = stud.documents;
    console.log(documents);
    if (documents.length > 0) console.log("In documents If");

    let list = await Promise.all(
      id.map(async (id) => {
        const academic_history = await strapi
          .query("academic-history")
          .findOne({ student: id });
        if (academic_history !== null) return id;

        const education = await strapi
          .query("education")
          .findOne({ student: id });
        if (education !== null) return id;

        const activity_batch_attendance = await strapi
          .query("activity-batch-attendance")
          .findOne({ student: id });
        if (activity_batch_attendance !== null) return id;

        const event_registration = await strapi
          .query("event-registration")
          .findOne({ student: id });
        if (event_registration !== null) return id;
      })
    );
    console.log("after list await");
    list = _.xor(id, list).filter((c) => c);
    id = _.pullAll(id, list);
    console.log("list which needs to be deleted is:");
    console.log(list);
    console.log("id that cant't be deleted is:");
    console.log(id);

    const userId = user.filter((user) => {
      if (_.includes(list, user.studentId)) return user.userId;
    });

    console.log("after filtering userId");
    console.log(userId);

    // const result = await Promise.all(
    //   userId.map(async (user) => {
    //     const student = await strapi
    //       .query("student")
    //       .delete({ id: user.studentId });
    //     // console.log(student);
    //     const userData = await strapi
    //       .query("user", "users-permissions")
    //       .delete({ id: user.userId });
    //     //console.log(userData);

    //     return { student: student, user: userData };
    //   })
    // );
    // console.log(result);

    //Add return statement with relevent details.

    // await bookshelf
    //   .transaction(async (t) => {
    //     const student = await bookshelf
    //       .model("student")
    //       .where({ id: list })
    //       .destroy({ transacting: t });
    //     console.log(student);
    //     return await bookshelf
    //       .model("user")
    //       .where({ id: userId })
    //       .destroy({ transacting: t });
    //   })
    //   .then((result) => {
    //     console.log(result);
    //     return ctx.send(utils.getResponse(result));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     return ctx.response.badRequest(`Invalid ${error.detail}`);
    //   });
  },
};
