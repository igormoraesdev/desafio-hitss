import * as request from 'supertest';
import {
  cleanupTestData,
  createTestApp,
  TestApp,
  uniqueName,
} from './utils/app';
import {
  DataBody,
  ErrorBody,
  ListBody,
  TaskBody,
  TeamBody,
} from './utils/types';

describe('/v1/tasks (e2e)', () => {
  let app: TestApp;
  let frontend: TeamBody;
  let backend: TeamBody;

  const api = () => request(app.getHttpServer());

  const createTeam = async () => {
    const res = await api()
      .post('/v1/teams')
      .send({ name: uniqueName('team'), color: '#3b82f6' })
      .expect(201);
    return (res.body as DataBody<TeamBody>).data;
  };

  const createTask = async (overrides: Record<string, unknown> = {}) => {
    const res = await api()
      .post('/v1/tasks')
      .send({ title: uniqueName('task'), ...overrides })
      .expect(201);
    return (res.body as DataBody<TaskBody>).data;
  };

  beforeAll(async () => {
    app = await createTestApp();
    await cleanupTestData(app);
    frontend = await createTeam();
    backend = await createTeam();
  });

  afterAll(async () => {
    await cleanupTestData(app);
    await app.close();
  });

  describe('POST /v1/tasks', () => {
    it('should create with PENDING status and no teams by default', async () => {
      const task = await createTask({ description: '  desc  ' });

      expect(task.status).toBe('PENDING');
      expect(task.teams).toEqual([]);
      expect(task.description).toBe('desc');
    });

    it('should create linked to the given teams', async () => {
      const task = await createTask({
        status: 'IN_PROGRESS',
        teamIds: [frontend.id, backend.id],
      });

      expect(task.status).toBe('IN_PROGRESS');
      expect(task.teams.map((team) => team.id).sort()).toEqual(
        [frontend.id, backend.id].sort(),
      );
      expect(typeof task.teams[0].color).toBe('string');
    });

    it('should respond 400 VALIDATION_ERROR for an invalid body', async () => {
      const res = await api()
        .post('/v1/tasks')
        .send({ title: 'ab', status: 'DONE', teamIds: [1, 1] })
        .expect(400);

      const { error } = res.body as ErrorBody;
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual(
        expect.arrayContaining([
          'title precisa ter ao menos 3 caracteres',
          'status precisa ser um de: PENDING, IN_PROGRESS, COMPLETED',
          'teamIds não pode ter ids repetidos',
        ]),
      );
    });

    it('should respond 404 when a team does not exist', async () => {
      const res = await api()
        .post('/v1/tasks')
        .send({ title: uniqueName('task'), teamIds: [frontend.id, 999999] })
        .expect(404);

      const { error } = res.body as ErrorBody;
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toContain('999999');
    });
  });

  describe('GET /v1/tasks', () => {
    const prefix = uniqueName('list');
    const titles = {
      a: `${prefix}-a`,
      b: `${prefix}-b`,
      c: `${prefix}-c`,
    };

    beforeAll(async () => {
      await createTask({
        title: titles.c,
        status: 'COMPLETED',
        teamIds: [frontend.id],
      });
      await createTask({
        title: titles.a,
        status: 'PENDING',
        teamIds: [frontend.id],
      });
      await createTask({
        title: titles.b,
        status: 'PENDING',
        teamIds: [backend.id],
      });
    });

    const list = async (query: Record<string, unknown>) => {
      const res = await api().get('/v1/tasks').query(query).expect(200);
      return res.body as ListBody<TaskBody>;
    };

    it('should filter by search on the title, case insensitive', async () => {
      const body = await list({ search: prefix.toUpperCase() });

      expect(body.data.map((task) => task.title).sort()).toEqual(
        Object.values(titles).sort(),
      );
      expect(body.meta.total).toBe(3);
    });

    it('should filter by teamId', async () => {
      const body = await list({ search: prefix, teamId: backend.id });

      expect(body.data.map((task) => task.title)).toEqual([titles.b]);
    });

    it('should filter by status', async () => {
      const body = await list({ search: prefix, status: 'COMPLETED' });

      expect(body.data.map((task) => task.title)).toEqual([titles.c]);
    });

    it('should sort by sortBy and order', async () => {
      const asc = await list({ search: prefix, sortBy: 'title', order: 'asc' });
      const desc = await list({
        search: prefix,
        sortBy: 'title',
        order: 'desc',
      });

      expect(asc.data.map((task) => task.title)).toEqual([
        titles.a,
        titles.b,
        titles.c,
      ]);
      expect(desc.data.map((task) => task.title)).toEqual([
        titles.c,
        titles.b,
        titles.a,
      ]);
    });

    it('should paginate and return meta', async () => {
      const body = await list({ search: prefix, limit: 2, page: 2 });

      expect(body.data).toHaveLength(1);
      expect(body.meta).toEqual({
        page: 2,
        limit: 2,
        total: 3,
        totalPages: 2,
      });
    });

    it('should respond 400 for an invalid filter', async () => {
      const res = await api()
        .get('/v1/tasks')
        .query({ status: 'DONE', sortBy: 'color', teamId: 'x' })
        .expect(400);

      const { error } = res.body as ErrorBody;
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual(
        expect.arrayContaining([
          'status precisa ser um de: PENDING, IN_PROGRESS, COMPLETED',
          'sortBy precisa ser um de: title, status, createdAt, updatedAt',
          'teamId precisa ser um inteiro',
        ]),
      );
    });
  });

  describe('GET /v1/tasks/:id', () => {
    it('should return the task with its teams', async () => {
      const task = await createTask({ teamIds: [frontend.id] });
      const res = await api().get(`/v1/tasks/${task.id}`).expect(200);

      const { data } = res.body as DataBody<TaskBody>;
      expect(data.id).toBe(task.id);
      expect(data.teams.map((team) => team.id)).toEqual([frontend.id]);
    });

    it('should respond 404 when it does not exist', async () => {
      const res = await api().get('/v1/tasks/999999').expect(404);
      expect((res.body as ErrorBody).error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /v1/tasks/:id', () => {
    it('should update only the status', async () => {
      const task = await createTask({ teamIds: [frontend.id] });
      const res = await api()
        .patch(`/v1/tasks/${task.id}`)
        .send({ status: 'COMPLETED' })
        .expect(200);

      const { data } = res.body as DataBody<TaskBody>;
      expect(data.status).toBe('COMPLETED');
      expect(data.title).toBe(task.title);
      expect(data.teams.map((team) => team.id)).toEqual([frontend.id]);
    });

    it('should replace the teams list and accept [] to unlink all', async () => {
      const task = await createTask({ teamIds: [frontend.id] });

      const replaced = await api()
        .patch(`/v1/tasks/${task.id}`)
        .send({ teamIds: [backend.id] })
        .expect(200);
      expect(
        (replaced.body as DataBody<TaskBody>).data.teams.map((team) => team.id),
      ).toEqual([backend.id]);

      const cleared = await api()
        .patch(`/v1/tasks/${task.id}`)
        .send({ teamIds: [] })
        .expect(200);
      expect((cleared.body as DataBody<TaskBody>).data.teams).toEqual([]);
    });

    it('should respond 400 when no field is given', async () => {
      const task = await createTask();
      const res = await api()
        .patch(`/v1/tasks/${task.id}`)
        .send({})
        .expect(400);

      expect((res.body as ErrorBody).error.code).toBe('BAD_REQUEST');
    });

    it('should respond 404 when the task does not exist', async () => {
      await api()
        .patch('/v1/tasks/999999')
        .send({ status: 'COMPLETED' })
        .expect(404);
    });
  });

  describe('DELETE /v1/tasks/:id', () => {
    it('should delete, respond 204 and then 404 on GET', async () => {
      const task = await createTask();
      await api().delete(`/v1/tasks/${task.id}`).expect(204);
      await api().get(`/v1/tasks/${task.id}`).expect(404);
    });

    it('should keep the task when its team is deleted, removing only the link', async () => {
      const team = await createTeam();
      const task = await createTask({ teamIds: [team.id] });

      await api().delete(`/v1/teams/${team.id}`).expect(204);

      const res = await api().get(`/v1/tasks/${task.id}`).expect(200);
      expect((res.body as DataBody<TaskBody>).data.teams).toEqual([]);
    });
  });
});
