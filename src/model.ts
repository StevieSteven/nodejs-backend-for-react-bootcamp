
export interface TodoListSummary {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly numberOfItems: number;
}

export interface TodoList {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly items: TodoListItem[];
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export interface TodoListItem {
    readonly id: string;
    readonly listId: string;
    readonly name: string;
    readonly priority: Priority;
    readonly createdAt: string;
    readonly updatedAt?: string;
}