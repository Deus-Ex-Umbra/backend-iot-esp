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
  private cacheRespuestaGemini: string = "Sistema IoT escuchando..."; // Mensaje por defecto

  constructor(
    @InjectRepository(LecturaSensor)
    private sensorRepo: Repository<LecturaSensor>,
    private twilioServicio: TwilioServicio,
    private geminiServicio: GeminiServicio,
  ) {}

  async crear(dto: CrearLecturaDto) {
    const lectura = this.sensorRepo.create(dto);

    // --- LOGICA BAJO DEMANDA ---
    // Solo consultamos si el Arduino envía la bandera explícita 'consultar_ia'
    if (dto.consultar_ia === true) {
      console.log("\x1b[33m%s\x1b[0m", "⚡ Petición manual recibida. Consultando Gemini...");
      
      try {
        const analisis = await this.geminiServicio.analizarEstado({
          temp: dto.temperatura,
          gas: dto.nivel_gas,
          alerta: dto.estado_alerta
        });
        
        this.cacheRespuestaGemini = analisis; // Actualizamos memoria
        
      } catch (e) {
        console.error("Error IA, manteniendo mensaje anterior.");
      }
    }

    // Siempre devolvemos algo en el campo respuesta_gemini para que el Arduino lo muestre
    lectura.respuesta_gemini = this.cacheRespuestaGemini;

    // --- ALERTAS CRÍTICAS SMS (Independiente de la IA) ---
    if (dto.estado_alerta !== EstadoAlerta.NORMAL) {
      this.manejarAlerta(dto);
    }

    return await this.sensorRepo.save(lectura);
  }

  async manejarAlerta(dto: CrearLecturaDto) {
    const ahora = Date.now();
    const unMinuto = 60 * 1000;
    if (ahora - this.ultimaHoraAlerta > unMinuto) {
      const mensaje = `ALERTA ${dto.estado_alerta}: Gas ${dto.nivel_gas}, Temp ${dto.temperatura}.`;
      this.twilioServicio.enviarAlerta(mensaje).catch(e => console.error("Error Twilio", e));
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