export interface ChatMessage {
    role: 'user' | 'assistant',
    content: string;
    hasError?: boolean;
    dateTime: Date;
    isDone?: boolean;
}