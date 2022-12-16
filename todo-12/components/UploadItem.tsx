import React, { useEffect, useState } from 'react'
import { HiDocumentText, HiOutlineMinusSm } from 'react-icons/hi'
import AppwriteSerivce from '../services/appwrite.service'

export default function UploadItem ({
  attachment,
  onRemoveAttachment
}: { attachment: string, onRemoveAttachment: (fileId: string) => Promise<void> }): JSX.Element {
  const appwrite = AppwriteSerivce.getInstance()
  const [resolvedName, setResolvedNamed] = useState('')

  const resolveName = async (attachmentId: string): Promise<string> => {
    try {
      const res = await appwrite.getAttachmentById(attachmentId)
      return res.filename
    } catch (error) {
      console.warn(`Name for ${attachment} could not be resolved.`, error)
      return ''
    }
  }

  const openFile = async (): Promise<void> => {
    console.log('open', attachment)
    const url = await appwrite.getAttachmentFileById(attachment)
    window.open(url, '_blank', 'noreferrer')
  }

  useEffect(() => {
    console.log('use effect upload item', attachment)
    const resolve = async (): Promise<void> => {
      const res = await resolveName(attachment)
      console.log('resolved', res)
      setResolvedNamed(res)
    }
    void resolve()
  }, [])

  return <>
        <div className='flex flex-row items-center'>
            <button className='text-slate-100 group' onClick={() => {
              void (async () => await openFile())()
            }}>
                <div className='flex flex-row items-center'>
                    <HiDocumentText className='flex' size={20} />
                    <span className='flex text-xs'>
                        {resolvedName}
                    </span>
                </div>
            </button>
            <button className='mx-1 rounded-xl text-white bg-slate-500' onClick={() => {
              void (async () => await onRemoveAttachment(attachment))()
            }}>
                <HiOutlineMinusSm size={12} />
            </button>
        </div>
    </>
}
