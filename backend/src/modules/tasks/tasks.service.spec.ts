import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { Tasks } from 'src/generated/prisma/client';
import { TeamsService } from '../teams/teams.service';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import {
  TASKS_REPOSITORY,
  TasksRepository,
} from './repositories/tasks.repository';
import { TasksService } from './tasks.service';

const task: Tasks = {
  id: 1,
  title: 'Escrever README',
  description: null,
  status: 'PENDING',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const silentLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<TasksRepository>;
  let teamsService: { ensureAllExist: jest.Mock };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    teamsService = { ensureAllExist: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TASKS_REPOSITORY, useValue: repository },
        { provide: TeamsService, useValue: teamsService },
        { provide: getLoggerToken(TasksService.name), useValue: silentLogger },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  describe('create', () => {
    it('cria a task sem consultar times quando teamIds não é informado', async () => {
      repository.create.mockResolvedValue(task);

      const result = await service.create({ title: 'Escrever README' });

      expect(result).toEqual(task);
      expect(teamsService.ensureAllExist).not.toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith({
        title: 'Escrever README',
      });
    });

    it('valida os times antes de criar quando teamIds é informado', async () => {
      repository.create.mockResolvedValue(task);

      await service.create({ title: 'Escrever README', teamIds: [1, 2] });

      expect(teamsService.ensureAllExist).toHaveBeenCalledWith([1, 2]);
      expect(repository.create).toHaveBeenCalledWith({
        title: 'Escrever README',
        teamIds: [1, 2],
      });
    });

    it('não cria quando algum time não existe', async () => {
      teamsService.ensureAllExist.mockRejectedValue(new NotFoundException());

      await expect(
        service.create({ title: 'Escrever README', teamIds: [99] }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('devolve data e meta calculados a partir de page e limit', async () => {
      repository.findAll.mockResolvedValue({ items: [task], total: 23 });
      const query = Object.assign(new FindTasksQueryDto(), {
        page: 2,
        limit: 10,
      });

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith({
        filters: { status: undefined, teamId: undefined, search: undefined },
        sort: { field: 'createdAt', order: 'desc' },
        page: { skip: 10, take: 10 },
      });
      expect(result).toEqual({
        data: [task],
        meta: { page: 2, limit: 10, total: 23, totalPages: 3 },
      });
    });

    it('repassa filtros e ordenação ao repositório', async () => {
      repository.findAll.mockResolvedValue({ items: [], total: 0 });
      const query = Object.assign(new FindTasksQueryDto(), {
        status: 'IN_PROGRESS',
        teamId: 4,
        search: 'readme',
        sortBy: 'title',
        order: 'asc',
      });

      await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith({
        filters: { status: 'IN_PROGRESS', teamId: 4, search: 'readme' },
        sort: { field: 'title', order: 'asc' },
        page: { skip: 0, take: 10 },
      });
    });
  });

  describe('findOne', () => {
    it('retorna a task quando existe', async () => {
      repository.findById.mockResolvedValue(task);

      await expect(service.findOne(1)).resolves.toEqual(task);
    });

    it('lança NotFoundException quando não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('lança BadRequestException quando nenhum campo é informado', async () => {
      await expect(service.update(1, {})).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repository.findById).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('atualiza sem consultar times quando teamIds não é informado', async () => {
      repository.findById.mockResolvedValue(task);
      repository.update.mockResolvedValue({ ...task, status: 'COMPLETED' });

      await service.update(1, { status: 'COMPLETED' });

      expect(teamsService.ensureAllExist).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(1, {
        status: 'COMPLETED',
      });
    });

    it('aceita teamIds vazio para desvincular todos os times', async () => {
      repository.findById.mockResolvedValue(task);
      repository.update.mockResolvedValue(task);

      await service.update(1, { teamIds: [] });

      expect(teamsService.ensureAllExist).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(1, { teamIds: [] });
    });

    it('valida os times antes de atualizar quando teamIds é informado', async () => {
      repository.findById.mockResolvedValue(task);
      repository.update.mockResolvedValue(task);

      await service.update(1, { teamIds: [3] });

      expect(teamsService.ensureAllExist).toHaveBeenCalledWith([3]);
      expect(repository.update).toHaveBeenCalledWith(1, { teamIds: [3] });
    });

    it('lança NotFoundException quando a task não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, { title: 'X' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('remove quando a task existe', async () => {
      repository.findById.mockResolvedValue(task);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('lança NotFoundException quando a task não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
