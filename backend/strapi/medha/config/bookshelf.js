const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: "5432",
    user: "postgres",
    password: "root",
    database: "medha"
  }
});

const bookshelf = require("bookshelf")(knex);

/**
 * Registering models for bookshelf
 */
bookshelf.model("question-set", {
  tableName: "question_sets",
  requireFetch: false
});

bookshelf.model("dashboard-history", {
  tableName: "dashboard_histories",
  requireFetch: false
});

bookshelf.model("question", {
  tableName: "questions",
  requireFetch: false
});

bookshelf.model("academic_year", {
  tableName: "academic_years",
  requireFetch: false
});

bookshelf.model("education", {
  tableName: "educations",
  requireFetch: false
});

bookshelf.model("individual", {
  tableName: "individuals",
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

bookshelf.model("contact", {
  requireFetch: false,
  tableName: "contacts"
});

bookshelf.model("organization", {
  requireFetch: false,
  tableName: "organizations"
});

bookshelf.model("college-stream-strength", {
  requireFetch: false,
  tableName: "college_stream_strengths"
});

bookshelf.model("organization-component", {
  requireFetch: false,
  tableName: "organizations_components"
});

module.exports = bookshelf;
