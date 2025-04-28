interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    due_date: string;
    created_at?: string;
}
interface TaskInput {
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    due_date: string;
}
export { Task, TaskInput };
