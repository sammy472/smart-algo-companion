import request from 'supertest';
import app from '../src/app';

describe('Farmer routes', () => {
  it('should add a new farmer', async () => {
    const res = await request(app).post('/api/farmers/add').send({
      name: 'John Doe',
      address: 'Farm Lane',
      location: 'Cityville',
      phone: '123456789',
      password: 'password123',
      email: 'john@example.com',
    });
    expect(res.statusCode).toEqual(201);
  });
});
