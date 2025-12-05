import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioServicio {
  private cliente: Twilio;
  private readonly logger = new Logger(TwilioServicio.name);

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    this.cliente = new Twilio(accountSid, authToken);
  }

  async enviarAlerta(cuerpoMensaje: string) {
    try {
      const from = this.configService.getOrThrow<string>('TWILIO_SENDER_NUMBER');
      const to = this.configService.getOrThrow<string>('MY_PHONE_NUMBER');

      await this.cliente.messages.create({
        body: cuerpoMensaje,
        from: from,
        to: to,
      });
      this.logger.log('Mensaje de Twilio enviado correctamente.');
    } catch (error) {
      this.logger.error('Error enviando mensaje de Twilio:', error);
    }
  }
}