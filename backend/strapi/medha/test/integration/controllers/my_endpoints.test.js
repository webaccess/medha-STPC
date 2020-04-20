const request = require("co-supertest");

const userdata = { identifier: "harsh", password: "1Qwertyui" };
var data;

(async () => {
  await login();
})();

async function login() {
  describe("Test describe", function () {
    describe("POST /auth/local", function () {
      it("should return 200 status code", function* () {
        yield request(strapi.config.url)
          .post("/auth/local/")
          .send(userdata)
          .expect(200)
          .then((response) => {
            other(response.body.jwt);
          });
        // .end();
      });
    });
  });
}

function other(jwt) {
  console.log(jwt);
  describe("MyEndpoint Controller Integration", function () {
    describe("GET /colleges", function () {
      it("should return 200 status code", function* () {
        yield request(strapi.config.url)
          .get("/colleges/1")
          .set({
            Authorization: `Bearer ${jwt}`,
          })
          .expect(200)
          .expect("Content-Type", /json/)
          .end();
      });
    });
    describe("GET /states", function () {
      it("should return 200 status code", function* () {
        yield request(strapi.config.url)
          .get("/states")
          .expect(200)
          .expect("Content-Type", /json/)
          .end();
      });
    });
    describe("GET /streams", function () {
      it("should return 200 status code", function* () {
        yield request(strapi.config.url)
          .get("/streams")
          .expect(200)
          .expect("Content-Type", /json/)
          .end();
      });
    });
    describe("GET /districts", function () {
      it("should return 200 status code", function* () {
        yield request(strapi.config.url)
          .get("/districts")
          .expect(200)
          .expect("Content-Type", /json/)
          .end();
      });
    });
    describe("GET /zones", function () {
      it("should return 200 status code", function* () {
        yield request(strapi.config.url)
          .get("/zones")
          .expect(200)
          .expect("Content-Type", /json/)
          .end();
      });
    });
  });
}
