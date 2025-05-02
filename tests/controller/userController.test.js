const request = require('supertest');
const app = require('../../src/index'); 
const User = require('../../src/model/userModel');

describe('Registration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');

    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
  });

  it('should not register user if already exists', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});

describe('Login', () => {
  
  it('should login user and return token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login user with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
