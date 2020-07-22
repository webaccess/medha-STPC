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
          "contact",
          "contact.addresses",
          "contact.addresses.state",
          "zone",
          "rpc",
          "tpos",
          "principal",
          "stream_strength",
          "stream_strength.stream"
        ]
      })
      .then(res => res.toJSON());

    return orgs;
  }
};
