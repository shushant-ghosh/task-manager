const request = require('supertest');
const app = require('../../src/index');
const List = require('../../src/model/taskModel');

let token;

beforeAll(async () => {
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

  it('should return 500 for invalid task creation', async () => {
    const res = await request(app)
      .post('/api/tasks/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ invalidField: 'bad data' });
    expect(res.status).toBe(500);
  });

  it('should fetch all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks/fetchAll')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should handle error in fetchAll', async () => {
    const originalFind = List.find;
    List.find = jest.fn().mockRejectedValue(new Error('Mocked error'));

    const res = await request(app)
      .get('/api/tasks/fetchAll')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);

    List.find = originalFind;
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

  it('should return 404 for non-existent task in fetch', async () => {
    const res = await request(app)
      .get('/api/tasks/fetch/NotExist')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put('/api/tasks/update/Another Task')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Done' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Done');
  });

  it('should return 404 for update of non-existent task', async () => {
    const res = await request(app)
      .put('/api/tasks/update/NotExist')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Done' });
    expect(res.status).toBe(404);
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete('/api/tasks/remove/Another Task')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  it('should return 404 for delete of non-existent task', async () => {
    const res = await request(app)
      .delete('/api/tasks/remove/NotExist')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
