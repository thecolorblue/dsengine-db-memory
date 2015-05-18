var assert = require("assert");
var _ = require("lodash");
var DB = require("../lib/memory.js");
var db;

describe("Memory DB", function() {
  function getRand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getResponseShouldMatch(match) {
    it("should return contents", function(done) {
      db.get(function(err, response) {
        assert.notEqual(response.contents, undefined);
        assert.equal(response.contents, match.contents);
        done();
      });
    });

    it("should return shadow", function(done) {
      db.get(function(err, response) {
        assert.notEqual(response.shadow, undefined);
        assert.equal(typeof response.shadow, "object");
        done();
      });
    });

    it("should return a shadow with text", function(done) {
      db.get(function(err, response) {
        assert.notEqual(response.shadow.text, undefined);
        assert.equal(response.shadow.text, match.shadow.text);
        done();
      });
    });

    it("should return a shadow with a clientVersion", function(done) {
      db.get(function(err, response) {
        assert.equal(response.shadow.clientVersion, match.shadow.clientVersion);
        done();
      });
    });

    it("should return a shadow with a serverVersion", function(done) {
      db.get(function(err, response) {
        assert.equal(response.shadow.serverVersion, match.shadow.serverVersion);
        done();
      });
    });
  }

  beforeEach(function() {
    db = DB("1234", "abcd");
  });

  describe("#exists", function() {
    it("should respond with a boolean", function(done) {
      db.exists(function(err, exists) {
        assert(exists === true || exists === false);
        done();
      });
    });

    it("should return false if nothing has been set", function(done) {
      db.exists(function(err, exists) {
        assert.strictEqual(exists, false);
        done();
      });
    });

    it("should return true after set is called", function(done) {
      db.set({
        contents: "",
        shadow: {
          text: "",
          clientVersion: 1,
          serverVersion: 1
        }
      }, function() {
        db.exists(function(err, exists) {
          assert.strictEqual(exists, true);
          done();
        });
      });
    });
  });

  describe("#get", function() {
    var mockData = {
      contents: "contents",
      shadow: {
        text: "contents",
        clientVersion:1,
        serverVersion:1
      }
    };

    beforeEach(function(done) {
      db.set(mockData, done);
    });

    getResponseShouldMatch(mockData);
  });

  describe("#set", function() {
    beforeEach(function(done) {
      db.set({
        contents: "content",
        shadow: {
          text: "",
          clientVersion: 0,
          serverVersion: 0
        }
      }, done);
    });

    describe("when only contents has been set", function() {
      it("should return contents", function(done) {
        db.get(function(err, response) {
          assert.notEqual(response.contents, undefined);
          assert.equal(response.contents, "content");
          done();
        });
      });

      it("should return shadow", function(done) {
        db.get(function(err, response) {
          assert.notEqual(response.shadow, undefined);
          assert.equal(typeof response.shadow, "object");
          done();
        });
      });
    });

    describe("when a full shadow has been set", function() {
      var mockData = {
        shadow: {
          text: "contents",
          clientVersion:1,
          serverVersion:1
        }
      };

      beforeEach(function(done) {
        db.set(mockData, done);
      });

      getResponseShouldMatch(_.extend({ contents: "content" }, mockData));
    });

    describe("when shadow text has been set", function() {
      var mockData = {
        shadow: {
          text: "contents",
          clientVersion: 0,
          serverVersion: 0
        }
      };

      beforeEach(function(done) {
        db.set(mockData, done);
      });

      getResponseShouldMatch(_.extend({ contents: "content" }, mockData));
    });
  });

  describe("#clear", function() {
    beforeEach(function(done) {
      db.clear(done);
    });

    it("should return an empty object", function(done) {
      db.get(function(err, response) {
        assert.equal(typeof response, "object");
        assert.equal(_.size(response), _.size({}));
        done();
      });
    });
  });
});
