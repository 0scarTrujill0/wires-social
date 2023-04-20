import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { MessagesEntity } from '../entities/messages.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { CommentDto, ReactionDto } from '../dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly repository: Repository<MessagesEntity>,
    private readonly authService: AuthService,
  ) {}

  async createMessage(token: string, body: MessagesEntity, res: Response) {
    const payload = JSON.parse(
      JSON.stringify(await this.authService.validateToken(token)),
    );
    body.user = payload.sub;
    return await this.repository
      .save(body)
      .then(async (response) => {
        res.status(HttpStatus.CREATED).json({
          message: 'Mensaje creado con exito',
          data: response,
        });
      })
      .catch((err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'No fue posible crear el mensaje',
          errors: err.message,
        });
      });
  }

  async findForMe(token: string, query, res: Response) {
    const payload = JSON.parse(
      JSON.stringify(await this.authService.validateToken(token)),
    );
    const take = query.take || 50;
    const skip = (query.page - 1) * query.take || 0;
    return await this.repository
      .find({
        where: {
          user: payload.sub,
          isDeleted: false,
        },
        take: take,
        skip: skip,
      })
      .then(async (response) => {
        if (response.length > 0) {
          return res.status(HttpStatus.OK).json({
            message: 'Mensajes encontrados',
            data: response,
          });
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'No se encontraron mensajes',
            data: null,
          });
        }
      });
  }

  async findById(token: string, id: number, res: Response) {
    await this.authService.validateToken(token);
    return await this.repository
      .findOne({
        where: {
          id: id,
          isDeleted: false,
        },
      })
      .then(async (response) => {
        if (response != null) {
          return res.status(HttpStatus.OK).json({
            message: 'Mensaje encontrado',
            data: response,
          });
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'No se encontró el mensaje',
            data: null,
          });
        }
      });
  }

  async find(token: string, query, res: Response) {
    await this.authService.validateToken(token);
    const take = query.take || 50;
    const skip = (query.page - 1) * query.take || 0;
    return await this.repository
      .find({
        where: {
          isDeleted: false,
        },
        take: take,
        skip: skip,
      })
      .then(async (response) => {
        if (response.length > 0) {
          return res.status(HttpStatus.OK).json({
            message: 'Mensajes encontrados',
            data: response,
          });
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'No se encontraron mensajes',
            data: null,
          });
        }
      });
  }

  async createReaction(
    token: string,
    id: number,
    body: ReactionDto,
    res: Response,
  ) {
    const payload = JSON.parse(
      JSON.stringify(await this.authService.validateToken(token)),
    );
    return await this.repository
      .findOne({
        where: {
          id: id,
          isDeleted: false,
        },
      })
      .then(async (response) => {
        if (response != null) {
          if (response.user !== payload.sub) {
            const reaction = {
              reaction: body.reaction,
              author: payload.sub,
            };
            response.reactions.push(reaction);
            await this.repository.save(response).then(async (response) => {
              res.status(HttpStatus.OK).json({
                message: 'Reacción creada con exito',
                data: response,
              });
            });
          } else {
            res.status(HttpStatus.FORBIDDEN).json({
              message: 'No puedes reaccionar a un mensaje de tu autoría',
            });
          }
        } else {
          res.status(HttpStatus.NOT_FOUND).json({
            message: 'Mensaje no econtrado',
          });
        }
      });
  }

  async createComment(
    token: string,
    id: number,
    body: CommentDto,
    res: Response,
  ) {
    const payload = JSON.parse(
      JSON.stringify(await this.authService.validateToken(token)),
    );
    return await this.repository
      .findOne({
        where: {
          id: id,
          isDeleted: false,
        },
      })
      .then(async (response) => {
        if (response != null) {
          if (response.user !== payload.sub) {
            const comment = {
              comment: body.comment,
              author: payload.sub,
            };
            response.comments.push(comment);
            await this.repository.save(response).then(async (response) => {
              res.status(HttpStatus.OK).json({
                message: 'Comentario creado con exito',
                data: response,
              });
            });
          } else {
            res.status(HttpStatus.FORBIDDEN).json({
              message: 'No puedes comentar un mensaje de tu autoría',
            });
          }
        } else {
          res.status(HttpStatus.NOT_FOUND).json({
            message: 'Mensaje no econtrado',
          });
        }
      });
  }

  async delete(token: string, id: number, res: Response) {
    const payload = JSON.parse(
      JSON.stringify(await this.authService.validateToken(token)),
    );
    return this.repository
      .findOne({
        where: {
          id: id,
          isDeleted: false,
        },
      })
      .then(async (response) => {
        if (response != null) {
          if (response.user == payload.sub) {
            response.isDeleted = true;
            this.repository.save(response).then(async (response) => {
              res.status(HttpStatus.OK).json({
                message: 'Mensaje eliminado con exito',
                data: response,
              });
            });
          } else {
            res.status(HttpStatus.FORBIDDEN).json({
              message: 'No puedes eliminar un mensaje de otro usuario',
            });
          }
        } else {
          res.status(HttpStatus.NOT_FOUND).json({
            message: 'Mensaje no econtrado',
          });
        }
      });
  }
}
