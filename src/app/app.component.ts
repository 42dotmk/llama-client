import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LlamaService } from './services/llama.service';
import { marked } from 'marked';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  messages: { sender: 'LLAMA' | 'YOU'; message: string; createdAt: string }[] =
    [];
  context: number[] = [];
  input = '';
  isLoading = false;

  constructor(private readonly llamaService: LlamaService) {}

  onEnter(): void {
    this.isLoading = true;
    this.messages.push({
      sender: 'YOU',
      message: this.input,
      createdAt: Date(),
    });

    this.llamaService
      .postNonStreamingPrompt(this.input, this.context)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.context = data.context;
          this.messages.push({
            sender: 'LLAMA',
            message: marked.parse(data.response) as string,
            createdAt: data['created_at'],
          });
          this.isLoading = false;
        },
      });
    this.input = '';
  }
}
