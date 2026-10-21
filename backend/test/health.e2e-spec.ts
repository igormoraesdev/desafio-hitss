import * as request from 'supertest';
import { createTestApp, TestApp } from './utils/app';
import { DataBody } from './utils/types';

describe('GET /v1/health (e2e)', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond 200 with status ok and database up', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(200);

    const body = res.body as DataBody<{ status: string; database: string }>;
    expect(body.data.status).toBe('ok');
    expect(body.data.database).toBe('up');
  });

  it('should echo the given x-request-id header', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/health')
      .set('x-request-id', 'e2e-request-id')
      .expect(200);

    expect(res.headers['x-request-id']).toBe('e2e-request-id');
  });
});
