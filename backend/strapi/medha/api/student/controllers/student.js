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
    console.log(requestBody);
    console.log(ctx.params);
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
        "educations"
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
    console.log(studentRequestData);
    //console.log(userRequestBody);
    await bookshelf
      .transaction(async t => {
        const userModel = await bookshelf
          .model("user")
          .where({ id: userRequestBody.id })
          .fetch({ lock: "forUpdate", transacting: t, require: false });
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
              district: studentRequestData.district
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

    const response = utils.paginate(result, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  async activity(ctx) {
    const { id } = ctx.params;

    const student = await strapi.query("student").findOne({ id });

    const activityBatch = await strapi
      .query("activity-batch-attendance")
      .find({ student: id });

    if (!activityBatch.length)
      return ctx.response.notFound("Student not Enrolled in any event");
    if (activityBatch) {
      const activityIds = activityBatch.map(
        activityBatch => activityBatch.activity_batch.activity
      );
      console.log(activityBatch);
      const activity = await strapi.query("activity").find({ id: activityIds });
      // console.log(activity);

      const result = activity.map(activity => {
        for (let i = 0; i < activityBatch.length; i++) {
          if (activity.id === activityBatch[i].activity_batch.activity) {
            activity["activity_batch"] = activityBatch[i].activity_batch;
            return activity;
          }
        }
      });

      console.log(result);
      return utils.getFindOneResponse(result);
    }
  },
  /**
   * Registered events info
   *
   */
  async registeredEvents(ctx) {
    const { id } = ctx.params;

    return await strapi.query("event-registration").find({ student: id });
  }
};
