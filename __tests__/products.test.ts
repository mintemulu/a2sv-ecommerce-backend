import request from 'supertest';
import app from '../src/app';
import { makeToken } from './setup';

jest.mock('../src/utils/prisma', () => {
  return {
    prisma: {
      product: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

const { prisma } = jest.requireMock('../src/utils/prisma');

describe('Products API', () => {
  afterEach(() => jest.clearAllMocks());

  it('lists products (public, paginated)', async () => {
    prisma.product.count.mockResolvedValueOnce(1);
    prisma.product.findMany.mockResolvedValueOnce([
      { id: 'p1', name: 'Item', description: 'Desc here...', price: 10, stock: 5, category: 'cat', userId: 'u1', createdAt: new Date(), updatedAt: new Date() },
    ]);

    const res = await request(app).get('/products').expect(200);
    expect(res.body.totalProducts).toBe(1);
    expect(res.body.products.length).toBe(1);
  });

  it('gets product by id (public)', async () => {
    prisma.product.findUnique.mockResolvedValueOnce({ id: 'p1', name: 'Item', description: 'Desc here...', price: 10, stock: 5, category: 'cat', userId: 'u1', createdAt: new Date(), updatedAt: new Date() });
    const res = await request(app).get('/products/p1').expect(200);
    expect(res.body.object.id).toBe('p1');
  });

  it('creates a product (admin only)', async () => {
    const token = makeToken({ userId: 'admin1', username: 'admin', role: 'ADMIN' });
    prisma.product.create.mockResolvedValueOnce({ id: 'p1', name: 'New', description: 'Long description', price: 20, stock: 10, category: 'cat', userId: 'admin1', createdAt: new Date(), updatedAt: new Date() });
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New', description: 'Long description', price: 20, stock: 10, category: 'cat' })
      .expect(201);
    expect(res.body.object.name).toBe('New');
  });
});
