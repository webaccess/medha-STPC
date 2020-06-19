const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: "5432",
    user: "medha",
    password: "medha",
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

bookshelf.model("user", {
  tableName: "users-permissions_user",
  requireFetch: false
});

bookshelf.model("futureaspiration", {
  tableName: "futureaspirations",
  requireFetch: false
});

bookshelf.model("uploadMorph", {
  requireFetch: false,
  tableName: "upload_file_morph"
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

bookshelf.model("activityassignee", {
  requireFetch: false,
  tableName: "activityassignee"
});

bookshelf.model("feedback", {
  tableName: "feedbacks"
});

bookshelf.model("feedback-set", {
  tableName: "feedback_sets"
});

bookshelf.model("board", {
  requireFetch: false,
  tableName: "boards"
});

bookshelf.model("dashboard", {
  requireFetch: false,
  tableName: "dashboards"
});

bookshelf.model("organization", {
  requireFetch: false,
  tableName: "organizations"
});

bookshelf.model("contact", {
  requireFetch: false,
  tableName: "contacts"
});

module.exports = bookshelf;
