import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LecturaSensor, EstadoAlerta } from './entidades/lectura-sensor.entidad';
import { CrearLecturaDto } from './dto/crear-lectura.dto';
import { TwilioServicio } from './twilio.servicio';
import { GeminiServicio } from './gemini.servicio';

@Injectable()
export class SensorServicio {
  private ultimaHoraAlerta: number = 0;

  constructor(
    @InjectRepository(LecturaSensor)
    private sensorRepo: Repository<LecturaSensor>,
    private twilioServicio: TwilioServicio,
    private geminiServicio: GeminiServicio,
  ) {}

  async crear(dto: CrearLecturaDto) {
    const lectura = this.sensorRepo.create(dto);
    if (dto.estado_alerta !== EstadoAlerta.NORMAL) {
      await this.manejarAlerta(dto);
    }

    return await this.sensorRepo.save(lectura);
  }

  async manejarAlerta(dto: CrearLecturaDto) {
    const ahora = Date.now();
    const unMinuto = 60 * 1000;
    if (ahora - this.ultimaHoraAlerta > unMinuto) {
      const mensaje = `ALERTA ${dto.estado_alerta}: Gas: ${dto.nivel_gas}, Temp: ${dto.temperatura}°C. Se detectó presencia: ${dto.presencia ? 'SÍ' : 'NO'}`;
      await this.twilioServicio.enviarAlerta(mensaje);
      this.ultimaHoraAlerta = ahora;
    }
  }

  async obtenerUltimoYAnalizar() {
    const ultimo = await this.sensorRepo.findOne({
      order: { fecha: 'DESC' },
    });

    if (!ultimo) return { mensaje: 'No hay datos registrados aún.' };

    const analisis = await this.geminiServicio.analizarEstado({
      gas: ultimo.nivel_gas,
      temp: ultimo.temperatura,
      alerta: ultimo.estado_alerta
    });

    return { ultimo_dato: ultimo, analisis_ia: analisis };
  }

  async encontrarTodos() {
    return await this.sensorRepo.find({
      order: { fecha: 'DESC' },
      take: 50,
    });
  }
}