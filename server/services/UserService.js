const User = require("../models/User.model");
const validateUserInput = require("../helpers/validateInput");

const createUser = async (userData) => {

    const { isValid, message } = validateUserInput(userData);
    if (!isValid) throw new Error(message);
  
    // Step 2: Check if the email already exists in the database
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      // If the email exists, throw an error
      throw new Error('Email is already in use. Please choose a different email.');
    }
  
    // Step 3: Create a new user if validation and email check pass
    const user = new User(userData);
    return await user.save();
  };
  

const updateUser = async (id, userData) => {
  const { isValid, message } = validateUserInput(userData);
  if (!isValid) throw new Error(message);

  const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const getUsers = async (query) => {
    try {

        
      
      const { order = 1, page = 1, limit = 5, searchKey } = query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      let searchQuery = {};
      
      if (searchKey && typeof searchKey === 'string' && searchKey.trim() !== '') {
        searchQuery = {
          $or: [
            { name: { $regex: searchKey, $options: "i" } }, 
            { email: { $regex: searchKey, $options: "i" } }, 
          ],
        };
      }
  
      
      const users = await User.find(searchQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ _id: order }); 
  
      const totalCount = await User.countDocuments(searchQuery);
  
      return {
        users,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Error fetching users");
    }
  };
  

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
};
