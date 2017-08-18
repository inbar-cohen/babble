'use strict';

let assert = require('assert');
let messages = require('../../server/messages-util');

var url = 'http://localhost:9000';
var port = 9000;

var module = require('../../server/main.js');

var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

describe('Message', function () {
  it('should load the messages module', function () {
    assert.notEqual(null, messages);
  });
  it('should be able to add a new message and return id', function () {
    let message = { message: '1' };
    let id = messages.addMessage(message);
    assert.notEqual(null, id);
  });
  it('should return new messages', function () {
    let all = messages.getMessages(0);
    let newMessage = { message: '2' };
    messages.addMessage(newMessage);
    let newMessages = messages.getMessages(all.length);
    assert.deepEqual(newMessages, [newMessage]);
  });
  it('should be able to delete a message', function () {
    let message = { message: '3' };
    let id = messages.addMessage(message);
    messages.deleteMessage(id);
    assert.equal(null, messages.getMessages(0).find(m => m.id === id));
  });
});

describe('Check server listening functions:', function () {
  beforeEach(function () {
    module.server.listen(port);
  });

  afterEach(function () {
    module.server.close();
  });

  it('Should return 404 - /Singapore', function (done) {
    chai.request(url)
      .get('/Singapore')
      .end(function (err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return 204 - OPTIONS', function (done) {
    chai.request(url)
      .options('/messages?counter=Vietnam')
      .end(function (err, res) {
        expect(res).to.have.status(204);
        done();
      });
  });

  it('should return 405 - send /stats with POST method', function (done) {
    chai.request(url)
      .post('/stats')
      .send({})
      .end(function (err, res) {
        expect(res).to.have.status(405);
        done();
      });
  });
});

describe('cilent-server', function () {
  beforeEach(function (done) {
    // runs before each test in this block
    module.server.listen(port);
    done();
  });

  after(function (done) {
    module.server.close();
    done();
  });

  it('Should add a new user named Inbar Cohen', function (done) {
    chai.request(url)
      .post('/log/')
      .send({ name: "Inbar Cohen", email: "inbar2859@gmail.com", status: "login" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        assert.equal(true, (module.users).some(m => m.name === "Inbar Cohen" && m.email === "inbar2859@gmail.com"), "Error when inserting Inbar Chen");
        done();
      });
  });

  it('Should add a new user named Roni Cohen', function (done) {
    chai.request(url)
      .post('/log/')
      .send({ name: "Roni Cohen", email: "ronron@gmail.com", status: "login" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        assert.equal(true, (module.users).some(m => m.name === "Roni Cohen" && m.email === "ronron@gmail.com"), "Error when inserting Roni Cohen");
        done();
      });
  });

  it('Should get correct stats', function (done) {
    chai.request(url)
      .get('/stats')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        let stats = { users: 2, messages: 2 };
        assert.deepEqual(stats, { users: JSON.parse(res.text).count, messages: JSON.parse(res.text).count2 }, "ERROR in stats");
        done();
      });
  });

});