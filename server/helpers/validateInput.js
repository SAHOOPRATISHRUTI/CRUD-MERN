function validateUserInput(userData) {
    const { name, email, age } = userData; 

    
    if (!name || !email || !age) {
        return { isValid: false, message: 'All fields are required' }; 
    }
    
    return { isValid: true }; 
}

module.exports = validateUserInput;
