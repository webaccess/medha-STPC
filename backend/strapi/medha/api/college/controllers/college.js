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

    /**
     * public route for colleges
     */
    if (!ctx.state.user) {
      return await bookshelf
        .model("college")
        .query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize: pageSize,
          columns: ["id", "name"]
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    /**
     * Authenticated user routes
     */

    const { role, rpc, zone, college } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      return await bookshelf
        .model("college")
        .query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize: pageSize,
          withRelated: [
            "stream_strength.streams.stream",
            "district",
            "principal",
            "admins.role",
            "rpc"
          ]
        })
        .then(res => {
          const data = utils.getPaginatedResponse(res);
          /**
           * Here college.admins return all users associated with that college
           * We need only admins not all users
           * So we are filtering only those users whose role is `College Admin`
           */
          const response = data.result.reduce((acc, college) => {
            const collegeAdmins = college.admins
              .map(admin => {
                if (admin.role.name === "College Admin") {
                  return sanitizeUser(admin);
                }
              })
              .filter(a => a);
            college.admins = collegeAdmins;

            const streams = college.stream_strength.map(
              stream => stream.streams
            );
            college.stream_strength = streams;

            acc.push(college);
            return acc;
          }, []);
          data.result = response;
          return data;
        });
    }

    if (role.name === "Zonal Admin") {
      return await bookshelf
        .model("college")
        .query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .fetchPage({
          require: false,
          page: page,
          pageSize: pageSize,
          withRelated: [
            "stream_strength.streams.stream",
            "district",
            "principal",
            "admins.role",
            "rpc",
            {
              rpc: query => {
                query.where({
                  zone: zone
                });
              }
            }
          ]
        })
        .then(res => {
          const data = utils.getPaginatedResponse(res);
          const response = data.result.reduce((accumulator, obj) => {
            /**
             * Here we need to find all colleges under zonal admin
             * But we don't have direct relation between zone and college
             * So by using rpc we are getting zone and then filtering those colleges whose
             * zone is zonal admin's zone
             *
             */
            if (Object.keys(obj.rpc).length) {
              /**
               * Here college.admins return all users associated with that college
               * We need only admins not all users
               * So we are filtering only those users whose role is `College Admin`
               */
              const collegeAdmins = obj.admins
                .map(admin => {
                  if (admin.role.name === "College Admin") {
                    return sanitizeUser(admin);
                  }
                })
                .filter(a => a);
              obj.admins = collegeAdmins;

              const streams = obj.stream_strength.map(stream => stream.streams);
              obj.stream_strength = streams;
              accumulator.push(obj);
            }
            return accumulator;
          }, []);
          data.result = response;
          return data;
        });
    }

    if (role.name === "RPC Admin") {
      return await bookshelf
        .model("college")
        .query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .where({ rpc: rpc })
        .fetchPage({
          page: page,
          pageSize: pageSize,
          withRelated: [
            "stream_strength.streams.stream",
            "district",
            "principal",
            "admins.role",
            "rpc"
          ]
        })
        .then(res => {
          const data = utils.getPaginatedResponse(res);
          const response = data.result.reduce((acc, college) => {
            const collegeAdmins = college.admins
              .map(admin => {
                if (admin.role.name === "College Admin") {
                  return sanitizeUser(admin);
                }
              })
              .filter(a => a);
            college.admins = collegeAdmins;

            const streams = college.stream_strength.map(
              stream => stream.streams
            );
            college.stream_strength = streams;

            acc.push(college);
            return acc;
          }, []);
          data.result = response;
          return data;
        });
    }

    if (role.name === "College Admin") {
      return await bookshelf
        .model("college")
        .query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .where({ id: college })
        .fetchPage({
          page: page,
          pageSize: pageSize,
          withRelated: [
            "stream_strength.streams.stream",
            "district",
            "principal",
            "admins.role",
            "rpc"
          ]
        })
        .then(res => {
          const data = utils.getPaginatedResponse(res);
          const response = data.result.reduce((acc, college) => {
            const collegeAdmins = college.admins
              .map(admin => {
                if (admin.role.name === "College Admin") {
                  return sanitizeUser(admin);
                }
              })
              .filter(a => a);
            college.admins = collegeAdmins;

            const streams = college.stream_strength.map(
              stream => stream.streams
            );
            college.stream_strength = streams;

            acc.push(college);
            return acc;
          }, []);
          data.result = response;
          return data;
        });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("college").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  async showStudents(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return await bookshelf
      .model("student")
      .query(
        buildQuery({
          model: strapi.models.student,
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize,
        withRelated: [
          "user.college",
          "stream",
          "educations",
          {
            user: query => {
              query.where({ college: id });
            }
          }
        ]
      })
      .then(res => {
        const data = utils.getPaginatedResponse(res);
        const response = data.result.reduce((acc, obj) => {
          if (Object.keys(obj.user).length) {
            obj.user = sanitizeUser(obj.user);
            acc.push(obj);
          }
          return acc;
        }, []);
        data.result = response;
        return data;
      });
  }
};
