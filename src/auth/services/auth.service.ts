import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from '../entities/auth.entity';
import { SignInDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly repository: Repository<AuthEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: AuthEntity, res: Response) {
    const validateUser = await this.repository.findOne({
      where: {
        userName: body.userName,
        isDeleted: false,
      },
    });
    if (validateUser == null) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(body.password, salt);
      body.password = hashPassword;
      return await this.repository
        .save(body)
        .then(async (response) => {
          res.status(HttpStatus.CREATED).json({
            message: 'Usuario creado con exito',
            data: {
              id: response.id,
              userName: response.userName,
              email: response.email,
              fullName: response.fullName,
            },
          });
        })
        .catch((err) => {
          res.status(HttpStatus.BAD_REQUEST).json({
            message: 'No fue posible crear el usuario',
            errors: err.message,
          });
        });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'El nombre de usuario ya se encuentra registrado',
      });
    }
  }

  async signIn(body: SignInDto) {
    const user = await this.repository.findOne({
      where: {
        userName: body.userName,
        isDeleted: false,
      },
    });

    if (user && (await bcrypt.compare(body.password, user.password))) {
      const payload = { username: user.userName, sub: user.id };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '6h',
      });
      return {
        access_token: token,
        expires_in: '6h',
        message: 'Successfully logged in',
        status: true,
      };
    } else {
      return {
        message: 'Nombre de usuario o contraseña invalido',
      };
    }
  }

  validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (err) {
      throw new HttpException('No esta autorizado', HttpStatus.FORBIDDEN);
    }
  }

  async updateUser(body: AuthEntity, res: Response) {
    const updateObject = await this.repository.findOne({
      where: {
        id: body.id,
        isDeleted: false,
      },
    });
    if (updateObject != null) {
      return await this.repository.update(body.id, body).then(async () => {
        res.status(HttpStatus.OK).json({
          message: 'Usuario actualizado con exito',
        });
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'El usuario no se encuentra registrado',
      });
    }
  }

  async deleteUser(id: string, res: Response) {
    return await this.repository
      .findOne({
        where: {
          id: id,
          isDeleted: false,
        },
      })
      .then(async (response) => {
        if (response != null) {
          response.isDeleted = true;
          await this.repository.save(response).then(async () => {
            res.status(HttpStatus.OK).json({
              message: 'Usuario eliminado con exito',
            });
          });
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            message: 'El usuario no se encuentra registrado',
          });
        }
      });
  }
}
