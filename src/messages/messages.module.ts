import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './entities/messages.entity';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesEntity, AuthEntity])],
  providers: [MessagesService, AuthService, JwtService],
  controllers: [MessagesController],
})
export class MessagesModule {}
