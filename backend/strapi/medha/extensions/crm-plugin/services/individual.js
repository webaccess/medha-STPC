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
  fetchAllIndividuals: async filters => {
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
          "contact.user.rpc",
          "organization.zone",
          "organization.rpc",
          "organization.contact"
        ]
      })
      .then(res => {
        return res
          .toJSON()
          .map(individual => {
            if (individual.contact) {
              individual.contact.user = sanitizeUser(individual.contact.user);
              return individual;
            }
          })
          .filter(a => a);
      });

    return individuals;
  },

  fetchCollegeStudents: async (orgId, filters) => {
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
          "stream",
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
            if (user && user.role.name == ROLE_STUDENT) {
              individual.contact.user = sanitizeUser(individual.contact.user);
              result.push(individual);
            }
            return result;
          }, []);
      });

    return individuals;
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
