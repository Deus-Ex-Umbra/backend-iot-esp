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

    // 1. Consultar a Gemini (Modelo Flash es rápido, esperamos la respuesta)
    try {
      const analisis = await this.geminiServicio.analizarEstado({
        t: dto.temperatura,
        g: dto.nivel_gas,
        h: dto.humedad,
        a: dto.estado_alerta
      });
      lectura.respuesta_gemini = analisis;
    } catch (e) {
      lectura.respuesta_gemini = "Error IA";
    }

    // 2. Gestionar Alertas SMS (Twilio)
    if (dto.estado_alerta !== EstadoAlerta.NORMAL) {
      this.manejarAlerta(dto); // No usamos await para no bloquear
    }

    // 3. Guardar y devolver (Esto envía el JSON de vuelta al Arduino)
    return await this.sensorRepo.save(lectura);
  }

  async manejarAlerta(dto: CrearLecturaDto) {
    const ahora = Date.now();
    const unMinuto = 60 * 1000;
    if (ahora - this.ultimaHoraAlerta > unMinuto) {
      const mensaje = `ALERTA ${dto.estado_alerta}: Gas ${dto.nivel_gas}, Temp ${dto.temperatura}.`;
      await this.twilioServicio.enviarAlerta(mensaje);
      this.ultimaHoraAlerta = ahora;
    }
  }

  async encontrarTodos() {
    return await this.sensorRepo.find({
      order: { fecha: 'DESC' },
      take: 50,
    });
  }

  async obtenerUltimoYAnalizar() {
    const ultimo = await this.sensorRepo.findOne({ order: { fecha: 'DESC' } });
    return ultimo || { mensaje: 'Sin datos' };
  }
}