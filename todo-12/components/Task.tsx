import React, { useEffect, useState } from 'react'
import { HiCheck, HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { AppwriteSerivce, TaskRecord } from '../services/appwrite.service'

export default function Task (params: TaskRecord): JSX.Element {
  const [task, setTask] = useState<TaskRecord | null>(params)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [isFadeOut, setIsFadeOut] = useState<boolean>(false)
  const appwrite = AppwriteSerivce.getInstance()

  useEffect(() => {
    // update task if something changes
    console.log('task change', params, task)
    if (!isUpdated) { // avoid flickering of changed value
      setTask({ ...params })
    }
    setIsUpdated(false)
  }, [params])

  const reset = (): void => {
    setTask({ id: undefined, task: '', taskState: false })
  }

  const onChangeTask = (change: string): void => {
    setTask({ ...task, task: change })
  }

  const onChangeTaskState = (change: boolean): void => {
    // console.log("change state", change, task);
    task!.taskState = change
    setIsFadeOut(change)
    setTask({ ...task })
  }

  const onBlur = async (): Promise<void> => {
    setIsLoading(true)
    if ((task?.id) != null) {
      await appwrite.updateTask({ ...task })
    } else if (task !== null &&
        task !== undefined &&
        task?.task !== '') {
      await appwrite.createTask(task.task!, task.taskState!)
      reset()
    }
    setIsLoading(false)
    setIsUpdated(true)
  }

  return (<>
        <div className={'todo-entry'}>
            {(params.id != null)
              ? <button className="todo-state" onClick={ () => {
                void (async (): Promise<void> => {
                  onChangeTaskState(!((task?.taskState) ?? false))
                  await onBlur()
                })()
              }}>
                {((task?.taskState) ?? false) ? <HiCheck/> : null}
            </button>
              : null}
            <input className={'grow bg-transparent truncate border-0 focus:ring-0 focus:ring-indigo-500 ' + (((task?.taskState) ?? false) ? 'line-through' : '')}
                disabled={isLoading}
                onBlur={ () => {
                  void (async () => await onBlur())()
                } }
                onChange={(e) => onChangeTask(e.target.value)} value={(task != null) ? task.task : ''}
                type="text" placeholder="new task...">
            </input>
            {(params.id != null)
              ? <button className="text-red-600 dark:text-red-400" onClick={
                () => {
                  void (async () => await appwrite.deleteTask(task!))()
                }
              }>
                <HiMinusCircle />
            </button>
              : <button className="text-indigo-800 dark:text-indigo-200" onClick={
                () => {
                  void (async (): Promise<void> => {
                    await appwrite.createTask(task!.task!, task!.taskState!)
                    reset()
                  })()
                }
            }><HiPlusCircle/></button>}
        </div>
    </>)
}
