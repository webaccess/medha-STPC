const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: "5432",
    user: "postgres",
    password: "root",
    database: "medha",
  },
});

const bookshelf = require("bookshelf")(knex);

/**
 * Registering models for bookshelf
 */

bookshelf.model("uploadMorph", {
  requireFetch: false,
  tableName: "upload_file_morph",
});

bookshelf.model("state", {
  requireFetch: false,
  tableName: "states",
  zones() {
    return this.hasMany("zone", "state", "id");
  },
});

bookshelf.model("zone", {
  requireFetch: false,
  tableName: "zones",
  state() {
    return this.belongsTo("state", "state", "id");
  },
  rpcs() {
    return this.hasMany("rpc", "zone", "id");
  },
});

bookshelf.model("rpc", {
  requireFetch: false,
  tableName: "rpcs",
  zone() {
    return this.belongsTo("zone", "zone", "id");
  },
  colleges() {
    return this.hasMany("college", "rpc", "id");
  },
});

bookshelf.model("stream", {
  requireFetch: false,
  tableName: "streams",
});

// bookshelf.model("collegeStreams", {
//   tableName: "colleges__streams",
//   college() {
//     return this.belongsTo("college", "college_id", "id");
//   },
//   stream() {
//     return this.belongsTo("stream", "stream_id", "id");
//   }
// });

bookshelf.model("colleges_component", {
  tableName: "colleges_components",
  streams() {
    return this.belongsTo("college_stream_strength", "component_id", "id");
  },
});

bookshelf.model("college_stream_strength", {
  tableName: "college_stream_strengths",
  stream() {
    return this.belongsTo("stream", "stream", "id");
  },
});

bookshelf.model("college", {
  requireFetch: false,
  tableName: "colleges",
  stream_strength() {
    return this.hasMany("colleges_component", "college_id", "id");
  },
  rpc() {
    return this.belongsTo("rpc", "rpc", "id");
  },
  principal() {
    return this.belongsTo("user", "principal", "id");
  },
  admins() {
    return this.hasMany("user", "college", "id");
  },
  rpc() {
    return this.belongsTo("rpc", "rpc", "id");
  },
  district() {
    return this.belongsTo("district", "district", "id");
  },
});

bookshelf.model("education", {
  tableName: "educations",
  student() {
    return this.belongsTo("student", "student", "id");
  },
});

bookshelf.model("role", {
  requireFetch: false,
  tableName: "users-permissions_role",
});

bookshelf.model("permission", {
  requireFetch: false,
  tableName: "users-permissions_permission",
  role() {
    return this.belongsTo("role", "role", "id");
  },
});

bookshelf.model("user", {
  requireFetch: false,
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
  },
  role() {
    return this.belongsTo("role", "role", "id");
  },
  student() {
    return this.hasOne("student", "user", "id");
  },
});

bookshelf.model("student", {
  tableName: "students",
  user() {
    return this.belongsTo("user", "user", "id");
  },
  stream() {
    return this.belongsTo("stream", "stream", "id");
  },
  educations() {
    return this.hasMany("education", "student", "id");
  },
});

bookshelf.model("academic_year", {
  requireFetch: false,
  tableName: "academic_years",
});

bookshelf.model("academic_history", {
  tableName: "academic_histories",
  student() {
    return this.belongsTo("student", "student", "id");
  },
  academic_year() {
    return this.belongsTo("academic_year", "academic_year", "id");
  },
});

bookshelf.model("question", {
  tableName: "questions",
});

bookshelf.model("question_set", {
  tableName: "question_sets",
});

bookshelf.model("activity_stream", {
  tableName: "activities__streams",
});

bookshelf.model("activity", {
  tableName: "activities",
  academic_year() {
    return this.belongsTo("academic_year", "academic_year", "id");
  },
  college() {
    return this.belongsTo("college", "college", "id");
  },
  streams() {
    return this.belongsToMany("stream").through(
      "activity_stream",
      "activity_id",
      "stream_id"
    );
  },
  question_set() {
    return this.belongsTo("question_set", "question_set", "id");
  },
});
bookshelf.model("district", {
  requireFetch: false,
  tableName: "districts",
  state() {
    return this.belongsTo("state", "state", "id");
  },
});

bookshelf.model("otp", {
  tableName: "otps",
});

bookshelf.model("activity_batch", {
  tableName: "activity_batches",
  activity() {
    return this.belongsTo("activity", "activity", "id");
  },
});

bookshelf.model("activity_batch_attendance", {
  tableName: "activity_batch_attendances",
  student() {
    return this.belongsTo("student", "student", "id");
  },
  activity_batch() {
    return this.belongsTo("activity_batch", "activity_batch", "id");
  },
});

bookshelf.model("event_college", {
  tableName: "events__colleges",
});

bookshelf.model("event_stream", {
  tableName: "events__streams",
});

bookshelf.model("event", {
  tableName: "events",
  rpc() {
    return this.belongsTo("rpc", "rpc", "id");
  },
  streams() {
    return this.belongsToMany("stream").through(
      "event_stream",
      "event_id",
      "stream_id"
    );
  },
  colleges() {
    return this.belongsToMany("college").through(
      "event_college",
      "event_id",
      "college_id"
    );
  },
  question_set() {
    return this.belongsTo("question_set", "question_set", "id");
  },
});

bookshelf.model("event_registration", {
  tableName: "event_registrations",
  student() {
    return this.belongsTo("student", "student", "id");
  },
  event() {
    return this.belongsTo("event", "event", "id");
  },
});

bookshelf.model("feedback", {
  tableName: "feedbacks",
  activity() {
    return this.belongsTo("activity", "activity", "id");
  },
  event() {
    return this.belongsTo("event", "event", "id");
  },
  user() {
    return this.belongsTo("user", "user", "id");
  },
  question_set() {
    return this.belongsTo("question_set", "question_set", "id");
  },
});

bookshelf.model("response", {
  tableName: "responses",
});

module.exports = bookshelf;
