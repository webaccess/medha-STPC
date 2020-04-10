const request = require("co-supertest");

const userdata = { identifier: "harsh", password: "1Qwertyui" };

describe("MyEndpoint Controller Integration", function() {
  describe("POST /auth/local", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .post("/auth/local/")
        .send(userdata)
        .expect(200)
        .end();
    });
  });

  describe("GET /colleges", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .get("/colleges/1")
        .set({
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg1MjIxMTc3LCJleHAiOjE1ODc4MTMxNzd9.8qPPtQzhn7ZA6M_XWU4osSiwaDdNA4Ege7BK9MmiaBg"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end();
    });
  });
  describe("GET /states", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .get("/states")
        .expect(200)
        .expect("Content-Type", /json/)
        .end();
    });
  });
  describe("GET /streams", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .get("/streams")
        .expect(200)
        .expect("Content-Type", /json/)
        .end();
    });
  });
  describe("GET /districts", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .get("/districts")
        .expect(200)
        .expect("Content-Type", /json/)
        .end();
    });
  });
  describe("GET /zones", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .get("/zones")
        .expect(200)
        .expect("Content-Type", /json/)
        .end();
    });
  });
});
