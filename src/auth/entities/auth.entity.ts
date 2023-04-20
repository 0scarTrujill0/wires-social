import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('auth', { schema: 'public' })
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'Nombre de usuario',
  })
  @Column('character varying', { name: 'user_name', nullable: false })
  userName: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'Email del usuario',
  })
  @Column('character varying', { name: 'email', nullable: false })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Contraseña del usuario',
  })
  @Column('character varying', { name: 'password', nullable: false })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @Column('character varying', { name: 'full_name', nullable: false })
  fullName: string;

  // Columnas de trazabilidad de la info
  @Column({
    name: 'is_deleted',
    nullable: false,
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
