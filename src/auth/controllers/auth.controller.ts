import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthEntity } from '../entities/auth.entity';
import { ValidatorPipe } from 'src/pipes/validation.pipe';
import { signInSchema, signUpSchema, updateSchema } from 'src/auth/schemas/auth.schema';
import { SignInDto } from '../dto/auth.dto';

@ApiTags('Auth')
@Controller('/wires/auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/signup/')
  @UsePipes(new ValidatorPipe(signUpSchema))
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado',
    type: AuthEntity,
  })
  signUp(@Body() body: AuthEntity, @Res() res: Response) {
    return this.service.signUp(body, res);
  }

  @Post('/signin/')
  @UsePipes(new ValidatorPipe(signInSchema))
  @ApiOperation({ summary: 'Loguear un usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario logueado',
  })
  signIn(@Body() body: SignInDto) {
    return this.service.signIn(body);
  }

  @Put()
  @UsePipes(new ValidatorPipe(updateSchema))
  @ApiOperation({ summary: 'Actualizar un usuario en específico' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado',
    type: AuthEntity,
  })
  updateUser(@Body() body: AuthEntity, @Res() res: Response) {
    return this.service.updateUser(body, res);
  }

  @Delete('/:id/')
  @ApiOperation({ summary: 'Eliminar un vehículo en específico' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehículo eliminado',
    type: AuthEntity,
  })
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    return this.service.deleteUser(id, res);
  }
}
