// import React, { useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";
// import "./CreateUser.css";
// import { createUser } from "../utils/api";

// function CreateUser() {
//   const [showModal, setShowModal] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [age, setAge] = useState("");
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!name) {
//       newErrors.name = "Name is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(name)) {
//       newErrors.name = "Name can only contain letters (A-Z, a-z).";
//     }

//     if (!email) {
//       newErrors.email = "Email is required.";
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = "Email address is invalid.";
//     }

//     if (!age) {
//       newErrors.age = "Age is required.";
//     } else if (isNaN(age) || age < 0) {
//       newErrors.age = "Age must be a positive number.";
//     }
//     return newErrors;
//   };

//   const handleAddUserClick = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     const newErrors = validate();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);

//       Object.values(newErrors).forEach((error) => {
//         toast.error(error);
//       });
//       return;
//     }

//     const newUser = { name, email, age };

//     try {
//       await createUser(newUser);
//       toast.success("User created successfully!");
//       setShowModal(false);

//       setName("");
//       setEmail("");
//       setAge("");
//     } catch (error) {
//       console.error("Error creating user:", error);
//       toast.error("Error creating user!");
//     }
//   };

//   return (
//     <div className="d-flex vh-100 justify-content-center align-items-center">
//       <Button variant="primary" onClick={handleAddUserClick}>
//         Add User
//       </Button>

//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Body>
//           <form onSubmit={handleCreate}>
//             <div className="mb-3">
//               <label htmlFor="name">Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Name"
//                 className="form-control"
//                 value={name}
//                 onChange={(e) => {
//                   setName(e.target.value);
//                   setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
//                 }}
//                 required
//               />
//               {/* {errors.name && <div className="text-danger">{errors.name}</div>} */}
//             </div>

//             <div className="mb-3">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 placeholder="Enter Email"
//                 className="form-control"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
//                 }}
//                 required
//               />
//               {/* {errors.email && <div className="text-danger">{errors.email}</div>} */}
//             </div>

//             <div className="mb-3">
//               <label htmlFor="age">Age</label>
//               <input
//                 type="text"
//                 placeholder="Enter Age"
//                 className="form-control"
//                 value={age}
//                 onChange={(e) => {
//                   setAge(e.target.value);
//                   setErrors((prevErrors) => ({ ...prevErrors, age: "" }));
//                 }}
//                 required
//               />
//               {/* {errors.age && <div className="text-danger">{errors.age}</div>} */}
//             </div>

//             <Button variant="primary" type="submit">
//               Create User
//             </Button>
//           </form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default CreateUser;
