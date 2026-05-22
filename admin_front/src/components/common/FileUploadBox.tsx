import React, { useRef, useState } from 'react'
import { useUploadStore } from '@/stores/upload_store'
import { getUUID } from '@/lib/uuid'
import { Play, Pause } from 'lucide-react'
import { toast } from 'sonner'
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import { Spinner } from '@/components/ui/spinner'

interface FileUploadBoxProps {
  label?: string
  accept?: string  // e.g., "image/*", ".pdf,.doc"
  value?: File | string | null
  onChange?: (file: File) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  imageAlt?: string
}

export function FileUploadBox({
  label = 'File Upload',
  accept,
  value,
  onChange,
  disabled = false,
  placeholder = 'Click to select a file',
  className = '',
  style = {}
}: FileUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onChange) {
      onChange(file)
    }
  }

  const displayText = value
    ? (value instanceof File ? value.name : 'File selected')
    : placeholder

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={handleClick}
        className={`
          px-4 py-3
          bg-[var(--Stone-200)]
          cursor-pointer transition-colors
          flex items-center justify-center
          ${disabled
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
            : 'border-[var(--Stone-300)] hover:border-[var(--Stone-400)]'
          }
        `}
        style={{
          minHeight: '60px',
          width: '100%',
          ...style
        }}
      >
        <div className={`${disabled ? 'text-gray-400' : 'text-[var(--Stone-500)]'} text-center whitespace-pre-line`}>
          {displayText}
        </div>
      </div>

      {value && (
        <p className="mt-2 text-sm text-gray-600">
          Selected file: {value instanceof File ? value.name : value}
        </p>
      )}
    </div>
  )
}

interface ImageUploadBoxProps extends FileUploadBoxProps {
  previewUrl?: string | null
  imageAlt?: string
  onPreview?: (url: string) => void
  onDelete?: () => void
  directory?: string  // Upload directory
  onUploadComplete?: (publicUrl: string) => void  // S3 upload complete callback
  buttonDirection?: 'row' | 'column'  // Layout direction of image and button area (default: column)
  buttonColor?: boolean  // Whether to apply button color (default: false - text color only)
}

