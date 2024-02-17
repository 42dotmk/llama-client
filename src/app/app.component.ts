import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LlamaService } from './services/llama.service';
import { marked } from 'marked';
import { ChatResponse } from 'ollama/dist/interfaces';
import { ChatMessage } from './interfaces/chat-message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  messages: ChatMessage[] = [];
  input = '';
  isLoading = false;

  constructor(private readonly llamaService: LlamaService) { }

  onEnter(): void {
    if (!this.input) return;

    this.isLoading = true;

    this.addInputAsMessage();
    this.addBlankAssistantMessage();

    this.llamaService.postStreamingPrompt(this.input, this.messages)
      .subscribe({
        next: (response: ChatResponse) => {
          this.updateLastMessage(response.message.content);
        },
        error: (_) => {
          this.isLoading = false;
          this.setLastMessageAsError();
          this.setLastMessageAsDone();
        },
        complete: () => {
          this.isLoading = false;
          this.input = '';
          this.setLastMessageAsDone();
          
        },
      });
  }

  addInputAsMessage(): void {
    this.messages.push({
      role: 'user',
      content: this.input,
      dateTime: new Date(),
    })
  }

  addBlankAssistantMessage(): void {
    this.messages.push({
      role: 'assistant',
      content: '',
      dateTime: new Date(),
    })
  }

  updateLastMessage(chatChunk: string): void {
    if (this.messages.length) {
      const lastMessage = this.messages[this.messages.length - 1];
      lastMessage.content += chatChunk;
      this.messages = [...this.messages.slice(0, -1), lastMessage];
    }
  }

  setLastMessageAsError(): void {
    if (this.messages.length) {
      const lastMessage = this.messages[this.messages.length - 1];
      lastMessage.hasError = true;
      this.messages = [...this.messages.slice(0, -1), lastMessage];
    }
  }

  setLastMessageAsDone(): void {
    if (this.messages.length) {
      const lastMessage = this.messages[this.messages.length - 1];
      lastMessage.isDone = true;
      this.messages = [...this.messages.slice(0, -1), lastMessage];
    }
  }

  parseToHtml(toHtml: string): string {
    return marked.parse(toHtml) as string;
  }
}
