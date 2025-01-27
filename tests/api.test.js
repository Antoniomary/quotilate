import * as chai from 'chai';
import { expect } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import app from '../api/server.js';
import dbClient from '../api/utils/db.js';
import redisClient from '../api/utils/redis.js';

chai.use(chaiHttp);

describe('API Endpoint Tests', () => {
  let jsonToken;
  const agent = request.agent(app);

  after(async () => {
    await dbClient.db.collection('users').deleteOne({ email: 'user@test.com' });
    await dbClient.db.collection('users').deleteOne({ email: 'user@test1.com' });
    // await dbClient.db.collection('quotes').deleteOne({ name: 'testImage' });
    agent.close();
  });

  it('GET /', async () => {
    const res = await request.execute(app)
      .get('/');

    expect(res.status).to.equal(200);
    expect(res).to.be.html;
    expect(res.text.includes('<title>Welcome to Quotilate</title>')).to.be.true;
  });

  it('GET /status', async () => {
    const res = await request.execute(app)
      .get('/status');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ 'cache': true, 'db': true });
  });

  it('GET /stats', async () => {
    const res = await request.execute(app)
      .get('/stats');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('users');
    expect(res.body).to.have.property('quotes');
    expect(typeof res.body.users === 'number').to.be.true;
    expect(typeof res.body.quotes === 'number').to.be.true;
  });

  it('GET /register', async () => {
    const res = await request.execute(app)
      .get('/register');

    expect(res.status).to.equal(200);
    expect(res).to.be.html;
    expect(res.text.includes('<title>Register page</title>')).to.be.true;
  });

  it('GET /login', async () => {
    const res = await request.execute(app)
      .get('/login');

    expect(res.status).to.equal(200);
    expect(res).to.be.html;
    expect(res.text.includes('<title>Login page</title>')).to.be.true;
  });

  it('POST /register when no username is passed', async() => {
    const noUsernameRes = await request.execute(app)
      .post('/register')
      .send({
        email: 'user@test.com',
        password: 'testPassword',
        repassword: 'testPassword',
      });

    expect(noUsernameRes.status).to.equal(400);
    expect(noUsernameRes.body).to.deep.equal({ error: 'Missing username' });
  });

  it('POST /register when no email is passed', async() => {
    const noEmailRes = await request.execute(app)
      .post('/register')
      .send({
        username: 'testUser',
        password: 'testPassword',
        repassword: 'testPassword',
      });

    expect(noEmailRes.status).to.equal(400);
    expect(noEmailRes.body).to.deep.equal({ error: 'Missing email' });
  });

  it('POST /register when no password is passed', async() => {
    const noPassRes = await request.execute(app)
      .post('/register')
      .send({
        email: 'user@test.com',
        username: 'testUser',
        repassword: 'testPassword',
      });

    expect(noPassRes.status).to.equal(400);
    expect(noPassRes.body).to.deep.equal({ error: 'Missing password' });
  });

  it('POST /register when no password confirmation is passed', async() => {
    const noRepassRes = await request.execute(app)
      .post('/register')
      .send({
        email: 'user@test.com',
        username: 'testUser',
        password: 'testPassword',
      });

    expect(noRepassRes.status).to.equal(400);
    expect(noRepassRes.body).to.deep.equal({ error: 'Missing password confirmation' });
  });

  it('POST /register when passwords do not match', async() => {
    const noRepassRes = await request.execute(app)
      .post('/register')
      .send({
        email: 'user@test.com',
        username: 'testUser',
        password: 'testPassword',
        repassword: 'anotherTestPassword',
      });

    expect(noRepassRes.status).to.equal(400);
    expect(noRepassRes.body).to.deep.equal({ error: 'Passwords do not match' });
  });

  it('POST /register when a json response is expected', async() => {
    const jsonRes = await request.execute(app)
      .post('/register')
      .set('Accept', 'application/json')
      .send({
        email: 'user@test.com',
        username: 'testUser',
        password: 'testPassword',
        repassword: 'testPassword',
      });

    expect(jsonRes.status).to.equal(201);
    expect(jsonRes).to.be.json;
    expect(jsonRes.body).to.have.property('id');
    expect(jsonRes.body).to.have.property('createdAt');
    expect(new Date(jsonRes.body.createdAt)).to.be.an.instanceOf(Date);
  });

  it('POST /register when a html response is expected', async() => {
    const htmlRes = agent
      .post('/register')
      .send({
        email: 'user@test1.com',
        username: 'testUser1',
        password: 'testPassword',
        repassword: 'testPassword',
      });

    expect(htmlRes).to.redirect;
  });

  it('POST /register when the email already exists', async() => {
    const emailAlreadyExistRes = await request.execute(app)
      .post('/register')
      .send({
        email: 'user@test.com',
        username: 'testUser',
        password: 'testPassword',
        repassword: 'testPassword',
      });

    expect(emailAlreadyExistRes.status).to.equal(400);
    expect(emailAlreadyExistRes.body).to.deep.equal({ error: 'Email already exists' });
  });

  it('POST /register when the username already exists', async() => {
    const usernameAlreadyExistRes = await request.execute(app)
      .post('/register')
      .send({
        email: 'user@test2.com',
        username: 'testUser',
        password: 'testPassword',
        repassword: 'testPassword',
      });

    expect(usernameAlreadyExistRes.status).to.equal(400);
    expect(usernameAlreadyExistRes.body).to.deep.equal({ error: 'Username already exists' });
  });

  it('GET /login', async() => {
    const res = await request.execute(app)
      .get('/login');

    expect(res.status).to.equal(200);
    expect(res).to.be.html;
    expect(res.text.includes('<title>Login page</title>')).to.be.true;
  });

  it('POST /login when the database or cache is down', async() => {
    // Simulate the database or cache being down
    const dbIsAliveStub = sinon.stub(dbClient, 'isAlive').returns(false);
    const redisIsAliveStub = sinon.stub(redisClient, 'isAlive').returns(false);
  
    const res = await request.execute(app)
      .post('/login')
      .send({
        username: 'testUser',
        password: 'password123',
      });
  
    dbIsAliveStub.restore();
    redisIsAliveStub.restore();
  
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Unable to process request' });
    });

  it('POST /login when the body is missing', async() => {
    const res = await request.execute(app)
      .post('/login');

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Missing user details' });
  });

  it('POST /login when the body is empty', async() => {
    const res = await request.execute(app)
      .post('/login')
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Missing user details' });
  });

  it('POST /login when the body is not json', async() => {
    const res = await request.execute(app)
      .post('/login')
      .send([]);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Missing user details' });
  });

  it('POST /login when the username or email is missing', async() => {
    const res = await request.execute(app)
      .post('/login')
      .send({ password: 'testPassword' });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Missing username or email' });
  });

  it('POST /login when the password is missing', async() => {
    const res = await request.execute(app)
      .post('/login')
      .send({ username: 'testUser' });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Missing password' });
  });

  it('POST /login login with wrong username or email', async() => {
    const withEmailRes = await request.execute(app)
      .post('/login')
      .send({
        email: 'wrongUser@test.com',
        password: 'testPassword',
      });

    expect(withEmailRes.status).to.equal(400);
    expect(withEmailRes.body).to.deep.equal({ error: 'Invalid login, please try again' });

    const withUsernameRes = await request.execute(app)
      .post('/login')
      .send({
        username: 'wrongTestUser',
        password: 'testPassword',
      });

    expect(withUsernameRes.status).to.equal(400);
    expect(withUsernameRes.body).to.deep.equal({ error: 'Invalid login, please try again' });
  });

  it('POST /login login with wrong password', async() => {
    const res = await request.execute(app)
      .post('/login')
      .send({
        username: 'testUser',
        password: 'wrongTestPassword',
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Invalid login, please try again' });
  });

  it('POST /login can login with username and password with json reply', async() => {
    const res = await request.execute(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testUser',
        password: 'testPassword',
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username', 'testUser');
    expect(res.body).to.have.property('numberOfQuotes', 0);
    expect(res.body).to.have.property('quotes');
    expect(res.body.quotes).to.be.an('array');
    expect(res.body).to.have.property('token');

    jsonToken = res.body.token;
    /*
    expect(jsonRes.body).to.have.property('email', 'user@test.com');
    expect(jsonRes.body).to.have.property('createdAt');
    expect(jsonRes.body).to.have.property('lastLogin');
    expect(typeof jsonRes.body.createdAt === 'number').to.be.true;
    expect(typeof jsonRes.body.lastLogin === 'number').to.be.true;
    */
  });

  it('POST /login can login with email and password with json reply', async() => {
    const res = await request.execute(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        email: 'user@test.com',
        password: 'testPassword',
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username', 'testUser');
    expect(res.body).to.have.property('numberOfQuotes', 0);
    expect(res.body).to.have.property('quotes');
    expect(res.body.quotes).to.be.an('array');
    expect(res.body).to.have.property('token');
  });

  it('GET / after user has logged in', async () => {
    const res = agent
      .get('/');

    expect(res).to.redirect;
  });

  it('GET /login after user has logged in', async () => {
    const res = agent
      .get('/login');

    expect(res).to.redirect;
  });

  it('GET /quote when db is down', async () => {
    const dbIsAliveStub = sinon.stub(dbClient, 'isAlive').returns(false);

    const res = await request.execute(app)
      .get('/quote');

    dbIsAliveStub.restore();
    
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'unable to process request' });
  });

  it('GET /quote when cache is down', async () => {
    const redisIsAliveStub = sinon.stub(redisClient, 'isAlive').returns(false);

    const res = await request.execute(app)
      .get('/quote');

    redisIsAliveStub.restore();

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'unable to process request' });
  });

  it('GET /quote fetchs a random quote', async () => {
    const res = await request.execute(app)
      .get('/quote');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('quote');
    expect(res.body).to.have.property('author');
  });

  it('GET /quotes gets user\'s quotes when it is empty via header', async () => {
    const res = await request.execute(app)
      .get('/quotes')
      .set('Accept', 'application/json')
      .set('X-token', jsonToken);

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([]);
  });

  it('GET /quotes gets user\'s quotes when it is empty via cookies', async () => {
    const res = agent
      .get('/quotes');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([]);
  });

  it('POST /logout can logout with json reply', async() => {
    const res = await request.execute(app)
      .post('/logout')
      .set('Accept', 'application/json')
      .set('X-token', jsonToken);

    expect(res.status).to.equal(204);
    expect(res.body).to.deep.equal({});
  });

  it('POST /logout can logout with html reply', async() => {
    const res = agent
      .post('/logout');

      expect(res).to.redirect;
  });
});
