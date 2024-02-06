import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const MODEL = 'llama2:7b';

@Injectable({
  providedIn: 'root',
})
export class LlamaService {
  constructor(private readonly http: HttpClient) {}

  postNonStreamingPrompt(prompt: string, context?: number[]): Observable<any> {
    return this.http.post('https://llama.42.mk/api/generate', {
      model: MODEL,
      prompt: prompt,
      context: context ?? [],
      stream: false,
    });
  }
}
