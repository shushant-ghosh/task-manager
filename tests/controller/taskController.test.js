const request = require('supertest');
const app = require('../../src/index'); // Assuming your express app is exported from app.js
const List = require('../../src/model/taskModel');

let token;

beforeAll(async () => {
  // Create a user and login to get token
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: 'testpassword' });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'testuser', password: 'testpassword' });

  token = res.body.token;
});

describe('Task Controller', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'To Do',
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Task');
  });

  it('should fetch all tasks', async () => {
    const res = await request(app).get('/api/tasks/fetchAll').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1); // Since we created a task in the previous test
  });

  it('should fetch a task by title', async () => {
    await request(app)
      .post('/api/tasks/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Another Task',
        description: 'This is another test task',
        status: 'In Progress',
      });
  
    const res = await request(app)
      .get('/api/tasks/fetch/Another Task')
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Another Task');
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put('/api/tasks/update/Test Task')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'Done',
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Done');
  });

  it('should delete a task', async () => {
    const res = await request(app).delete('/api/tasks/remove/Test Task').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });
});
