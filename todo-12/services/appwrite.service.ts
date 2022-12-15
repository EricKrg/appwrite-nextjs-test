import { Account, Client, Databases, ID, Models, Permission, RealtimeResponseEvent, Role, Storage } from 'appwrite'
import { cloneDeep } from 'lodash'
import { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Server } from '../utils/config'

export interface TaskRecord {
  id?: string
  task?: string
  taskState?: boolean
  attachments: string[]
  updated?: string
}

export interface Attachment {
  filename: string
  file_id: string
}

export class AppwriteSerivce extends Component {
  static myInstance = null
  private readonly client!: Client
  private readonly account!: Account
  private readonly database!: Databases
  private readonly storage!: Storage

  private constructor (url: string, projectId: string) {
    super({})
    this.client = new Client().setEndpoint(url).setProject(projectId)
    this.account = new Account(this.client)
    this.database = new Databases(this.client)
    this.storage = new Storage(this.client)
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

  async createTask (task: string, taskState: boolean, attachments: string[] = []): Promise<void> {
    const user = await this.getCurrentUser()
    if (user != null) {
      console.log('new task', user.$id)
      await this.database.createDocument(Server.databaseID, Server.collectionID,
        'unique()', { task, taskState, attachments },
        [
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
          Permission.read(Role.user(user.$id))
        ])
    } else {
      console.warn('Entry not created no login!')
    }
  }

  async updateTask (task: TaskRecord): Promise<Models.Document> {
    console.log('update', task)
    const res = await this.database.updateDocument(
      Server.databaseID,
      Server.collectionID,
      task.id!, {
        task: task.task,
        taskState: task.taskState,
        attachments: task.attachments
      })
    return res
  }

  async deleteDoc (documentId: string, collectionID: string): Promise<void> {
    await this.database.deleteDocument(Server.databaseID, collectionID, documentId)
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

  async getAttachmentById (documentId: string): Promise<Models.Document> {
    const res = await this.database.getDocument(Server.databaseID, Server.attachmentID, documentId)
    return res
  }

  async getAttachmentFileById (fileId: string): Promise<URL> {
    const url = this.storage.getFileDownload(Server.bucketID, fileId)
    console.log('URL', url)
    return url
  }

  async createAttachment (file: File, taskRecord: TaskRecord): Promise<boolean> {
    // it could be advisable to use a cloud function so that all actions which
    // depend on the creation of an Attachment are included in that call of the cloud function
    const user = await this.getCurrentUser()
    const taskRecordOrg = cloneDeep(taskRecord)
    if (user != null) {
      const attachmentID = uuidv4()
      console.log('New attachment id', attachmentID)
      const createFile = this.storage.createFile(Server.bucketID, attachmentID, file, [
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
        Permission.read(Role.user(user.$id))
      ])

      const createAttachment = this.database.createDocument(Server.databaseID, Server.attachmentID,
        attachmentID, { filename: file.name, file_id: attachmentID },
        [
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
          Permission.read(Role.user(user.$id))
        ])

      if (taskRecord.attachments != null) {
        taskRecord.attachments.push(attachmentID)
      } else {
        taskRecord.attachments = [attachmentID]
      }
      const updateTask = this.updateTask(taskRecord)

      try {
        const res = await Promise.all([createFile, createAttachment, updateTask])
        console.log('result', res)
        return true
      } catch (err: any) {
        // ONLY ACCOUNTS FOR CREATE FILE ERRORS ATM
        console.warn('error promise all, rolling back changes', err)
        await this.updateTask(taskRecordOrg)
        await this.deleteDoc(attachmentID, Server.attachmentID)
        return false
      }
    }
    return false
  }
}
export default AppwriteSerivce
