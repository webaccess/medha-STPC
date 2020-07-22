const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: "5432",
    user: "medha",
    password: "medha", // add your db password
    database: "medha" // add your db name
  }
});

const bookshelf = require("bookshelf")(knex);

bookshelf.model("country", {
  tableName: "countries",
  requireFetch: false
});

bookshelf.model("state", {
  tableName: "states",
  requireFetch: false
});

bookshelf.model("district", {
  tableName: "districts",
  requireFetch: false
});

module.exports = bookshelf;
