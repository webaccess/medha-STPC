const { PLUGIN } = require("../../../config/constants");
const { buildQuery } = require("strapi-utils");
const { sanitizeEntity } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });
const {
  ROLE_COLLEGE_ADMIN,
  ROLE_STUDENT
} = require("../../../config/constants");

module.exports = {
  fetchAllIndividuals: async (filters, page, pageSize) => {
    const options = {
      withRelated: [
        "contact.user",
        "organization",
        "contact.user.role",
        "contact.user.state",
        "contact.user.zone",
        "contact.user.rpc",
        "organization.zone",
        "organization.rpc",
        "organization.contact",
        "profile_photo"
      ]
    };

    options.page = page;
    options.pageSize =
      pageSize == -1
        ? await strapi
            .query("individual", PLUGIN)
            .model.query(
              buildQuery({
                model: strapi.query("individual", PLUGIN).model,
                filters
              })
            )
            .count()
        : pageSize;

    const individuals = await strapi
      .query("individual", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("individual", PLUGIN).model,
          filters
        })
      )
      .fetchPage(options);

    const result = individuals.toJSON ? individuals.toJSON() : individuals;
    for await (let record of result) {
      const education = await strapi
        .query("education")
        .findOne({ pursuing: true, contact: record.contact.id }, [
          "year_of_passing"
        ]);
      record.education = education;
      if (record.contact) {
        record.contact.user = sanitizeUser(record.contact.user);
      }
    }

    return {
      result,
      ...individuals.pagination
    };
  },

  fetchCollegeStudents: async (orgId, filters, page, pageSize) => {
    const orgQueryFilter = [
      { field: "organization.id", operator: "eq", value: orgId },
      { field: "contact.user.role.name", operator: "eq", value: "Student" }
    ];

    if (filters.where && filters.where.length > 0) {
      filters.where = [...filters.where, ...orgQueryFilter];
    } else {
      filters.where = [...orgQueryFilter];
    }

    console.log(filters);
    const options = {
      withRelated: [
        "stream",
        "contact.user",
        "organization",
        "contact.user.role",
        "contact.user.state",
        "contact.user.zone",
        "contact.user.rpc"
      ]
    };

    options.page = page;
    options.pageSize =
      pageSize == -1
        ? await strapi
            .query("individual", PLUGIN)
            .model.query(
              buildQuery({
                model: strapi.query("individual", PLUGIN).model,
                filters
              })
            )
            .count()
        : pageSize;

    const individuals = await strapi
      .query("individual", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("individual", PLUGIN).model,
          filters
        })
      )
      .fetchPage(options);

    const result = individuals.toJSON ? individuals.toJSON() : individuals;

    for await (let record of result) {
      const education = await strapi
        .query("education")
        .findOne({ pursuing: true, contact: record.contact.id }, [
          "year_of_passing"
        ]);
      record.education = education;
      if (record.contact) {
        record.contact.user = sanitizeUser(record.contact.user);
      }
    }

    return {
      result,
      ...individuals.pagination
    };
  },

  fetchCollegeAdmins: async (orgId, filters) => {
    const individuals = await strapi
      .query("individual", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("individual", PLUGIN).model,
          filters
        })
      )
      .fetchAll({
        withRelated: [
          "contact.user",
          "organization",
          "contact.user.role",
          "contact.user.state",
          "contact.user.zone",
          "contact.user.rpc"
        ]
      })
      .then(res => {
        return res
          .toJSON()
          .filter(individual => {
            if (
              individual.organization !== null &&
              individual.organization.id !== null
            ) {
              return individual.organization.id == orgId;
            }
          })
          .reduce((result, individual) => {
            const user = individual.contact && individual.contact.user;
            if (user && user.role.name == ROLE_COLLEGE_ADMIN) {
              individual.contact.user = sanitizeUser(individual.contact.user);
              result.push(individual);
            }
            return result;
          }, []);
      });

    return individuals;
  }
};
