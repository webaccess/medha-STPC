module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "medha"),
        username: env("DATABASE_USERNAME", "medha"),
        password: env("DATABASE_PASSWORD", "medha"),
        schema: "public"
      },
      options: {}
    }
  }
});
