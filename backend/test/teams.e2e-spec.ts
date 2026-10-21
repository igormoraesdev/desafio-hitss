import * as request from 'supertest';
import {
  cleanupTestData,
  createTestApp,
  TestApp,
  uniqueName,
} from './utils/app';
import { DataBody, ErrorBody, ListBody, TeamBody } from './utils/types';

describe('/v1/teams (e2e)', () => {
  let app: TestApp;

  const api = () => request(app.getHttpServer());

  const createTeam = async (overrides: Partial<TeamBody> = {}) => {
    const res = await api()
      .post('/v1/teams')
      .send({ name: uniqueName('team'), color: '#3b82f6', ...overrides })
      .expect(201);
    return (res.body as DataBody<TeamBody>).data;
  };

  beforeAll(async () => {
    app = await createTestApp();
    await cleanupTestData(app);
  });

  afterAll(async () => {
    await cleanupTestData(app);
    await app.close();
  });

  describe('POST /v1/teams', () => {
    it('should create the team and respond 201 inside the { data } envelope', async () => {
      const name = uniqueName('team');
      const res = await api()
        .post('/v1/teams')
        .send({ name: `  ${name}  `, color: '#22c55e' })
        .expect(201);

      const { data } = res.body as DataBody<TeamBody>;
      expect(data).toMatchObject({ name, color: '#22c55e' });
      expect(typeof data.id).toBe('number');
      expect(data.createdAt).toEqual(expect.any(String));
    });

    it('should respond 400 VALIDATION_ERROR with details for an invalid body', async () => {
      const res = await api()
        .post('/v1/teams')
        .send({ name: '', color: 'azul' })
        .expect(400);

      const { error } = res.body as ErrorBody;
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual(
        expect.arrayContaining([
          'name é obrigatório',
          'color precisa ser no formato hexadecimal',
        ]),
      );
    });

    it('should respond 400 for an unknown field', async () => {
      const res = await api()
        .post('/v1/teams')
        .send({ name: uniqueName('team'), color: '#000', extra: true })
        .expect(400);

      expect((res.body as ErrorBody).error.code).toBe('VALIDATION_ERROR');
    });

    it('should respond 409 CONFLICT when the name already exists', async () => {
      const team = await createTeam();
      const res = await api()
        .post('/v1/teams')
        .send({ name: team.name, color: '#000' })
        .expect(409);

      const { error } = res.body as ErrorBody;
      expect(error.code).toBe('CONFLICT');
      expect(error.message).toContain(team.name);
    });

    it('should respond 409 for concurrent creations with the same name, never 500', async () => {
      const name = uniqueName('race');
      const attempts = await Promise.all(
        Array.from({ length: 5 }, () =>
          api().post('/v1/teams').send({ name, color: '#000' }),
        ),
      );

      const statuses = attempts.map((res) => res.status).sort();
      expect(statuses).toEqual([201, 409, 409, 409, 409]);
    });
  });

  describe('GET /v1/teams', () => {
    it('should list with pagination meta', async () => {
      await createTeam();
      const res = await api()
        .get('/v1/teams')
        .query({ page: 1, limit: 2 })
        .expect(200);

      const body = res.body as ListBody<TeamBody>;
      expect(body.data.length).toBeLessThanOrEqual(2);
      expect(body.meta).toMatchObject({ page: 1, limit: 2 });
      expect(body.meta.total).toBeGreaterThanOrEqual(1);
      expect(body.meta.totalPages).toBe(Math.ceil(body.meta.total / 2));
    });

    it('should filter by search on the name, case insensitive', async () => {
      const team = await createTeam();
      const res = await api()
        .get('/v1/teams')
        .query({ search: team.name.toUpperCase() })
        .expect(200);

      const body = res.body as ListBody<TeamBody>;
      expect(body.data.map((item) => item.name)).toEqual([team.name]);
      expect(body.meta.total).toBe(1);
    });

    it('should respond 400 for invalid pagination', async () => {
      const res = await api()
        .get('/v1/teams')
        .query({ page: 0, limit: 1000 })
        .expect(400);

      const { error } = res.body as ErrorBody;
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual(
        expect.arrayContaining([
          'page precisa ser maior ou igual a 1',
          'limit precisa ser no máximo 100',
        ]),
      );
    });
  });

  describe('GET /v1/teams/:id', () => {
    it('should return the team by id', async () => {
      const team = await createTeam();
      const res = await api().get(`/v1/teams/${team.id}`).expect(200);

      expect((res.body as DataBody<TeamBody>).data).toMatchObject({
        id: team.id,
        name: team.name,
      });
    });

    it('should respond 404 NOT_FOUND when it does not exist', async () => {
      const res = await api().get('/v1/teams/999999').expect(404);
      expect((res.body as ErrorBody).error.code).toBe('NOT_FOUND');
    });

    it('should respond 400 for a non numeric id', async () => {
      const res = await api().get('/v1/teams/abc').expect(400);
      expect((res.body as ErrorBody).error.code).toBe('BAD_REQUEST');
    });
  });

  describe('PATCH /v1/teams/:id', () => {
    it('should update partially', async () => {
      const team = await createTeam();
      const res = await api()
        .patch(`/v1/teams/${team.id}`)
        .send({ color: '#f59e0b' })
        .expect(200);

      expect((res.body as DataBody<TeamBody>).data).toMatchObject({
        id: team.id,
        name: team.name,
        color: '#f59e0b',
      });
    });

    it('should respond 400 when no field is given', async () => {
      const team = await createTeam();
      const res = await api()
        .patch(`/v1/teams/${team.id}`)
        .send({})
        .expect(400);

      expect((res.body as ErrorBody).error.code).toBe('BAD_REQUEST');
    });

    it('should respond 409 when renaming to a name in use', async () => {
      const first = await createTeam();
      const second = await createTeam();
      const res = await api()
        .patch(`/v1/teams/${second.id}`)
        .send({ name: first.name })
        .expect(409);

      expect((res.body as ErrorBody).error.code).toBe('CONFLICT');
    });

    it('should respond 404 when the team does not exist', async () => {
      await api().patch('/v1/teams/999999').send({ color: '#000' }).expect(404);
    });
  });

  describe('DELETE /v1/teams/:id', () => {
    it('should delete, respond 204 and then 404 on GET', async () => {
      const team = await createTeam();
      await api().delete(`/v1/teams/${team.id}`).expect(204);
      await api().get(`/v1/teams/${team.id}`).expect(404);
    });

    it('should respond 404 when the team does not exist', async () => {
      await api().delete('/v1/teams/999999').expect(404);
    });
  });
});
