import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum EstadoAlerta {
  NORMAL = 'NORMAL',
  ADVERTENCIA = 'ADVERTENCIA',
  PELIGRO = 'PELIGRO',
  POLICIA = 'POLICIA',
}

@Entity()
export class LecturaSensor {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column('float')
  temperatura: number;

  @Column('int')
  humedad: number;

  @Column('int')
  nivel_gas: number;

  @Column()
  presencia: boolean;

  @Column({
    type: 'enum',
    enum: EstadoAlerta,
    default: EstadoAlerta.NORMAL,
  })
  estado_alerta: EstadoAlerta;

  @Column({ nullable: true })
  musica_sonando: string; 

  @Column('text', { nullable: true })
  respuesta_gemini: string;
}