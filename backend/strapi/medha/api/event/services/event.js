"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const _ = require("lodash");
const { PLUGIN } = require("../../../config/constants");
const { sanitizeEntity, buildQuery } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });
const bookshelf = require("../../../config/config.js");
const utils = require("../../../config/utils.js");

module.exports = {
  getIndividuals: async (eventId, collegeId, filters) => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const registeredStudentsForEvent = await strapi
      .query("event-registration")
      .find({
        event: eventId
      });

    const registeredStudentContactIds = registeredStudentsForEvent.map(
      rsfe => rsfe.contact.id
    );

    let response = await strapi
      .query("contact", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.plugins["crm-plugin"].models["contact"],
          filters
        })
      )
      .fetchAll({
        withRelated: [
          "state",
          "district",
          "individual.stream",
          "user",
          "activityassignees",
          "contacttags"
        ]
      })
      .then(model => model.toJSON());
    /**
     * Filtering student with user role
     * then with organization Id
     * then with is_verified to true
     */
    const filtered = response.reduce((result, contact) => {
      const { user, individual } = contact;
      if (
        user &&
        individual &&
        user.role == studentRole.id &&
        individual.organization == collegeId &&
        individual.is_verified &&
        !_.includes(registeredStudentContactIds, contact.id)
      ) {
        contact.user = sanitizeUser(user);
        delete contact.activityassignees;
        result.push(contact);
      }
      return result;
    }, []);

    return filtered;
  },

  getEvents: async (college, events) => {
    const filtered = events.filter(event => {
      const { contacts, rpc, zone, state } = event;

      /**
       * Since colleges might be empty array
       * If Event has particular colleges then filter by colleges
       * If Event has RPC and Zone then get student college's RPC and Zone
       * If Event has either RPC or Zone then get student college's RPC or Zone
       *
       *
       * TODO:
       * Since college don't have state attribute in their schema we need to filter state either
       * from RPC or Zone
       * Currently we only have one state so we are returning event directly
       * since it won't affect response
       * But when we have case where we have more than 1 state then in that case we'll filter
       * state either from rpc or zone from college
       */

      const isCollegesExist = contacts.length > 0 ? true : false;
      const isRPCExist = rpc && Object.keys(rpc).length > 0 ? true : false;
      const isZoneExist = zone && Object.keys(zone).length > 0 ? true : false;
      const isStateExist =
        state && Object.keys(state).length > 0 ? true : false;

      if (isRPCExist && isZoneExist && !isCollegesExist) {
        if (rpc.id == college.rpc.id && zone.id == college.zone.id)
          return event;
      } else if (isRPCExist && !isCollegesExist) {
        if (rpc.id == college.rpc.id) return event;
      } else if (isZoneExist && !isCollegesExist) {
        if (zone.id == college.zone.id) return event;
      } else if (isCollegesExist) {
        const isExist = contacts.filter(c => c.organization == college.id);
        if (isExist && isExist.length > 0) return event;
      } else {
        return event;
      }
    });

    return filtered;
  },

  getAggregateFeedbackForOneEventOfCollege: async (eventId, collegeId) => {
    const event = await strapi.query("event").findOne({ id: eventId });

    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }

    if (!event.question_set) {
      return ctx.response.notFound("No question set");
    }

    const checkIfFeedbackPresent = await strapi
      .query("feedback-set")
      .find({ event: eventId, question_set: event.question_set.id });

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

    students = students.map(student => {
      student.user = sanitizeUser(student.user);
      return student;
    });

    const students_contact_id = students.map(student => {
      return student.id;
    });

    const checkFeedbackForTheEventPresent = await strapi
      .query("feedback-set")
      .find({
        event: eventId,
        contact_in: students_contact_id,
        question_set: event.question_set.id
      });

    if (!checkFeedbackForTheEventPresent.length) {
      return ctx.response.notFound("No feedback given by college students");
    }

    let question_set = null;
    const feedback_set_id = checkFeedbackForTheEventPresent.map(res => {
      question_set = res.question_set.id;
      return res.id;
    });

    const event_question_set = await strapi.query("question-set").findOne(
      {
        id: question_set
      },
      ["questions.role"]
    );

    /** This basically gets questions id to which we will store our aggregate data */
    let question_ids = [];
    const question_ratings = event_question_set.questions
      .map(data => {
        if (data.role.name === "Student" && data.type === "Rating") {
          question_ids.push(data["id"]);
          return {
            id: data["id"],
            title: data["title"],
            result: 0
          };
        }
      })
      .filter(data => {
        return data !== undefined;
      });

    const feedback_response_data = await strapi.query("feedback").find({
      question_in: question_ids,
      feedback_set_in: feedback_set_id
    });

    const result = {};
    feedback_response_data.map(res => {
      if (result.hasOwnProperty(res.question.id)) {
        result[res.question.id] = result[res.question.id] + res.answer_int;
      } else {
        result[res.question.id] = res.answer_int;
      }
    });

    question_ratings.map(res => {
      res.result = Math.round(result[res.id] / feedback_set_id.length);
    });

    return {
      total: feedback_set_id.length,
      ratings: question_ratings
    };
  }
};
