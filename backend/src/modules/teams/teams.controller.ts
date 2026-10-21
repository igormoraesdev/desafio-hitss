import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Paginated } from 'src/common/pagination/pagination';
import {
  ApiDataResponse,
  ApiErrorResponses,
  ApiPaginatedResponse,
} from 'src/common/swagger/api-responses.decorator';
import { Teams } from 'src/generated/prisma/client';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamsQueryDto } from './dto/find-teams-query.dto';
import { TeamDto } from './dto/team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

const ID_PARAM = { name: 'id', type: Number, description: 'Id do time' };

@ApiTags('Teams')
@Controller('v1/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um time',
    description:
      'O nome é único. Tentar repetir um nome existente retorna 409.',
  })
  @ApiDataResponse(TeamDto, { status: HttpStatus.CREATED })
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT)
  create(@Body() dto: CreateTeamDto): Promise<Teams> {
    return this.teamsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista times',
    description:
      'Paginado e ordenado por nome, com busca opcional por trecho do nome. Cada time inclui suas tasks.',
  })
  @ApiPaginatedResponse(TeamDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST)
  findAll(@Query() query: FindTeamsQueryDto): Promise<Paginated<Teams>> {
    return this.teamsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um time pelo id' })
  @ApiParam(ID_PARAM)
  @ApiDataResponse(TeamDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Teams> {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza um time',
    description:
      'Atualização parcial. É preciso informar ao menos um campo. Renomear para um nome em uso retorna 409.',
  })
  @ApiParam(ID_PARAM)
  @ApiDataResponse(TeamDto)
  @ApiErrorResponses(
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND,
    HttpStatus.CONFLICT,
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamDto,
  ): Promise<Teams> {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove um time',
    description:
      'As tasks vinculadas não são removidas, apenas perdem o vínculo com o time.',
  })
  @ApiParam(ID_PARAM)
  @ApiNoContentResponse({ description: 'Time removido.' })
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teamsService.remove(id);
  }
}
