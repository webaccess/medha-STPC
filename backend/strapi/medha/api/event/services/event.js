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

module.exports = {
  checkIfEventExist: async (ctx, eventId) => {
    const event = await strapi.query("event").findOne({ id: eventId });
    if (!event) {
      return ctx.response.notFound("Event does not exist");
    }
    if (!event.question_set) {
      return ctx.response.notFound("No question set");
    }
    return event;
  },
  getIndividuals: async (eventId, collegeId, filters) => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" }, []);

    const registeredStudentsForEvent = await strapi
      .query("event-registration")
      .find({
        event: eventId
      });

    const registeredStudentContactIds = registeredStudentsForEvent.map(
      rsfe => rsfe.contact.id
    );

    /**
     * Filtering student with user role
     * then with organization Id
     * then with is_verified to true
     */

    const contactFilter = [
      { field: "user.role", operator: "eq", value: studentRole.id },
      { field: "individual.organization", operator: "eq", value: collegeId },
      { field: "individual.is_verified", operator: "eq", value: true },
      { field: "id", operator: "nin", value: registeredStudentContactIds }
    ];

    if (filters.where && filters.where.length > 0) {
      filters.where = [...filters.where, ...contactFilter];
    } else {
      filters.where = [...contactFilter];
    }

    const options = {
      withRelated: [
        "addresses",
        "individual.stream",
        "user",
        "activityassignees",
        "contacttags"
      ]
    };

    let response = await strapi
      .query("contact", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.plugins["crm-plugin"].models["contact"],
          filters
        })
      )
      .fetchAll(options);

    let contacts = response.toJSON ? response.toJSON() : response;

    contacts.forEach(contact => {
      if (contact.user) {
        contact.user = sanitizeUser(contact.user);
      }
      delete contact.activityassignees;
    });

    return contacts;
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

  /** Gets aggregate feedback for an event for multiple conatcts and for a specific role */
  getAggregateFeedbackForEvent: async (ctx, event, contacts, role) => {
    /** This gets role */
    const roleDetails = await strapi
      .query("role", "users-permissions")
      .findOne({ name: role }, []);

    const checkFeedbackForTheEventPresent = await strapi
      .query("feedback-set")
      .find({
        event: event.id,
        contact_in: contacts,
        question_set: event.question_set.id,
        role: roleDetails.id
      });

    if (!checkFeedbackForTheEventPresent.length) {
      return ctx.response.notFound("No feedback available");
    }

    let question_set = event.question_set.id;
    const feedback_set_id = checkFeedbackForTheEventPresent.map(res => {
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
        if (data.role.name === role && data.type === "Rating") {
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
      dataForRole: role,
      total: feedback_set_id.length,
      ratings: question_ratings
    };
  },

  /** Gets aggregate feedback for an actiity for multiple conatcts and for a specific role */
  getAggregateFeedbackForActivity: async (ctx, activity, contacts, role) => {
    /** This gets role */
    const roleDetails = await strapi
      .query("role", "users-permissions")
      .findOne({ name: role }, []);

    const checkFeedbackForTheEventPresent = await strapi
      .query("feedback-set")
      .find({
        activity: activity.id,
        contact_in: contacts,
        question_set: activity.question_set.id,
        role: roleDetails.id
      });

    if (!checkFeedbackForTheEventPresent.length) {
      return ctx.response.notFound("No feedback available");
    }

    let question_set = activity.question_set.id;
    const feedback_set_id = checkFeedbackForTheEventPresent.map(res => {
      return res.id;
    });

    const activity_question_set = await strapi.query("question-set").findOne(
      {
        id: question_set
      },
      ["questions.role"]
    );

    /** This basically gets questions id to which we will store our aggregate data */
    let question_ids = [];
    const question_ratings = activity_question_set.questions
      .map(data => {
        if (data.role.name === role && data.type === "Rating") {
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
      dataForRole: role,
      total: feedback_set_id.length,
      ratings: question_ratings
    };
  },

  /** Get all comments for a particular role */
  getAllCommentsForEvent: async (ctx, event, contacts, role) => {
    const roleDetails = await strapi
      .query("role", "users-permissions")
      .findOne({ name: role }, []);

    const checkFeedbackForTheEventPresent = await strapi
      .query("feedback-set")
      .find({
        event: event.id,
        contact_in: contacts,
        question_set: event.question_set.id,
        role: roleDetails.id
      });

    if (!checkFeedbackForTheEventPresent.length) {
      return ctx.response.notFound("No feedback ");
    }

    let question_set = event.question_set.id;
    const feedback_set_id = checkFeedbackForTheEventPresent.map(res => {
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
    const questions = event_question_set.questions
      .map(data => {
        if (data.role.name === role) {
          question_ids.push(data["id"]);
          return data;
        }
      })
      .filter(data => {
        return data !== undefined;
      });

    const feedback_response_data = await strapi.query("feedback").find(
      {
        question_in: question_ids,
        feedback_set_in: feedback_set_id
      },
      [
        "question",
        "feedback_set.contact",
        "feedback_set.contact.user",
        "feedback_set.contact.user.zone",
        "feedback_set.contact.user.rpc",
        "feedback_set.contact.individual",
        "feedback_set.contact.individual.stream",
        "feedback_set.contact.individual.organization"
      ]
    );
    let finalResult = {};
    let result = [];
    feedback_response_data.map(res => {
      if (finalResult.hasOwnProperty(res.feedback_set.contact.id)) {
        finalResult[res.feedback_set.contact.id][res.question.title] = "";

        if (res.question.type === "Comment") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_text;
        } else if (res.question.type === "Rating") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_int;
        }
      } else {
        if (role === "College Admin") {
          finalResult[res.feedback_set.contact.id] = {
            "College Name": res.feedback_set.contact.individual.organization
              ? res.feedback_set.contact.individual.organization.name
              : ""
          };
        } else if (role === "Student") {
          finalResult[res.feedback_set.contact.id] = {
            "College Name": res.feedback_set.contact.individual.organization
              ? res.feedback_set.contact.individual.organization.name
              : "",

            "Student Name": res.feedback_set.contact.name,
            "Roll number": res.feedback_set.contact.individual
              ? res.feedback_set.contact.individual.roll_number
              : "",
            Stream: res.feedback_set.contact.individual.stream
              ? res.feedback_set.contact.individual.stream.name
              : ""
          };
        } else if (role === "RPC Admin") {
          finalResult[res.feedback_set.contact.id] = {
            "RPC Name": res.feedback_set.contact.user.rpc
              ? res.feedback_set.contact.user.rpc.name
              : ""
          };
        } else if (role === "Zonal Admin") {
          finalResult[res.feedback_set.contact.id] = {
            "Zone Name": res.feedback_set.contact.user.zone
              ? res.feedback_set.contact.user.zone.name
              : ""
          };
        }

        questions.map(ques => {
          if (ques.type === "Rating") {
            finalResult[res.feedback_set.contact.id][ques.title] = 0;
          } else if (ques.type === "Comment") {
            finalResult[res.feedback_set.contact.id][ques.title] = "";
          }
        });

        if (res.question.type === "Comment") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_text;
        } else if (res.question.type === "Rating") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_int;
        }
      }
    });

    for (var key of Object.keys(finalResult)) {
      result.push(finalResult[key]);
    }
    return result;
  },

  /** Get all comments for a particular role for activity*/
  getAllCommentsForActivity: async (ctx, activity, contacts, role) => {
    const roleDetails = await strapi
      .query("role", "users-permissions")
      .findOne({ name: role }, []);

    const checkFeedbackForActivity = await strapi.query("feedback-set").find({
      activity: activity.id,
      contact_in: contacts,
      question_set: activity.question_set.id,
      role: roleDetails.id
    });

    if (!checkFeedbackForActivity.length) {
      return ctx.response.notFound("No feedback ");
    }

    let question_set = activity.question_set.id;
    const feedback_set_id = checkFeedbackForActivity.map(res => {
      return res.id;
    });

    const activity_question_set = await strapi.query("question-set").findOne(
      {
        id: question_set
      },
      ["questions.role"]
    );

    /** This basically gets questions id to which we will store our aggregate data */
    let question_ids = [];
    const questions = activity_question_set.questions
      .map(data => {
        if (data.role.name === role) {
          question_ids.push(data["id"]);
          return data;
        }
      })
      .filter(data => {
        return data !== undefined;
      });

    const feedback_response_data = await strapi.query("feedback").find(
      {
        question_in: question_ids,
        feedback_set_in: feedback_set_id
      },
      [
        "question",
        "feedback_set.contact",
        "feedback_set.contact.user",
        "feedback_set.contact.user.zone",
        "feedback_set.contact.user.rpc",
        "feedback_set.contact.individual",
        "feedback_set.contact.individual.stream",
        "feedback_set.contact.individual.organization"
      ]
    );
    let finalResult = {};
    let result = [];
    feedback_response_data.map(res => {
      if (finalResult.hasOwnProperty(res.feedback_set.contact.id)) {
        finalResult[res.feedback_set.contact.id][res.question.title] = "";

        if (res.question.type === "Comment") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_text;
        } else if (res.question.type === "Rating") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_int;
        }
      } else {
        if (role === "College Admin") {
          finalResult[res.feedback_set.contact.id] = {
            "College Name": res.feedback_set.contact.individual.organization
              ? res.feedback_set.contact.individual.organization.name
              : ""
          };
        } else if (role === "Student") {
          finalResult[res.feedback_set.contact.id] = {
            "College Name": res.feedback_set.contact.individual.organization
              ? res.feedback_set.contact.individual.organization.name
              : "",

            "Student Name": res.feedback_set.contact.name,
            "Roll number": res.feedback_set.contact.individual
              ? res.feedback_set.contact.individual.roll_number
              : "",
            Stream: res.feedback_set.contact.individual.stream
              ? res.feedback_set.contact.individual.stream.name
              : ""
          };
        } else if (role === "RPC Admin") {
          finalResult[res.feedback_set.contact.id] = {
            "RPC Name": res.feedback_set.contact.user.rpc
              ? res.feedback_set.contact.user.rpc.name
              : ""
          };
        } else if (role === "Zonal Admin") {
          finalResult[res.feedback_set.contact.id] = {
            "Zone Name": res.feedback_set.contact.user.zone
              ? res.feedback_set.contact.user.zone.name
              : ""
          };
        }

        questions.map(ques => {
          if (ques.type === "Rating") {
            finalResult[res.feedback_set.contact.id][ques.title] = 0;
          } else if (ques.type === "Comment") {
            finalResult[res.feedback_set.contact.id][ques.title] = "";
          }
        });

        if (res.question.type === "Comment") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_text;
        } else if (res.question.type === "Rating") {
          finalResult[res.feedback_set.contact.id][res.question.title] =
            res.answer_int;
        }
      }
    });

    for (var key of Object.keys(finalResult)) {
      result.push(finalResult[key]);
    }
    return result;
  }
};
