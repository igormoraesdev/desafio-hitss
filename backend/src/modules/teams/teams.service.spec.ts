import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { Teams } from '../../generated/prisma/client';
import { FindTeamsQueryDto } from './dto/find-teams-query.dto';
import {
  TEAMS_REPOSITORY,
  TeamNameInUseError,
  TeamsRepository,
} from './repositories/teams.repository';
import { TeamsService } from './teams.service';

const team: Teams = {
  id: 1,
  name: 'Alpha',
  color: '#ff0000',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const silentLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};

describe('TeamsService', () => {
  let service: TeamsService;
  let repository: jest.Mocked<TeamsRepository>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findManyByIds: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: TEAMS_REPOSITORY, useValue: repository },
        { provide: getLoggerToken(TeamsService.name), useValue: silentLogger },
      ],
    }).compile();

    service = module.get(TeamsService);
  });

  describe('create', () => {
    it('cria o time quando o nome está disponível', async () => {
      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(team);

      const result = await service.create({ name: 'Alpha', color: '#ff0000' });

      expect(result).toEqual(team);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Alpha',
        color: '#ff0000',
      });
    });

    it('lança ConflictException quando o nome já existe', async () => {
      repository.findByName.mockResolvedValue(team);

      await expect(
        service.create({ name: 'Alpha', color: '#00ff00' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('create (corrida no nome único)', () => {
    it('converte a violação de unicidade do banco em ConflictException', async () => {
      repository.findByName.mockResolvedValue(null);
      repository.create.mockRejectedValue(new TeamNameInUseError('Alpha'));

      await expect(
        service.create({ name: 'Alpha', color: '#ff0000' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('repassa outros erros do repositório sem converter', async () => {
      repository.findByName.mockResolvedValue(null);
      repository.create.mockRejectedValue(new Error('conexão caiu'));

      await expect(
        service.create({ name: 'Alpha', color: '#ff0000' }),
      ).rejects.toThrow('conexão caiu');
    });
  });

  describe('findAll', () => {
    it('devolve data e meta calculados a partir de page e limit', async () => {
      repository.findAll.mockResolvedValue({ items: [team], total: 23 });
      const query = Object.assign(new FindTeamsQueryDto(), {
        page: 2,
        limit: 10,
      });

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith({
        filters: { search: undefined },
        page: { skip: 10, take: 10 },
      });
      expect(result).toEqual({
        data: [team],
        meta: { page: 2, limit: 10, total: 23, totalPages: 3 },
      });
    });

    it('repassa a busca por nome ao repositório', async () => {
      repository.findAll.mockResolvedValue({ items: [team], total: 1 });
      const query = Object.assign(new FindTeamsQueryDto(), {
        search: 'alp',
      });

      await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith({
        filters: { search: 'alp' },
        page: { skip: 0, take: 10 },
      });
    });
  });

  describe('findOne', () => {
    it('retorna o time quando existe', async () => {
      repository.findById.mockResolvedValue(team);

      await expect(service.findOne(1)).resolves.toEqual(team);
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

    it('atualiza sem checar nome quando o nome não muda', async () => {
      repository.findById.mockResolvedValue(team);
      repository.update.mockResolvedValue({ ...team, color: '#0000ff' });

      await service.update(1, { color: '#0000ff' });

      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(1, { color: '#0000ff' });
    });

    it('lança ConflictException ao renomear para um nome em uso', async () => {
      repository.findById.mockResolvedValue(team);
      repository.findByName.mockResolvedValue({ ...team, id: 2, name: 'Beta' });

      await expect(service.update(1, { name: 'Beta' })).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('lança NotFoundException quando o time não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: 'X' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update (corrida no nome único)', () => {
    it('converte a violação de unicidade do banco em ConflictException', async () => {
      repository.findById.mockResolvedValue(team);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockRejectedValue(new TeamNameInUseError('Beta'));

      await expect(service.update(1, { name: 'Beta' })).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('ensureAllExist', () => {
    it('resolve quando todos os ids existem', async () => {
      repository.findManyByIds.mockResolvedValue([team, { ...team, id: 2 }]);

      await expect(service.ensureAllExist([1, 2])).resolves.toBeUndefined();
      expect(repository.findManyByIds).toHaveBeenCalledWith([1, 2]);
    });

    it('lança NotFoundException listando os ids ausentes', async () => {
      repository.findManyByIds.mockResolvedValue([team]);

      await expect(service.ensureAllExist([1, 7, 9])).rejects.toThrow(
        'Times não encontrados: 7, 9',
      );
    });
  });

  describe('remove', () => {
    it('remove quando o time existe', async () => {
      repository.findById.mockResolvedValue(team);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('lança NotFoundException quando o time não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
