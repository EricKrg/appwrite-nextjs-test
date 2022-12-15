import type { NextApiRequest, NextPage } from 'next'
import Logout from '../components/Logout'
import Task from '../components/Task'
import TaskList from '../components/TaskList'
import { useUser } from '../components/user'
import React from 'react'
import AppwriteSerivce, { TaskRecord } from '../services/appwrite.service'
import { SSRprops } from '../utils/SSRprops'

const Home: NextPage = ({ data, error }: any) => {
  console.log('params', data, error)
  const userContext = useUser()

  return (<>
    <div className="h-full flex flex-col">
      <div className='flex flex-row items-center'>
        <h1 className="grow content-heading">Todo</h1>
        <div className="bg-slate-500 text-slate-50 rounded-3xl px-2 flex flex-row items-center h-6 dark:bg-slate-100 dark:text-slate-800">
          <span className=" text-sm text-right font-light mr-2">{userContext.user?.email}</span>
          <Logout />
        </div>
      </div>
      <div className="flex-col flex overflow-y-auto">
        <TaskList taskListInput={data}/>
      </div>
      <div className='flex '>
        <Task id={undefined} task={''} taskState={false} attachments={[]} />
      </div>
    </div>
  </>)
}

export async function getServerSideProps ({ req, res }: { req: NextApiRequest, res: any }): Promise<SSRprops> {
  const appwrite = AppwriteSerivce.getInstance()
  console.log('auth cookie', req.headers.cookie)
  try {
    console.log('fetch data')
    let data: TaskRecord[] = []

    if (req.headers.cookie) {
      const res = await appwrite.getTasksWithJWT(req.headers.cookie)
      data = res.documents.map((d) => {
        return {
          id: d.$id,
          task: d.task,
          taskState: d.taskState ?? false,
          attachments: d.attachments ?? [],
          updated: d.$updatedAt
        }
      })
    }

    console.log('SSR data', data)
    return {
      props: {
        data,
        protected: true
      }
    }
  } catch (error: any) {
    console.warn('Server side error', error)
    return {
      props: {
        data: [],
        error: error.message,
        protected: true
      }
    }
  }
}

export default Home
