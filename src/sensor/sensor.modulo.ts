import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorServicio } from './sensor.servicio';
import { SensorControlador } from './sensor.controlador';
import { LecturaSensor } from './entidades/lectura-sensor.entidad';
import { TwilioServicio } from './twilio.servicio';
import { GeminiServicio } from './gemini.servicio';

@Module({
  imports: [TypeOrmModule.forFeature([LecturaSensor])],
  controllers: [SensorControlador],
  providers: [SensorServicio, TwilioServicio, GeminiServicio],
})
export class SensorModulo {}