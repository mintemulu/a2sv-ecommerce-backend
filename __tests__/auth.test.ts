import request from 'supertest';
import app from '../src/app';

jest.mock('../src/utils/prisma', () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    },
  };
});

const { prisma } = jest.requireMock('../src/utils/prisma');

describe('Auth API', () => {
  afterEach(() => jest.clearAllMocks());

  it('registers a user', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce({ id: 'u1', username: 'john', email: 'john@example.com', role: 'USER' });

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'john', email: 'john@example.com', password: 'StrongP@ss1' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.object.username).toBe('john');
  });

  it('fails login with invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'none@example.com', password: 'whatever' })
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});
