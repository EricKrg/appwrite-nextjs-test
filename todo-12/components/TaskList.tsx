import { RealtimeResponseEvent } from 'appwrite'
import React, { memo, useEffect, useState } from 'react'
import { HiCheck, HiOutlineClipboardList, HiOutlineTag } from 'react-icons/hi'
import { AppwriteSerivce, TaskRecord } from '../services/appwrite.service'
import { Server } from '../utils/config'
import Task from './Task'

export interface TaskListProps {
  elements: TaskRecord[]
}

function TaskList ({ taskListInput }: { taskListInput: TaskRecord[] }): JSX.Element {
  const realtimeChannel = `databases.${Server.databaseID}.collections.${Server.collectionID}.documents`
  const appwrite = AppwriteSerivce.getInstance()
  const [taskList, setTaskList] = useState<TaskRecord[]>(taskListInput)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [updateVal, setUpdateVal] = useState<{ action?: string, val?: TaskRecord }>({})
  const [showDone, setShowDone] = useState<boolean>(false)
  useEffect(() => {
    const unSub = appwrite.subToCollection(realtimeChannel, (e: RealtimeResponseEvent<any>) => {
      console.log('change', e.payload)
      console.log('tasks', taskList)
      const payload: { $id: string } = e.payload
      const action = e.events.find((i: string) => i.startsWith(realtimeChannel))
        ?.replace(`${realtimeChannel}.${payload.$id}.`, '')
      console.log('action', action)
      setUpdateVal({
        action,
        val: {
          id: e.payload.$id,
          task: e.payload.task,
          taskState: e.payload.taskState,
          updated: e.payload.$updatedAt
        }
      })
      console.log('sub action done')
    })

    return () => {
      // logout is before clean up
      console.log('clean up')
      unSub() // remove realtime sub on tear down
    }
  }, [])

  useEffect(() => {
    console.log('update val change')
    update(updateVal)
  }, [updateVal])

  const update = (updateVal: { action?: string, val?: TaskRecord }): void => {
    console.log('update', updateVal, taskList)
    switch (updateVal.action) {
      case 'update':
        setTaskList(taskList.map((i) => i.id === updateVal.val?.id ? updateVal.val! : i))
        break
      case 'create':
        setTaskList([...taskList, ...[updateVal.val!]])
        break
      case 'delete':
        setTaskList(taskList.filter((i) => i.id !== updateVal.val?.id))
        break
      default:
        console.warn('Unkown update action!', updateVal)
        break
    }
  }

  return (<>
        {isLoading
          ? <span>Loading...</span>
          : <div className="mt-3 flex-col flex">
                <div className="flex flex-row items-center mb-3 transition-all duration-300 ease-linear">
                    <div className="info-pill info-pill-total">
                        <span className="font-semibold text-sm">{taskList.length}</span>
                        <HiOutlineClipboardList />
                    </div>
                    <div className="info-pill info-pill-todo">
                        <span className="font-semibold text-sm mr-1">{taskList.filter(i => i.taskState).length}</span>
                        <HiOutlineTag />
                    </div>
                    <div className={'info-pill info-pill-done cursor-pointer' + (showDone ? ' ring-2 ring-slate-700 dark:ring-slate-900' : '')} onClick={() => setShowDone(!showDone)}>
                        <span className="font-semibold text-sm">{taskList.filter(i => i.taskState).length}</span>
                        <HiCheck />
                    </div>
                </div>
                <ul>
                    {taskList.filter(i => !(i.taskState ?? false) || showDone).map((i: TaskRecord) => {
                      return <li className={'flex w-full transition-all ease-linear duration-500 fade-in' + (((i?.taskState) ?? false) ? 'fade-out' : '')
                        //  + (i.taskState || showDone ? "fade-in": "")
                        } key={i.id}>
                            <Task key={i.id} id={i.id} task={i.task} taskState={i.taskState} updated={i.updated} />
                        </li>
                    })}
                </ul>
            </div>
        }
    </>)
}

export default memo(TaskList)