export function ImageUploadBox({
  previewUrl,
  imageAlt,
  onPreview,
  onDelete,
  directory = 'uploads',
  onUploadComplete,
  buttonDirection = 'column',
  buttonColor = false,
  ...props
}: ImageUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { postPresignedUrl, confirmUpload } = useUploadStore()
  const [isUploading, setIsUploading] = useState(false)

  const handleImageChange = async (file: File) => {
    // Extract file extension
    const extension = file.name.split('.').pop()
    // Generate UUID filename
    const filename = `${getUUID()}.${extension}`;

    // Request presigned URL and upload to S3
    setIsUploading(true)
    try {
      const presignedData = await postPresignedUrl({
        directory,
        filename
      })

      if (!presignedData) {
        console.error('Failed to receive presigned URL')
        setIsUploading(false)
        return
      }

      // Upload directly to S3
      const uploadResponse = await fetch(presignedData.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (uploadResponse.ok) {
        // Confirm upload with backend after successful S3 upload
        await confirmUpload(Number(presignedData.id))

        // Images always use publicUrl (no albumId handling needed)
        if (onUploadComplete) {
          onUploadComplete(presignedData.publicUrl)
        }
      } else {
        console.error('S3 upload failed:', uploadResponse.status)
      }

      // Call parent onChange (pass file object)
      if (props.onChange) {
        props.onChange(file)
      }

      // Generate preview URL
      if (onPreview) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            onPreview(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('File upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageChange(file)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  const handleReplaceClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={props.className}
      style={{
        display: previewUrl && !props.disabled ? 'flex' : 'block',
        flexDirection: buttonDirection === 'row' ? 'row' : 'column',
        gap: buttonDirection === 'row' ? '10px' : '0'
      }}
    >
      {/* Image area - fixed size */}
      <div style={props.style}>
        {/* Preview image */}
        {previewUrl ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <img
                src={previewUrl}
                alt={imageAlt}
                className="object-cover rounded "
                style={{ width: '100%', height: '100%' }}
              />
            </TooltipTrigger>
            {imageAlt && (
              <TooltipContent>
                <p>{imageAlt}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ) : (
          /* When no image: file selection box */
          <FileUploadBox
            {...props}
            label=""
            accept="image/*"
            onChange={handleImageChange}
          />
        )}
      </div>

      {/* When image exists: hidden input and buttons */}
      {previewUrl && !props.disabled && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div
            style={{
              marginTop: buttonDirection === 'column' ? '10px' : '0',
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <button
              type="button"
              onClick={handleDelete}
              disabled={isUploading}
              className={`px-2 py-2 rounded transition-colors ${
                isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : buttonColor
                  ? 'bg-[var(--Red-600)] text-white hover:bg-[var(--Red-700)]'
                  : 'text-[var(--Red-600)] hover:bg-red-100'
              }`}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleReplaceClick}
              disabled={isUploading}
              className={`px-2 py-2 rounded transition-colors flex items-center gap-2 ${
                isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : buttonColor
                  ? 'bg-[var(--blue)] text-white hover:bg-blue-700'
                  : 'text-[var(--blue)] hover:bg-blue-100'
              }`}
            >
              {isUploading && <Spinner className="size-4" />}
              Upload
            </button>
          </div>
        </>
      )}
      {/* Show spinner when uploading with no image */}
      {!previewUrl && isUploading && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Spinner className="size-4" />
          <span style={{ fontSize: '14px', color: 'var(--Stone-600)' }}>Uploading...</span>
        </div>
      )}
    </div>
  )
}

interface AudioUploadBoxProps {
  audioUrl?: string | null
  onUploadComplete?: (publicUrl: string) => void
  onOriginalUrlCapture?: (originalUrl: string) => void
  onPreview?: (url: string) => void
  onDelete?: () => void
  directory?: string
  disabled?: boolean
  placeholder?: string
  style?: React.CSSProperties
  onChange?: (file: File) => void
}

interface VideoUploadBoxProps {
  previewUrl?: string | null
  onPreview?: (url: string) => void
  onDelete?: () => void
  directory?: string
  onUploadComplete?: (publicUrl: string) => void
  disabled?: boolean
  placeholder?: string
  style?: React.CSSProperties
  className?: string
  buttonDirection?: 'row' | 'column'
  buttonColor?: boolean
}

export function VideoUploadBox({
  previewUrl,
  onPreview,
  onDelete,
  directory = 'videos',
  onUploadComplete,
  disabled = false,
  placeholder = 'Upload\nVideo',
  style = {},
  className = '',
  buttonDirection = 'column',
  buttonColor = false
}: VideoUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { postPresignedUrl, confirmUpload } = useUploadStore()
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  const handleVideoChange = async (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Video files must be 50MB or less.')
      return
    }

    // Extract file extension
    const extension = file.name.split('.').pop()
    const filename = `${getUUID()}.${extension}`

    try {
      const presignedData = await postPresignedUrl({
        directory,
        filename
      })

      if (!presignedData) {
        console.error('Failed to receive presigned URL')
        return
      }

      // Upload directly to S3
      const uploadResponse = await fetch(presignedData.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (uploadResponse.ok) {
        toast.success('Video upload completed.')
        await confirmUpload(Number(presignedData.id))

        if (onUploadComplete) {
          onUploadComplete(presignedData.publicUrl)
        }
      } else {
        console.error('S3 upload failed:', uploadResponse.status)
        toast.error('Video upload failed.')
      }

      // Generate preview URL
      if (onPreview) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            onPreview(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('Video upload error:', error)
      toast.error('Video upload failed.')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleVideoChange(file)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  const handleReplaceClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={className}
      style={{
        display: previewUrl && !disabled ? 'flex' : 'block',
        flexDirection: buttonDirection === 'row' ? 'row' : 'column',
        gap: buttonDirection === 'row' ? '10px' : '0'
      }}
    >
      {/* Video area */}
      <div style={style}>
        {previewUrl ? (
          <video
            src={previewUrl}
            controls
            className="object-cover rounded"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          /* When no video: file selection box */
          <FileUploadBox
            label=""
            accept="video/*"
            onChange={handleVideoChange}
            disabled={disabled}
            placeholder={placeholder}
            style={style}
          />
        )}
      </div>

      {/* When video exists: hidden input and buttons */}
      {previewUrl && !disabled && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div
            style={{
              marginTop: buttonDirection === 'column' ? '10px' : '0',
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
            }}
          >
            <button
              type="button"
              onClick={handleDelete}
              className={`px-2 py-2 rounded transition-colors ${
                buttonColor
                  ? 'bg-[var(--Red-600)] text-white hover:bg-[var(--Red-700)]'
                  : 'text-[var(--Red-600)] hover:bg-red-100'
              }`}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleReplaceClick}
              className={`px-2 py-2 rounded transition-colors ${
                buttonColor
                  ? 'bg-[var(--blue)] text-white hover:bg-blue-700'
                  : 'text-[var(--blue)] hover:bg-blue-100'
              }`}
            >
              Upload
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function AudioUploadBox({
  audioUrl,
  onUploadComplete,
  onOriginalUrlCapture,
  onPreview,
  // onDelete,
  directory = 'audio',
  disabled = false,
  placeholder = 'Upload audio file',
  style = {},
  onChange,
}: AudioUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { postPresignedUrl, confirmUpload } = useUploadStore()

  const handleAudioChange = async (file: File) => {
    // Call onChange callback first (for extracting file info)
    if (onChange) {
      onChange(file)
    }

    const extension = file.name.split('.').pop()
    const filename = `${getUUID()}.${extension}`

    setIsUploading(true)
    try {
      const presignedData = await postPresignedUrl({
        directory,
        filename
      })

      if (!presignedData) {
        console.error('Failed to receive presigned URL')
        setIsUploading(false)
        return
      }

      const uploadResponse = await fetch(presignedData.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (uploadResponse.ok) {
        toast.success('File upload completed.')

        await confirmUpload(Number(presignedData.id))

        if (onPreview) {
          onPreview(presignedData.publicUrl)
        }

        if (onOriginalUrlCapture) {
          onOriginalUrlCapture(presignedData.publicUrl)
        }

        if (onUploadComplete) {
          onUploadComplete(presignedData.publicUrl)
        }
      } else {
        console.error('S3 upload failed:', uploadResponse.status)
        toast.error('File upload failed.')
      }
    } catch (error) {
      console.error('File upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleAudioChange(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // const handleDelete = () => {
  //   if (audioRef.current) {
  //     audioRef.current.pause()
  //     audioRef.current = null
  //     setIsPlaying(false)
  //   }
  //   if (onDelete) {
  //     onDelete()
  //   }
  // }

  const handlePlayPause = () => {
    if (!audioUrl) return

    // If already playing, stop
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsPlaying(false)
      return
    }

    // Play new audio
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.play().catch((error) => {
      console.error('Audio play error:', error)
      setIsPlaying(false)
      audioRef.current = null
      alert('Failed to play audio.')
    })
    setIsPlaying(true)

    // When playback ends
    audio.onended = () => {
      setIsPlaying(false)
      audioRef.current = null
    }

    // Error handling
    audio.onerror = () => {
      setIsPlaying(false)
      audioRef.current = null
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...style }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled || isUploading}
      />

      {audioUrl ? (
        <>
          <button
            onClick={handlePlayPause}
            disabled={isUploading}
            className={`flex items-center gap-1 px-3 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ fontSize: '12px' }}
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Play</span>
              </>
            )}
          </button>
          {!disabled && (
            <>
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className={`px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                  isUploading
                    ? 'opacity-50 cursor-not-allowed text-[var(--blue)]'
                    : 'text-[var(--blue)] hover:bg-blue-100'
                }`}
              >
                {isUploading && <Spinner className="size-4" />}
                Upload
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={disabled || isUploading}
            className={`px-4 py-3 rounded transition-colors flex items-center gap-2 ${
              disabled || isUploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[var(--Stone-200)] text-[var(--Stone-500)] hover:bg-[var(--Stone-300)]'
            }`}
          >
            {isUploading && <Spinner className="size-4" />}
            {isUploading ? 'Uploading...' : placeholder}
          </button>
        </>
      )}
    </div>
  )
}