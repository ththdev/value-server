{
  module.exports = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.LOCAL_DATABASE_USERNAME,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.*"],
  };
}
