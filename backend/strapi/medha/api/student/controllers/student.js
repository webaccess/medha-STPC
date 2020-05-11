"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { sanitizeEntity } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });
const _ = require("lodash");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
module.exports = {
  /**
   * Retrieve authenticated student.
   * @return {Object}
   */
  // TODO replace with strapi
  async register(ctx) {
    const { otp, contact_number } = ctx.request.body;
    if (!otp) {
      return ctx.response.badRequest("OTP is missing");
    }

    if (!contact_number) {
      return ctx.response.badRequest("Contact no. is missing");
    }

    const collegeId = ctx.request.body.college_id;

    const college = await bookshelf
      .model("college")
      .where({ id: collegeId })
      .fetch({ require: false })
      .then(data => {
        return data ? data.toJSON() : null;
      });

    if (!college) {
      return ctx.response.notFound("College does not exist");
    }
    const rpc = await bookshelf
      .model("rpc")
      .where({ id: college.rpc })
      .fetch({ require: false })
      .then(data => {
        return data ? data.toJSON() : null;
      });

    if (!rpc) {
      return ctx.response.notFound("RPC does not exist");
    }

    const zone = await bookshelf
      .model("zone")
      .where({ id: college.zone })
      .fetch({ require: false })
      .then(data => {
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
        blocked: false
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
        "college_id"
      ])
    );

    userRequestBody.password = await strapi.plugins[
      "users-permissions"
    ].services.user.hashPassword(userRequestBody);

    await bookshelf
      .transaction(async t => {
        await bookshelf
          .model("otp")
          .where({
            contact_number: contact_number,
            otp: otp,
            is_verified: null
          })
          .fetch({ lock: "forUpdate", transacting: t, require: false })
          .then(otpModel => {
            if (!otpModel) {
              return Promise.reject({ column: "Please request new OTP" });
            }
            const otpData = otpModel.toJSON();
            const createdAt = new Date(otpData.created_at);
            const currentDate = new Date();
            const diff = (currentDate.getTime() - createdAt.getTime()) / 60000;
            if (diff > 60.0) {
              return Promise.reject({ column: "OTP is invalid or expired" });
            }

            otpModel.save(
              { is_verified: true },
              { patch: true, transacting: t }
            );
          });

        const _user = await bookshelf
          .model("user")
          .forge(userRequestBody)
          .save(null, { transacting: t })
          .then(userModel => userModel.toJSON());

        const studentRequestData = Object.assign(
          { user: _user.id },
          _.omit(ctx.request.body, [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "contact_number",
            "otp",
            "college_id",
            "state"
          ])
        );
        return await bookshelf
          .model("student")
          .forge(studentRequestData)
          .save(null, { transacting: t });
      })
      .then(success => {
        console.log(success);
        return ctx.send(utils.getResponse(success));
      })
      .catch(error => {
        console.log(error);
        return ctx.response.badRequest(`Invalid ${error.detail}`);
      });
  },

  async edit(ctx) {
    const requestBody = ctx.request.body;
    const admin = ctx.state.user;

    const userRequestBody = Object.assign(
      {},
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
        "college",
        "verifiedByCollege",
        "documents",
        "educations",
        "future_aspirations"
      ])
    );

    const studentRequestData = Object.assign(
      { user: userRequestBody.id },
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
        "id",
        "provider",
        "confirmed",
        "blocked",
        "role"
      ])
    );
    const user = await strapi.plugins["users-permissions"].services.user.fetch({
      id: userRequestBody.id
    });

    let validPassword;
    if (_.has(userRequestBody, "password") && user.password == null) {
      validPassword = false;
    }

    if (_.has(userRequestBody, "password") && user.password != null) {
      validPassword = strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(userRequestBody.password, user.password);
    }

    await bookshelf
      .transaction(async t => {
        const userModel = await bookshelf
          .model("user")
          .where({ id: userRequestBody.id })
          .fetch({ lock: "forUpdate", transacting: t, require: false });

        if (validPassword == undefined) {
          userModel
            .save(
              {
                username: userRequestBody.username,
                email: userRequestBody.email,
                role: userRequestBody.role,
                first_name: userRequestBody.first_name,
                last_name: userRequestBody.last_name,
                contact_number: userRequestBody.contact_number,
                state: userRequestBody.state,
                zone: userRequestBody.zone,
                rpc: userRequestBody.rpc,

                confirmed: userRequestBody.confirmed,
                blocked: userRequestBody.blocked
              },
              { patch: true, transacting: t }
            )
            .catch(err => {
              return Promise.reject({ Error: err });
            });
        }

        if (validPassword == false && admin.role.name === "College Admin") {
          userRequestBody.password = await strapi.plugins[
            "users-permissions"
          ].services.user.hashPassword(userRequestBody);
          userModel
            .save(
              {
                username: userRequestBody.username,
                email: userRequestBody.email,
                role: userRequestBody.role,
                first_name: userRequestBody.first_name,
                last_name: userRequestBody.last_name,
                contact_number: userRequestBody.contact_number,
                state: userRequestBody.state,
                zone: userRequestBody.zone,
                rpc: userRequestBody.rpc,
                password: userRequestBody.password,
                confirmed: userRequestBody.confirmed,
                blocked: userRequestBody.blocked
              },
              { patch: true, transacting: t }
            )
            .catch(err => {
              return Promise.reject({ Error: err });
            });
        }
        if (validPassword) {
          console.log("password matched");
          userModel
            .save(
              {
                username: userRequestBody.username,
                email: userRequestBody.email,
                role: userRequestBody.role,
                first_name: userRequestBody.first_name,
                last_name: userRequestBody.last_name,
                contact_number: userRequestBody.contact_number,
                state: userRequestBody.state,
                zone: userRequestBody.zone,
                rpc: userRequestBody.rpc,

                confirmed: userRequestBody.confirmed,
                blocked: userRequestBody.blocked
              },
              { patch: true, transacting: t }
            )
            .catch(err => {
              return Promise.reject({ Error: err });
            });
        }
        const studentModel = await bookshelf
          .model("student")
          .where({ id: ctx.params.id })
          .fetch({ lock: "forUpdate", transacting: t, require: false });

        return studentModel
          .save(
            {
              stream: studentRequestData.stream,
              verifiedByCollege: studentRequestData.verifiedByCollege,
              physicallyHandicapped: studentRequestData.physicallyHandicapped,
              father_first_name: studentRequestData.father_first_name,
              father_last_name: studentRequestData.father_last_name,
              address: studentRequestData.address,
              date_of_birth: studentRequestData.date_of_birth,
              gender: studentRequestData.gender,
              roll_number: studentRequestData.roll_number,
              district: studentRequestData.district,
              future_aspirations: studentRequestData.future_aspirations
            },
            { patch: true, transacting: t }
          )
          .catch(err => {
            return Promise.reject({ Error: err });
          });
      })
      .then(success => {
        console.log("In then");
        console.log(success);
        return ctx.send(utils.getResponse(success));
      })
      .catch(error => {
        console.log(error);
        return ctx.response.badRequest(`Invalid ${error.column}`);
      });
  },

  /**
   * Get student educations
   * @return {Object}
   */
  async education(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("education")
      .model.query(
        buildQuery({
          model: strapi.models["education"],
          filters
        })
      )
      .where({ student: id })
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("education") : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  /**
   * Get student documents
   * @return {Object}
   */
  async document(ctx) {
    const { id } = ctx.params;
    const documentId = ctx.query ? ctx.query.id : null;

    const response = await strapi.query("student").findOne({ id });
    if (documentId && response.documents && response.documents.length > 0) {
      response.documents = response.documents.filter(
        doc => doc.id === parseInt(documentId)
      );
    }

    return utils.getFindOneResponse(response ? response.documents : null);
  },

  /**
   * Delete Document
   */

  async deleteDocument(ctx) {
    const { fileId } = ctx.params;
    if (!fileId) {
      return ctx.response.badRequest("File Id is absent");
    }

    const config = await strapi
      .store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "upload"
      })
      .get({ key: "provider" });

    const file = await strapi.plugins["upload"].services.upload.fetch({
      id: fileId
    });

    if (!file) {
      return ctx.notFound("file.notFound");
    }

    const related = await bookshelf
      .model("uploadMorph")
      .where({ upload_file_id: fileId })
      .fetch();

    if (related) {
      console.log("1");
      await related.destroy();
    }

    await strapi.plugins["upload"].services.upload.remove(file, config);

    ctx.send(file);
  },

  /**
   * Academic History
   */
  async academicHistory(ctx) {
    const { id } = ctx.params;
    const academicHistoryId = ctx.query ? ctx.query.id : null;
    let response = await strapi
      .query("academic-history")
      .find({ student: id }, ["academic_year"]);

    if (academicHistoryId && response && response.length > 0) {
      response = response.filter(ah => ah.id === parseInt(academicHistoryId));
    }
    return utils.getFindOneResponse(response);
  },

  /**
   *
   * @param {ids} ctx
   * This will unapprove single or multiple students
   */
  async unapprove(ctx) {
    const { ids } = ctx.request.body;
    let idsToUnApprove;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToUnApprove = [ids];
    }

    if (typeof ids === "object") {
      idsToUnApprove = ids;
    }

    if (!idsToUnApprove.length) {
      return ctx.response.badRequest("Student Ids are empty");
    }

    await strapi
      .query("student")
      .model.query(qb => {
        qb.whereIn("id", idsToUnApprove);
      })
      .save({ verifiedByCollege: false }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   *
   * @param {ids} ctx
   * This will approve single or multiple students
   */
  async approve(ctx) {
    const { ids } = ctx.request.body;
    let idsToApprove;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToApprove = [ids];
    }

    if (typeof ids === "object") {
      idsToApprove = ids;
    }

    if (!idsToApprove.length) {
      return ctx.response.badRequest("Student Ids are empty");
    }

    await strapi
      .query("student")
      .model.query(qb => {
        qb.whereIn("id", idsToApprove);
      })
      .save({ verifiedByCollege: true }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   * @param {id} ctx
   * Get all events for student
   */
  async events(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Extrating the details for query params
    let isRegistered, hasAttended, isHired;

    /**
     * Removing isRegistered,hasAttended, isHired since those
     * are custom fields added and strapi won't allow custom fields if present
     * in query params
     */

    if (_.has(query, "isRegistered")) {
      isRegistered = query.isRegistered;
      delete query.isRegistered;
    }

    if (_.has(query, "hasAttended")) {
      hasAttended = query.hasAttended;
      delete query.hasAttended;
    }

    if (_.has(query, "isHired")) {
      isHired = query.isHired;
      delete query.isHired;
    }

    const filters = convertRestQueryParams(query);

    const student = await strapi
      .query("student")
      .findOne({ id }, ["user.college", "stream"]);

    if (!student) {
      return ctx.response.notFound("Student does not exist");
    }

    const { college } = student.user;
    const { stream } = student;

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    let result;
    /**Filtering college */
    if (college) {
      // Get student college events
      result = await strapi.services.college.getEvents(college, events);
    } else {
      result = events;
    }

    /**Filtering stream */

    if (stream) {
      result = result.filter(event => {
        const { streams } = event;
        const streamIds = streams.map(s => s.id);
        if (streamIds.length == 0 || _.includes(streamIds, stream.id)) {
          return event;
        }
      });
    }

    /** Filtering qualifications */
    const studentEducations = await strapi
      .query("education")
      .find({ student: id });
    result = result.filter(event => {
      const { qualifications } = event;
      let isEligible = true;
      qualifications.forEach(q => {
        const isQualificationPresent = studentEducations.find(
          e =>
            e.qualification == q.qualification && e.percentage >= q.percentage
        );

        if (!isQualificationPresent) {
          isEligible = false;
        }
      });

      if (isEligible) {
        return event;
      }
    });

    /**Filtering educations */
    const academicHistory = await strapi
      .query("academic-history")
      .find({ student: id });

    result = result.filter(event => {
      const { educations } = event;

      let isEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = academicHistory.find(
          ah =>
            ah.education_year == edu.education_year &&
            ah.percentage >= edu.percentage
        );

        if (!isEducationPresent) {
          isEligible = false;
        }
      });

      if (isEligible) {
        return event;
      }
    });

    /**
     * Since event object don't have information regarding
     * student has registered or attended we are getting
     * that information from event registration and then adding that details to
     * original event object
     */
    await utils.asyncForEach(result, async event => {
      const eventRegistrationInfo = await strapi
        .query("event-registration")
        .findOne({ student: id, event: event.id });
      event.isRegistered = eventRegistrationInfo ? true : false;
      event.isHired =
        eventRegistrationInfo && eventRegistrationInfo.hired_at_event
          ? true
          : false;
      event.hasAttended =
        eventRegistrationInfo && eventRegistrationInfo.attendance_verified
          ? true
          : false;
    });

    /**
     * Filtering for custom filters hasAttended, isHired and isRegistered
     */
    if (isRegistered) {
      const _val = isRegistered == "true";
      result = result.filter(event => {
        if (event.isRegistered == _val) return event;
      });
    }

    if (isHired) {
      const _val = isHired == "true";
      result = result.filter(event => {
        if (event.isHired == _val) return event;
      });
    }

    if (hasAttended) {
      const _val = hasAttended == "true";
      result = result.filter(event => {
        if (event.hasAttended == _val) return event;
      });
    }

    const currentDate = new Date();
    result = result.filter(event => {
      const endDate = new Date(event.end_date_time);

      if (endDate.getTime() > currentDate.getTime()) return event;
    });
    const response = utils.paginate(result, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  async activity(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const student = await strapi.query("student").findOne({ id });

    if (!student) return ctx.response.notFound("Student does not exist");

    let activityBatch = await strapi
      .query("activity-batch-attendance")
      .find({ student: id });

    if (!activityBatch.length)
      return ctx.response.notFound("Student not Enrolled in any event");

    const currentDate = new Date();

    activityBatch = activityBatch.filter(activityBatch => {
      const endTime = new Date(activityBatch.activity_batch.end_date_time);

      if (endTime.getTime() > currentDate.getTime()) return activityBatch;
    });

    if (activityBatch) {
      const activityIds = activityBatch.map(
        activityBatch => activityBatch.activity_batch.activity
      );

      const activity = await strapi
        .query("activity")
        .model.query(
          buildQuery({
            model: strapi.models["activity"],
            filters
          })
        )
        .where("id", "in", activityIds)
        .fetchAll()
        .then(model => model.toJSON());
      // console.log(activity);

      const result = activity
        .map(activity => {
          let flag = 0;
          // for (let i = 0; i < activityBatch.length; i++) {
          activityBatch.forEach(activityBatch => {
            if (activity.id === activityBatch.activity_batch.activity) {
              activity["activity_batch"] = activityBatch.activity_batch;
              flag = 1;
            }
          });

          if (flag) return activity;
        })
        .filter(activity => activity);

      const response = utils.paginate(result, page, pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    }
  },
  /**
   * Registered events info
   *
   */
  async registeredEvents(ctx) {
    const { id } = ctx.params;

    return await strapi.query("event-registration").find({ student: id });
  },

  async pastEvents(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Extrating the details for query params
    let isRegistered, hasAttended, isHired;

    /**
     * Removing isRegistered,hasAttended, isHired since those
     * are custom fields added and strapi won't allow custom fields if present
     * in query params
     */

    if (_.has(query, "isRegistered")) {
      isRegistered = query.isRegistered;
      delete query.isRegistered;
    }

    if (_.has(query, "hasAttended")) {
      hasAttended = query.hasAttended;
      delete query.hasAttended;
    }

    if (_.has(query, "isHired")) {
      isHired = query.isHired;
      delete query.isHired;
    }

    const filters = convertRestQueryParams(query);

    const student = await strapi
      .query("student")
      .findOne({ id }, ["user.college", "stream"]);

    if (!student) {
      return ctx.response.notFound("Student does not exist");
    }

    const { college } = student.user;
    const { stream } = student;

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    let result;
    /**Filtering college */
    if (college) {
      // Get student college events
      result = await strapi.services.college.getEvents(college, events);
    } else {
      result = events;
    }

    /**Filtering stream */

    if (stream) {
      result = result.filter(event => {
        const { streams } = event;
        const streamIds = streams.map(s => s.id);
        if (streamIds.length == 0 || _.includes(streamIds, stream.id)) {
          return event;
        }
      });
    }

    /** Filtering qualifications */
    const studentEducations = await strapi
      .query("education")
      .find({ student: id });
    result = result.filter(event => {
      const { qualifications } = event;
      let isEligible = true;
      qualifications.forEach(q => {
        const isQualificationPresent = studentEducations.find(
          e =>
            e.qualification == q.qualification && e.percentage >= q.percentage
        );

        if (!isQualificationPresent) {
          isEligible = false;
        }
      });

      if (isEligible) {
        return event;
      }
    });

    /**Filtering educations */
    const academicHistory = await strapi
      .query("academic-history")
      .find({ student: id });

    result = result.filter(event => {
      const { educations } = event;

      let isEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = academicHistory.find(
          ah =>
            ah.education_year == edu.education_year &&
            ah.percentage >= edu.percentage
        );

        if (!isEducationPresent) {
          isEligible = false;
        }
      });

      if (isEligible) {
        return event;
      }
    });

    /**
     * Since event object don't have information regarding
     * student has registered or attended we are getting
     * that information from event registration and then adding that details to
     * original event object
     */
    await utils.asyncForEach(result, async event => {
      const eventRegistrationInfo = await strapi
        .query("event-registration")
        .findOne({ student: id, event: event.id });
      event.isRegistered = eventRegistrationInfo ? true : false;
      event.isHired =
        eventRegistrationInfo && eventRegistrationInfo.hired_at_event
          ? true
          : false;
      event.hasAttended =
        eventRegistrationInfo && eventRegistrationInfo.attendance_verified
          ? true
          : false;
    });

    /**
     * Filtering for custom filters hasAttended, isHired and isRegistered
     */
    if (isRegistered) {
      const _val = isRegistered == "true";
      result = result.filter(event => {
        if (event.isRegistered == _val) return event;
      });
    }

    if (isHired) {
      const _val = isHired == "true";
      result = result.filter(event => {
        if (event.isHired == _val) return event;
      });
    }

    if (hasAttended) {
      const _val = hasAttended == "true";
      result = result.filter(event => {
        if (event.hasAttended == _val) return event;
      });
    }

    // Filtering events to get past events
    const currentDate = new Date();
    result = result.filter(event => {
      const endDate = new Date(event.end_date_time);

      if (currentDate.getTime() > endDate.getTime()) return event;
    });

    const response = utils.paginate(result, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   *
   * @param {Object} ctx
   * This will return all past activities student has missed and attended
   */
  async pastActivity(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Removing custom query params since strapi won't allow filtering using that
    let status;
    if (query.status) {
      status = query.status;
      delete query.status;
    }

    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    const student = await strapi.query("student").findOne({ id });
    if (!student) return ctx.response.notFound("Student does not exist");

    // Building query depending on query params sent
    let qb = {};
    qb.student = id;
    if (status) {
      qb.verified_by_college = status == "attended" ? true : false;
    }

    let activityBatches = await strapi
      .query("activity-batch-attendance")
      .find(qb);

    if (!activityBatches.length)
      return ctx.response.notFound("Student not Enrolled in any event");

    const currentDate = new Date();

    activityBatches = activityBatches.filter(activityBatch => {
      const endTime = new Date(activityBatch.activity_batch.end_date_time);
      if (currentDate.getTime() > endTime.getTime()) return activityBatch;
    });

    if (activityBatches) {
      const activityIds = activityBatches.map(
        activityBatch => activityBatch.activity_batch.activity
      );

      const activity = await strapi
        .query("activity")
        .model.query(
          buildQuery({
            model: strapi.models["activity"],
            filters
          })
        )
        .where("id", "in", activityIds)
        .fetchAll()
        .then(model => model.toJSON());
      // console.log(activity);

      let result = activity
        .map(activity => {
          let flag = 0;
          // for (let i = 0; i < activityBatch.length; i++) {
          activityBatches.forEach(activityBatch => {
            if (activity.id === activityBatch.activity_batch.activity) {
              activity["activity_batch"] = activityBatch.activity_batch;
              flag = 1;
            }
          });

          if (flag) return activity;
        })
        .filter(activity => activity);

      // Sorting ascending or descending on one or multiple fields
      if (sort && sort.length) {
        result = utils.sort(result, sort);
      }

      const response = utils.paginate(result, page, pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    }
  }
};
