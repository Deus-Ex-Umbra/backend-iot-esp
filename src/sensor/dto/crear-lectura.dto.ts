import { IsEnum, IsNumber, IsBoolean, IsString, IsOptional } from 'class-validator';
import { EstadoAlerta } from '../entidades/lectura-sensor.entidad';

export class CrearLecturaDto {
  @IsNumber()
  temperatura: number;

  @IsNumber()
  humedad: number;

  @IsNumber()
  nivel_gas: number;

  @IsBoolean()
  presencia: boolean;

  @IsEnum(EstadoAlerta)
  estado_alerta: EstadoAlerta;

  @IsString()
  @IsOptional()
  musica_sonando?: string;

  @IsBoolean()
  @IsOptional()
  consultar_ia?: boolean;
}