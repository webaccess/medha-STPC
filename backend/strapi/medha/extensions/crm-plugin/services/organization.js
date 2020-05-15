const { PLUGIN } = require("../../../config/constants");
const { buildQuery } = require("strapi-utils");

module.exports = {
  fetchAllOrgs: async filters => {
    const orgs = await strapi
      .query("organization", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("organization", PLUGIN).model,
          filters
        })
      )
      .fetchAll()
      .then(res => res.toJSON());

    return orgs;
  }
};
