import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatResponse, Message, Ollama } from 'ollama';
import { Observable, Subject } from 'rxjs';

const MODEL = 'llama2:7b';

@Injectable({
  providedIn: 'root',
})
export class LlamaService {
  private readonly ollama: Ollama;

  constructor(private readonly http: HttpClient) {
    this.ollama = new Ollama();
  }

  postNonStreamingPrompt(prompt: string, context?: number[]): Observable<any> {
    return this.http.post('https://llama.42.mk/api/generate', {
      model: MODEL,
      prompt: prompt,
      context: context ?? [],
      stream: false,
    });
  }

  postStreamingPrompt(prompt: string, messages?: Message[]): Observable<ChatResponse> {
    var subject = new Subject<ChatResponse>();

    this.ollama.chat({
      model: 'llama2:7b',
      messages: [...messages ?? [], { role: 'user', content: prompt, }],
      stream: true,
    }).then(async (messageStream) => {
      for await (const chunk of messageStream) {
        subject.next(chunk);
      }
      subject.complete();
    });

    return subject;
  }
}
