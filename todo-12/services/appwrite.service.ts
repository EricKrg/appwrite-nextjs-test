import { Account, Client, Databases, Models, Permission, RealtimeResponseEvent, Role } from 'appwrite';
import { Component } from 'react';
import {v4 as uuidv4} from 'uuid';
import { Server } from '../utils/config';


export interface TaskRecord {
    id?: string,
    task?: string,
    taskState?: boolean,
    updated?: string
}


export class AppwriteSerivce extends Component {
    static myInstance = null;
    private client!: Client;
    private account!: Account;
    private database!: Databases;

    private constructor(url: string, projectId: string) {
        super({});
        this.client = new Client().setEndpoint(url).setProject(projectId);
        this.account = new Account(this.client);
        this.database = new Databases(this.client);
    }

    static getInstance() {
        if (this.myInstance === null) {
            return new AppwriteSerivce(Server.endpoint, Server.project);
        }
        return this.myInstance;

    }

    async loginViaMail(mail: string, pw: string): Promise<Models.Session> {
        const session = await this.account.createEmailSession(mail, pw);
        return session;
    }

    async createCollection(name: string, data: any) {
        // const res = await this.client.records.create(name, this.client.authStore.model?.id, data)
        // return res;
    }

    async getCurrentUser(): Promise<Models.Preferences | null> {
        try {
            const acc = await this.account.get();
            return acc;
        } catch (error) {
            console.warn("user error", error);
            return null;
        }

    }

    logOutCurruentUser(): void {
        this.account.deleteSession("current");
    }

    async createNewUser(name: string, email: string, pw: string): Promise<Models.Account<Models.Preferences>> {
        const userId = uuidv4();
        const res = await this.account.create(userId,email, pw, name);
        return res; 

    }

    async createTask(task: string, taskState: boolean) {
        const user = await this.getCurrentUser();
        if (user) {
            console.log("new task", user.$id);
            this.database.createDocument(Server.databaseID, Server.collectionID,
                'unique()',
                JSON.stringify({ task: task, taskState: taskState }),
                [
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                    Permission.read(Role.user(user.$id)),
                    Permission.write(Role.user(user.$id)),

                ])
        } else {
            console.warn("Entry not created no login!");
        }

    }

    async updateTask(task: TaskRecord): Promise<void> {
        console.log("update", task)
        this.database.updateDocument(
            Server.databaseID,
            Server.collectionID,
            task.id!,
            JSON.stringify({
                task: task.task,
                taskState: task.taskState
            }))
    }

    async deleteTask(task: TaskRecord): Promise<void> {
        await this.database.deleteDocument(Server.databaseID, Server.collectionID, task.id!);
    }

    async getTasks(): Promise<Models.DocumentList<Models.Document>> {
        const res = await this.database.listDocuments(Server.databaseID, Server.collectionID);
        return res;
    }

    async getTasksbyUserId(userId: string): Promise<TaskRecord[]> {
        return [];
    }

    subToCollection(subString: string, callback: (e: RealtimeResponseEvent<any>) => void): () => void {
        const sub = this.client.subscribe([subString],response => callback(response))
        return sub;
    }  
}
export default AppwriteSerivce;
