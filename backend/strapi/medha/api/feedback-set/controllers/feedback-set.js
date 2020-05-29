"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const _ = require("lodash");
const bookshelf = require("../../../config/bookshelf.js");
const utils = require("../../../config/utils");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const { sanitizeEntity } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("feedback-set")
      .model.query(
        buildQuery({
          model: strapi.models["feedback-set"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("feedback-set") : pageSize
      })
      .then(res => {
        const data = utils.getPaginatedResponse(res);
        // if (data.result) {
        //   data.result = data.result.reduce((result, feedback) => {
        //     feedback.user = sanitizeUser(feedback.user);
        //     result.push(feedback);
        //     return result;
        //   }, []);
        // }
        return data;
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("feedback-set").findOne({ id });
    const checkFeedbackForTheEventPresent = await strapi
      .query("feedback")
      .find({ feedback_set: id }, [
        "feedback_set",
        "question",
        "question.role"
      ]);
    const questions = checkFeedbackForTheEventPresent.map(res => {
      res.question["answer_text"] = res.answer_text;
      res.question["answer_int"] = res.answer_int;
      return res.question;
    });

    response.questions = questions;
    return utils.getFindOneResponse(response);
  },

  async create(ctx) {
    const {
      activity,
      event,
      contact,
      question_set,
      questions_answers
    } = ctx.request.body;

    if (
      !_.has(ctx.request.body, "activity") ||
      !_.has(ctx.request.body, "event") ||
      !_.has(ctx.request.body, "contact") ||
      !_.has(ctx.request.body, "question_set") ||
      !_.has(ctx.request.body, "questions_answers")
    ) {
      return ctx.response.badRequest("Bad request, fields improper");
    }

    if (!event && !activity) {
      return ctx.response.badRequest(`No event and activity data`);
    }

    if (!questions_answers.length) {
      return Promise.reject({ column: "No questions assigned" });
    }

    if (event) {
      let resLength = 0;
      const result = await strapi
        .query("feedback-set")
        .find({ event: event, contact: contact, question_set: question_set })
        .then(res => {
          resLength = res.length;
        });

      if (resLength > 0) {
        return ctx.response.badRequest(`FeedBack Data already present`);
      }
    }

    if (activity) {
      let resLength = 0;
      const result = await strapi
        .query("feedback-set")
        .find({
          activity: activity,
          contact: contact,
          question_set: question_set
        })
        .then(res => {
          resLength = res.length;
        });

      if (resLength > 0) {
        return ctx.response.badRequest(`FeedBack Data already present`);
      }
    }

    const feedBackRequestBody = {
      activity: activity,
      event: event,
      contact: contact,
      question_set: question_set
    };

    await bookshelf
      .transaction(async t => {
        return await bookshelf
          .model("feedback-set")
          .forge(feedBackRequestBody)
          .save(null, { transacting: t })
          .then(async res => {
            await utils.asyncForEach(
              questions_answers,
              async question_answers => {
                if (question_answers !== undefined) {
                  const {
                    question_id,
                    answer_int,
                    answer_text,
                    type
                  } = question_answers;

                  if (type === "Rating") {
                    const responseData = {
                      feedback_set: res.id,
                      question: question_id,
                      answer_int: answer_int,
                      answer_text: null
                    };

                    const _responses = await bookshelf
                      .model("feedback")
                      .forge(responseData)
                      .save(null, { transacting: t })
                      .then(res => res.toJSON());
                  }

                  if (type === "Comment") {
                    const responseData = {
                      feedback_set: res.id,
                      question: question_id,
                      answer_int: null,
                      answer_text: answer_text
                    };

                    const _responses = await bookshelf
                      .model("feedback")
                      .forge(responseData)
                      .save(null, { transacting: t })
                      .then(res => res.toJSON());
                  }
                }
              }
            );
          });
      })
      .then(success => {
        console.log(success);
        return ctx.send(utils.getResponse(success));
      })
      .catch(error => {
        console.log(error);
        return ctx.response.badRequest(`Invalid ${error.column}`);
      });
  },

  async update(ctx) {
    const { id } = ctx.params;

    const {
      activity,
      event,
      contact,
      question_set,
      questions_answers
    } = ctx.request.body;

    if (
      !_.has(ctx.request.body, "activity") ||
      !_.has(ctx.request.body, "event") ||
      !_.has(ctx.request.body, "contact") ||
      !_.has(ctx.request.body, "question_set") ||
      !_.has(ctx.request.body, "questions_answers")
    ) {
      return ctx.response.badRequest("Bad request, fields improper");
    }

    if (!event && !activity) {
      return ctx.response.badRequest(`No event and activity data`);
    }

    if (!questions_answers.length) {
      return Promise.reject({ column: "No questions assigned" });
    }

    const isDataPresent = await strapi.query("feedback-set").find({
      activity: activity,
      event: event,
      contact: contact,
      question_set: question_set
    });

    if (!isDataPresent.length) {
      return ctx.response.badRequest(`FeedBack Data Not present`);
    }

    await bookshelf
      .transaction(async t => {
        await utils.asyncForEach(questions_answers, async question_answers => {
          if (question_answers !== undefined) {
            const {
              question_id,
              answer_int,
              answer_text,
              type
            } = question_answers;

            const responseData = {
              feedback_set: id,
              question: question_id,
              answer_int: answer_int,
              answer_text: answer_text
            };

            await bookshelf
              .model("feedback")
              .where({ feedback_set: id, question: question_id })
              .save(responseData, { transacting: t, patch: true })
              .then(model => model)
              .catch(error => {
                console.log(error);
                return null;
              });
          }
        });
      })
      .then(success => {
        console.log(success);
        return ctx.send(utils.getResponse(success));
      })
      .catch(error => {
        console.log(error);
        return ctx.response.badRequest(`Invalid ${error.column}`);
      });
  }
};
