import { Controller, Post, Body, Get } from '@nestjs/common';
import { SensorServicio } from './sensor.servicio';
import { CrearLecturaDto } from './dto/crear-lectura.dto';

@Controller('lecturas')
export class SensorControlador {
  constructor(private readonly sensorServicio: SensorServicio) {}

  @Post()
  crear(@Body() crearLecturaDto: CrearLecturaDto) {
    return this.sensorServicio.crear(crearLecturaDto);
  }

  @Get()
  encontrarTodos() {
    return this.sensorServicio.encontrarTodos();
  }

  @Get('estado')
  verificarEstado() {
    return this.sensorServicio.obtenerUltimoYAnalizar();
  }
}