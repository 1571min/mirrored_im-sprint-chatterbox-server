const request = require("supertest");
require("jest");

const app = require("../basic-server");

describe("server", function() {
  test("should respond to GET requests for /classes/messages with a 200 status code", function(done) {
    return request(app)
      .get("/classes/messages")
      .then(res => {
        expect(res.status).toEqual(200);
        done();
      });
  });
  test("should send back parsable stringified JSON", function(done) {
    return request(app)
      .get("/classes/messages")
      .then(res => {
        const isParsable = function(string) {
          try {
            JSON.parse(string);
            return true;
          } catch (e) {
            return false;
          }
        };
        expect(isParsable(res.text)).toEqual(true);
        done();
      });
  });
  test("should send back an object", function(done) {
    return request(app)
      .get("/classes/messages")
      .then(res => {
        const parsedBody = JSON.parse(res.text);
        expect(typeof parsedBody).toEqual("object");
        done();
      });
  });
  test("should send an object containing a `results` array", function(done) {
    return request(app)
      .get("/classes/messages")
      .then(res => {
        const parsedBody = JSON.parse(res.text);
        expect(typeof parsedBody).toEqual("object");
        expect(Array.isArray(parsedBody.results)).toEqual(true);
        done();
      });
  });
  test("should accept POST requests to /classes/messages", function(done) {
    return request(app)
      .post("/classes/messages")
      .send({
        username: "Jono",
        text: "Do my bidding!"
      })
      .then(res => {
        expect(res.status).toEqual(201);
        done();
      });
  });
  test("should response with messages that were previously posted", function(done) {
    return request(app)
      .post("/classes/messages")
      .send({
        username: "Jono",
        text: "Do my bidding!"
      })
      .then(() => {
        return request(app)
          .get("/classes/messages")
          .then(res => {
            const messages = JSON.parse(res.text).results;
            expect(messages[0].username).toEqual("Jono");
            expect(messages[0].text).toEqual("Do my bidding!");
            done();
          });
      });
  });
  test("Should 404 when asked for a nonexistent endpoint", function(done) {
    return request(app)
      .get("/codestates")
      .then(res => {
        expect(res.status).toEqual(404);
        done();
      });
  });
});
