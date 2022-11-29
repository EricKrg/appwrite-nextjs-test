import { Account, Client, Databases, Models, Permission, RealtimeResponseEvent, Role } from 'appwrite'
import { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Server } from '../utils/config'

export interface TaskRecord {
  id?: string
  task?: string
  taskState?: boolean
  updated?: string
}

export class AppwriteSerivce extends Component {
  static myInstance = null
  private readonly client!: Client
  private readonly account!: Account
  private readonly database!: Databases

  private constructor (url: string, projectId: string) {
    super({})
    this.client = new Client().setEndpoint(url).setProject(projectId)
    this.account = new Account(this.client)
    this.database = new Databases(this.client)
  }

  static getInstance (): AppwriteSerivce {
    if (this.myInstance === null) {
      return new AppwriteSerivce(Server.endpoint, Server.project)
    }
    return this.myInstance
  }

  async loginViaMail (mail: string, pw: string): Promise<Models.Session> {
    const session = await this.account.createEmailSession(mail, pw)
    return session
  }

  setJWT (token: string): void {
    this.account.client.setJWT(token)
  }

  async listSession (): Promise<Models.SessionList> {
    return await this.account.listSessions()
  }

  createCollection (name: string, data: any): void {
    // const res = await this.client.records.create(name, this.client.authStore.model?.id, data)
    // return res;
  }

  async getCurrentUser (): Promise<Models.Preferences | null> {
    try {
      const acc = await this.account.get()
      return acc
    } catch (error) {
      console.warn('user error', error)
      return null
    }
  }

  async logOutCurruentUser (): Promise<void> {
    await this.account.deleteSession('current')
  }

  async createNewUser (name: string, email: string, pw: string): Promise<Models.Account<Models.Preferences>> {
    const userId = uuidv4()
    const res = await this.account.create(userId, email, pw, name)
    return res
  }

  async createTask (task: string, taskState: boolean): Promise<void> {
    const user = await this.getCurrentUser()
    if (user != null) {
      console.log('new task', user.$id)
      await this.database.createDocument(Server.databaseID, Server.collectionID,
        'unique()', { task, taskState },
        [
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
          Permission.read(Role.user(user.$id))
        ])
    } else {
      console.warn('Entry not created no login!')
    }
  }

  async updateTask (task: TaskRecord): Promise<void> {
    console.log('update', task)
    await this.database.updateDocument(
      Server.databaseID,
      Server.collectionID,
      task.id!, {
        task: task.task,
        taskState: task.taskState
      })
  }

  async deleteTask (task: TaskRecord): Promise<void> {
    await this.database.deleteDocument(Server.databaseID, Server.collectionID, task.id!)
  }

  async getTasks (): Promise<Models.DocumentList<Models.Document>> {
    const res = await this.database.listDocuments(Server.databaseID, Server.collectionID)
    return res
  }

  async getTasksWithJWT (token: string): Promise<Models.DocumentList<Models.Document>> {
    const myHeaders = new Headers()
    myHeaders.append('Cookie', token)
    myHeaders.append('x-appwrite-project', Server.project)
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'GET',
      headers: myHeaders
    }

    const data = await fetch(`${Server.endpoint}/databases/${Server.databaseID}/collections/${Server.collectionID}/documents`, requestOptions)
    const res = await data.json()
    return res
  }

  async getTasksbyUserId (userId: string): Promise<TaskRecord[]> {
    return []
  }

  subToCollection (subString: string, callback: (e: RealtimeResponseEvent<any>) => void): () => void {
    const sub = this.client.subscribe([subString], response => callback(response))
    return sub
  }
}
export default AppwriteSerivce
