const request = require("co-supertest");

describe("MyEndpoint Controller Integration", function() {
  describe("GET /colleges", function() {
    it("should return 200 status code", function*() {
      yield request(strapi.config.url)
        .get("/colleges")
        .expect(200)
        .end();
    });
  });
});
