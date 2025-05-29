import Message from '../models/message.models.js'
import User from '../models/user.models.js'
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from '../lib/socket.js'

// Get a list of all users except the one that is currently logged in
export const getUsersForSidebar = async (req, res) => {
  try {
    // User is from the middleware, since this route is protected
    const loggedInUserId = req.user._id

    // Get all the users except for the user which made this request
    // Remember to not expose the password
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')

    return res.status(200).json(filteredUsers)
  } catch (error) {
    console.error('Error in get users controller: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Get a list of messages between 2 users
export const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id
    const currentUserId = req.user._id

    // Get all messages between these 2 users, regardless of who sent the messages
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUserId },
      ],
    })
    return res.status(200).json(messages)
  } catch (error) {
    console.error('Error in get messages controller: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body

    const senderId = req.user._id
    const receiverId = req.params.id

    // If the user passed in an image, upload to cloudinary and get its url
    let imageUrl
    if (image) {
      // upload base64-encoded image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Could be undefined if the user didn't pass in an image
    })

    await newMessage.save()

    const receiverSocketId = getReceiverSocketId(receiverId)

    // If user is online, send the message to them in realtime
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    // 201 resource created
    return res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error in send controller: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
