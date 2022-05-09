import {v4 as uuidv4} from "uuid";

import {Priority, TodoList, TodoListItem, TodoListSummary} from "./model";


export class TodoListService {
    private todoLists: TodoList[] = [];

    public addTodoList(name: string, description?: string): Promise<TodoList> {

        if (name.trim().length === 0) {
            return Promise.reject("name must not be empty")
        }

        if (this.todoLists.find(it => it.name === name)) {
            return Promise.reject("name does still exists")
        }

        const newTodoList: TodoList = {
            id: uuidv4(),
            name: name,
            description: description,
            createdAt: new Date().toISOString(),
            items: [],
            updatedAt: undefined
        }

        this.todoLists = [...this.todoLists, newTodoList];
        return Promise.resolve(newTodoList);

    }

    public getTodoLists(): TodoListSummary[] {
        return this.todoLists.map(it => ({
            id: it.id,
            name: it.name,
            description: it.description,
            createdAt: it.createdAt,
            updatedAt: it.updatedAt,
            numberOfItems: it.items.length,
        }))
    }

    public getTodoList(id: string): TodoList | undefined {
        return this.todoLists.find(it => it.id === id);
    }

    public updateTodoList(id: string, name: string, description?: string): Promise<TodoList | undefined> {
        const todoList = this.getTodoList(id);
        if (todoList === undefined) {
            return Promise.resolve(undefined);
        }

        if (name.trim().length === 0) {
            return Promise.reject("name must not be empty")
        }

        if (this.todoLists.find(it => it.name === name && it.id !== id)) {
            return Promise.reject("name does still exists")
        }

        const newTodoList: TodoList = {
            ...todoList,
            name: name,
            description: description,
            updatedAt: new Date().toISOString()
        }

        this.updateTodolistCache(newTodoList);
        return Promise.resolve(newTodoList);
    }

    public addListItem(listId: string, name: string, priority: Priority): Promise<TodoListItem | undefined> {
        const todoList = this.getTodoList(listId)
        if (todoList === undefined) {
            return Promise.resolve(undefined);
        }

        if (name.trim().length === 0) {
            return Promise.reject("name must not be empty")
        }
        const newListItem: TodoListItem = {
            listId: todoList.id,
            id: uuidv4(),
            name: name,
            priority: priority,
            createdAt: new Date().toISOString(),
            updatedAt: undefined
        };

        const newTodoList: TodoList = {
            ...todoList,
            items: [...todoList.items, newListItem]
        }
        this.updateTodolistCache(newTodoList);

        return Promise.resolve(newListItem);
    }


    private updateTodolistCache(changedTodoList: TodoList) {
        this.todoLists = this.todoLists.map(it => {
            if (it.id === changedTodoList.id) {
                return changedTodoList;
            }
            return it;
        });

    }

}