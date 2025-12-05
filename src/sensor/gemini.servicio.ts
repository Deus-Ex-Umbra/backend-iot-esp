import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeminiServicio {
  private apiKey: string;
  private readonly API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
  }

  private async llamarApiGemini(prompt: string): Promise<string> {
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    try {
      const response = await axios.post(
        `${this.API_URL}?key=${this.apiKey}`,
        requestBody,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleanText = text ? text.trim() : 'Sin respuesta de texto.';

      console.log("\x1b[36m%s\x1b[0m", "🤖 [GEMINI]:", cleanText);

      return cleanText;

    } catch (error) {
      console.error("Error API Gemini:", error.response?.data || error.message);
      return "Error consulta IA.";
    }
  }

  async analizarEstado(datos: any): Promise<string> {
    const prompt = `
      Eres un asistente de hogar inteligente con personalidad.
      Datos actuales: ${JSON.stringify(datos)}
      
      INSTRUCCIONES:
      1. Si el estado es NORMAL/SEGURO: Responde con tranquilidad y cuenta un chiste tecnológico o sarcástico muy corto.
      2. Si el estado es PELIGRO/ADVERTENCIA: Sé muy calmado, tranquilizador y da UN consejo de seguridad útil y directo.
      3. Longitud máxima: 20 palabras.
    `;
    return await this.llamarApiGemini(prompt);
  }

  async generarMensajeReporte(datos: any, instruccionUsuario: string): Promise<string> {
    return await this.llamarApiGemini(`Reporte corto: ${JSON.stringify(datos)}. Usuario pide: ${instruccionUsuario}`);
  }
}