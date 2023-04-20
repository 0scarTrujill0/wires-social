import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  Headers,
  Get,
  Query,
  Param,
  Delete,
  Patch
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MessagesService } from '../services/messages.service';
import { MessagesEntity } from '../entities/messages.entity';
import { ValidatorPipe } from 'src/pipes/validation.pipe';
import { messageSchemaCreate } from '../schemas/messages.schema';
import { CommentDto, ReactionDto } from '../dto/messages.dto';

@ApiTags('Auth')
@Controller('/wires/messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  @Post()
  @UsePipes(new ValidatorPipe(messageSchemaCreate))
  @ApiOperation({ summary: 'Crear un nuevo mensaje' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Mensaje creado',
    type: MessagesEntity,
  })
  createMessage(@Headers('Authorization') token: string, @Body() body: MessagesEntity, @Res() res: Response) {
    return this.service.createMessage(token, body, res);
  }

  @Get('/me/')
  @ApiOperation({ summary: 'Obtener todos los mensajes del usuario autorizado | Se puede paginar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mensajes obtenidos',
    type: [MessagesEntity],
  })
  findForMe(@Headers('Authorization') token: string, @Query() query: { take; page }, @Res() res: Response) {
    return this.service.findForMe(token, query, res);
  }

  @Get('/:id/')
  @ApiOperation({ summary: 'Obtener un mensaje por su ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mensaje obtenido',
    type: MessagesEntity,
  })
  findById(@Headers('Authorization') token: string, @Param('id') id: number, @Res() res: Response) {
    return this.service.findById(token, id, res);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los mensajes | Se puede paginar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mensajes obtenidos',
    type: [MessagesEntity],
  })
  find(@Headers('Authorization') token: string, @Query() query: { take; page }, @Res() res: Response) {
    return this.service.find(token, query, res);
  }

  @Patch('/reaction/:id/')
  @ApiOperation({ summary: 'Crear una reacción para mensaje en específico' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reacción creada',
    type: ReactionDto,
  })
  createReaction(@Headers('Authorization') token: string, @Param('id') id: number, @Body() body: ReactionDto, @Res() res: Response) {
    return this.service.createReaction(token, id, body, res);
  }

  @Patch('/comment/:id/')
  @ApiOperation({ summary: 'Crear un comentario para mensaje en específico' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reacción creada',
    type: ReactionDto,
  })
  createComment(@Headers('Authorization') token: string, @Param('id') id: number, @Body() body: CommentDto, @Res() res: Response) {
    return this.service.createComment(token, id, body, res);
  }

  @Delete('/:id/')
  @ApiOperation({ summary: 'Eliminar un mensaje en específico | Solo aplica para el autor | Se aplica un borrado lógico' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mensaje eliminado',
    type: MessagesEntity,
  })
  delete(@Headers('Authorization') token: string, @Param('id') id: number, @Res() res: Response) {
    return this.service.delete(token, id, res);
  }
}
