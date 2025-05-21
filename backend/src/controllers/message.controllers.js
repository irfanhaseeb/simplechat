import User from '../models/user.models.js'

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
