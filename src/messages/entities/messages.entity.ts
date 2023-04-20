import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('messages', { schema: 'public' })
export class MessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '5c91874d-e8f2-4119-9a80-8e3d8f23dfee',
    description: 'Id del usuario que creó el mensaje',
  })
  @Column('character varying', { name: 'user', nullable: false })
  user: string;

  @ApiProperty({
    example: 'Nuevo título',
    description: 'Titulo del mensaje',
  })
  @Column('character varying', { name: 'title', nullable: false })
  title: string;

  @ApiProperty({
    example: 'Nueva descripción',
    description: 'Descripción del mensaje',
  })
  @Column('character varying', { name: 'content', nullable: false })
  content: string;

  @Column({ type: 'jsonb', array: false, name: 'comments', default: [] })
  comments: any[];

  @Column({ type: 'jsonb', array: false, name: 'reactions', default: [] })
  reactions: any[];

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
