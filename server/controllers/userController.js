const userService = require('../services/UserService');
const Response = require('../helpers/response')
const messages = require('../constants/message')
const validateUserData= require('../helpers/validateInput')

const createUser = async (req, res) => {
    try {
        const userData = req.body;

  
        const { isValid, message } = validateUserData(userData);
        if (!isValid) {
            
            return Response.failResponse(req, res, message, messages.validationError, 400);
        }

       
        const user = await userService.createUser(userData);
        return Response.successResponse(req, res, user, messages.userCreated, 201);
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, {
            message: messages.internalServerError,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return Response.successResponse(req, res, users, messages.retrivedata, 200);
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, {
            message: messages.internalServerError,
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;


        const { isValid, message } = validateUserData(updatedData);
        if (!isValid) {
            return Response.failResponse(req, res, { isValid, message }, messages.validationError, 400);
        }


        const updatedUser = await userService.updateUser(id, updatedData);
        if (!updatedUser) {
            return Response.failResponse(req, res, null, messages.userNotFound, 404);
        }

    
        return Response.successResponse(req, res, updatedUser, messages.userUpdated);
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, {
            message: error.message || messages.internalServerError, 
        });
    }
};




const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        
        const user = await userService.deleteUser(id);
        if (!user) {
            return Response.failResponse(req, res, null, messages.userNotFound, 404);
        }

        return Response.successResponse(req, res, null, messages.userDeleted);
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, {
            message: error.message || messages.internalServerError, 
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
}