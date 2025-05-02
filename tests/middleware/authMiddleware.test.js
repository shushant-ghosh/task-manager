const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../src/middleware/authMiddleware');
const app = express();
const dotenv = require("dotenv");
dotenv.config();


app.use(express.json());
app.use(authMiddleware);  

app.get('/protected', (req, res) => res.status(200).send('Protected Route'));

describe('Auth Middleware', () => {
  it('should block access if no token is provided', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Access Denied');
  });

  it('should block access if invalid token is provided', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid Token');
  });

  it('should allow access if valid token is provided', async () => {
    const token = jwt.sign({ id: '1', username: 'test' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Protected Route');
  });
});
