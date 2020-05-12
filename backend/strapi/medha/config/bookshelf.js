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

module.exports = bookshelf;
