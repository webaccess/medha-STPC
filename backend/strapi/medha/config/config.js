const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: "5432",
    user: "medha",
    password: "medha",
    database: "medha"
  }
});

const bookshelf = require("bookshelf")(knex);

/**
 * Registering models for bookshelf
 */
bookshelf.model("state", {
  requireFetch: false,
  tableName: "states"
});

bookshelf.model("zone", {
  requireFetch: false,
  tableName: "zones"
});

bookshelf.model("rpc", {
  requireFetch: false,
  tableName: "rpcs",
  zone() {
    return this.belongsTo("zone", "zone", "id");
  },
  colleges() {
    return this.hasMany("college", "rpc", "id");
  }
});

bookshelf.model("stream", {
  tableName: "streams"
});

bookshelf.model("collegeStreams", {
  tableName: "colleges__streams",
  college() {
    return this.belongsTo("college", "college_id", "id");
  },
  stream() {
    return this.belongsTo("stream", "stream_id", "id");
  }
});

bookshelf.model("college", {
  tableName: "colleges",
  streams() {
    return this.belongsToMany("stream").through(
      "collegeStreams",
      "college_id",
      "stream_id"
    );
  },
  rpc() {
    return this.belongsTo("rpc", "rpc", "id");
  },
  principal() {
    return this.belongsTo("user", "principal", "id");
  },
  admins() {
    return this.hasMany("user", "college", "id");
  }
});

bookshelf.model("education", {
  tableName: "educations"
});

bookshelf.model("role", {
  tableName: "users-permissions_role"
});

bookshelf.model("permission", {
  tableName: "users-permissions_permission"
});

bookshelf.model("user", {
  tableName: "users-permissions_user",
  state() {
    return this.belongsTo("state", "state", "id");
  },
  zone() {
    return this.belongsTo("zone", "zone", "id");
  },
  rpc() {
    return this.belongsTo("rpc", "rpc", "id");
  },
  college() {
    return this.belongsTo("college", "college", "id");
  }
});

bookshelf.model("student", {
  tableName: "students",
  user() {
    return this.belongsTo("user", "user", "id");
  },
  stream() {
    return this.belongsTo("stream", "Stream", "id");
  },
  educations() {
    return this.hasMany("education", "student", "id");
  }
});

module.exports = bookshelf;
