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
import { Tasks } from 'src/generated/prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

const ID_PARAM = { name: 'id', type: Number, description: 'Id da task' };

@ApiTags('Tasks')
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma task',
    description:
      'Uma task pode pertencer a zero ou mais times. Se algum id em teamIds não existir, nada é criado e a resposta é 404.',
  })
  @ApiDataResponse(TaskDto, { status: HttpStatus.CREATED })
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  create(@Body() dto: CreateTaskDto): Promise<Tasks> {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista tasks',
    description:
      'Suporta filtros por status, time e busca no título, ordenação e paginação. Os filtros se combinam com E lógico e o meta.total reflete o filtro aplicado.',
  })
  @ApiPaginatedResponse(TaskDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST)
  findAll(@Query() query: FindTasksQueryDto): Promise<Paginated<Tasks>> {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma task pelo id' })
  @ApiParam(ID_PARAM)
  @ApiDataResponse(TaskDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tasks> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza uma task',
    description:
      'Atualização parcial. É preciso informar ao menos um campo. Quando teamIds é enviado, a lista substitui os vínculos atuais; [] remove todos.',
  })
  @ApiParam(ID_PARAM)
  @ApiDataResponse(TaskDto)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Tasks> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma task' })
  @ApiParam(ID_PARAM)
  @ApiNoContentResponse({ description: 'Task removida.' })
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.remove(id);
  }
}
