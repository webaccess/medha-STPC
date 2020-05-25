const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: "5432",
    user: "postgres",
    password: "root",
    database: "medha-CRM"
  }
});

const bookshelf = require("bookshelf")(knex);

/**
 * Registering models for bookshelf
 */
bookshelf.model("academic_year", {
  tableName: "academic_years",
  requireFetch: false
});

bookshelf.model("country", {
  tableName: "countries",
  requireFetch: false
});

bookshelf.model("state", {
  tableName: "states",
  requireFetch: false
});

bookshelf.model("zone", {
  tableName: "zones",
  requireFetch: false
});

bookshelf.model("rpc", {
  tableName: "rpcs",
  requireFetch: false
});

bookshelf.model("district", {
  tableName: "districts",
  requireFetch: false
});

bookshelf.model("stream", {
  requireFetch: false,
  tableName: "streams"
});

bookshelf.model("permission", {
  requireFetch: false,
  tableName: "users-permissions_permission"
});

bookshelf.model("role", {
  requireFetch: false,
  tableName: "users-permissions_role"
});

bookshelf.model("college-stream-strength", {
  requireFetch: false,
  tableName: "college_stream_strengths"
});

bookshelf.model("organization-component", {
  requireFetch: false,
  tableName: "organizations_components"
});

bookshelf.model("activity_type", {
  requireFetch: false,
  tableName: "activitytypes"
});

module.exports = bookshelf;
