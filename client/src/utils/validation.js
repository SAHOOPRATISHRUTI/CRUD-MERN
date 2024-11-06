const validate = (name, email, age) => {
    const newErrors = {};  // Store any validation errors
  
    // Trim input values to remove any leading/trailing spaces
    name = name.trim();
    email = email.trim();
  
    // Name validation
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters (A-Z, a-z).";
    }
  
    // Email validation
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }
  
    // Age validation
    if (!age) {
      newErrors.age = "Age is required.";
    } else if (isNaN(age) || age < 0) {
      newErrors.age = "Age must be a positive number.";
    }
  
    return newErrors;  // Return errors, or an empty object if no errors
  };
  