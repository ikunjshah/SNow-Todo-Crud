export interface Todo {
    id: number;
    value: string;
    isDone: boolean;
    u_todo: string;
    u_status: string;
    u_priority: string;
    u_glide_date: string;
    u_progress?: number;
    u_assignee?: string;
    u_photo?: HTMLImageElement;
} 