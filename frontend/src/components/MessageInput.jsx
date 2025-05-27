import { useRef, useState } from 'react'
import { Image, LoaderCircle, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { useChatStore } from '../store/useChatStore'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  // he useRef hook in React is used to create a mutable object,
  // known as a ref, that persists across component renders without causing re-renders
  // when its value changes
  const fileInputRef = useRef(null)
  const { sendMessage, isMessageSending } = useChatStore()

  const removeImage = () => {
    setImagePreview(null)

    // If theres some image in the fileInputRef, remove it
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) {
      return
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })

      // Clear form
      setText('')
      removeImage()
    } catch (error) {
      toast.error('An error has occurred')
      console.error('failed to send message', error)
    }
  }

  return (
    <div className="p-4 w-full">
      {/* If there is a selected image, show it */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Image Preview" className="size-20 object-cover rounded-lg border border-zinc-700" />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              disabled={isMessageSending}
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            // Manually trigger a click on the above input
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-square btn-outline"
          disabled={(!text.trim() && !imagePreview) || isMessageSending}
        >
          {isMessageSending && <LoaderCircle size={20} className="animate-spin" />}
          {!isMessageSending && <Send size={20} />}
        </button>
      </form>
    </div>
  )
}

export default MessageInput
