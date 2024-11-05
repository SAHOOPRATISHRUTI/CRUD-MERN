const User =require('../models/User.model')
const validateUserInput = require('../helpers/validateInput')

const createUser = async(userData)=>{
    const {isValid,message}=validateUserInput(userData);
    if(!isValid) throw new Error (message);

    const user = new User(userData);
    return await user.save();
}

const updateUser = async (id, userData) => {
    const { isValid, message } = validateUserInput(userData);
    if (!isValid) throw new Error(message); 

    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!updatedUser) {
        throw new Error('User not found'); 
    }

    return updatedUser; 
};

const deleteUser = async(id)=>{
    return await User.findByIdAndDelete(id)
}

const getAllUsers = async()=>{
    return await User.find()
}

module.exports={
    createUser,
    updateUser,
    deleteUser,
    getAllUsers
}