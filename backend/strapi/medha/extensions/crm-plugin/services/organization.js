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
      .fetchAll({
        withRelated: [
          "contact.state",
          "contact.district",
          "zone",
          "rpc",
          "tpos",
          "stream_strength"
        ]
      })
      .then(res => res.toJSON());

    return orgs;
  }
};
