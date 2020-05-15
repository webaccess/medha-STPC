const { PLUGIN } = require("../../../config/constants");
const { buildQuery } = require("strapi-utils");
const { sanitizeEntity } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

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
          "contact.user.rpc"
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
          .filter(individual => (individual.organization.id = orgId))
          .reduce((result, individual) => {
            const user = individual.contact && individual.contact.user;
            if (user && user.role.name == "Student") {
              individual.contact.user = sanitizeUser(individual.contact.user);
              result.push(individual);
            }
            return result;
          }, []);
      });

    return individuals;
  }
};
