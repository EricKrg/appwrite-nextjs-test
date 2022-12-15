import React, { ChangeEvent, useRef, useState } from 'react'
import { HiDocumentAdd } from 'react-icons/hi'
import AppwriteSerivce, { TaskRecord } from '../services/appwrite.service'

export default function Upload ({ task }: { task: TaskRecord }): JSX.Element {
  const [upFile, setFile] = useState<File>()
  const [uploadFailed, setUploadFailed] = useState<boolean>(false)
  const input: React.MutableRefObject<HTMLInputElement | null> = useRef(null)
  const appwrite = AppwriteSerivce.getInstance()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    console.log('handle file change')
    if (e.target.files != null && e.target.files.length > 0) {
      setFile(e.target.files[0])
      console.log('setting file', upFile, e.target.files[0])
      const uploadSuccess = await appwrite.createAttachment(e.target.files[0], task)
      setUploadFailed(!uploadSuccess)
      setTimeout(() => {
        setUploadFailed(false)
      }, 3000)
    }
  }

  const addFile = (): void => {
    input.current?.click()
  }

  return (<>
        <input className='hidden' type="file" ref={input} onChange={(e: ChangeEvent<HTMLInputElement>) => {
          void (async (): Promise<void> => {
            await handleFileChange(e)
          })()
        }
        } />
        <button className='text-slate-200' onClick={addFile}>
            <HiDocumentAdd></HiDocumentAdd>
        </button>

       { uploadFailed
         ? <div className="toast toast-end toast-bottom w-max z-50">
          <div className="alert alert-error p-3">
            <div>
              <span className='font-semibold text-sm'>Upload Failed, check connection and file!</span>
            </div>
          </div>
        </div>
         : null}
    </>)
}
