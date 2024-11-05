import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "./User.css"; 
import { getUsers, deleteUser, createUser, updateUser } from '../utils/api'; 

function User() {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      const result = await getUsers();
      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        console.log("Unexpected data structure", result);
      }
    };

    loadUsers();
  }, []);

  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    resetForm();
  };

  const handleShowUpdateModal = (user) => {
    setUserToUpdate(user); 
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setShowUpdateModal(true); 
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUserToUpdate(null);
    resetForm();
  };

  const handleShowDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
        setUsers(users.filter(user => user._id !== userToDelete));
        toast.success("User deleted successfully!");
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user!");
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters (A-Z, a-z).";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }

    if (!age) {
      newErrors.age = "Age is required.";
    } else if (isNaN(age) || age < 0) {
      newErrors.age = "Age must be a positive number.";
    }
    return newErrors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    const newUser = { name, email, age };

    try {
      const result = await createUser(newUser);
      if (result.success) {
        setUsers([...users, result.data]); 
        toast.success("User created successfully!");
        handleCloseAddUserModal();
      } else {
        toast.error("Error creating user!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    const updatedUser = { name, email, age };

    try {
      const result = await updateUser(userToUpdate._id, updatedUser);
      if (result.success) {
        setUsers(users.map(user => (user._id === userToUpdate._id ? result.data : user)));
        toast.success("User updated successfully!");
        handleCloseUpdateModal();
      } else {
        toast.error("Error updating user!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user!");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setErrors({});
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-75 bg-white rounded shadow p-4">
        <h2 className="text-center mb-4">User Management</h2>
        <Button variant="success" className="mb-3" onClick={handleShowAddUserModal}>
          Add User +
        </Button>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleShowUpdateModal(user)}>
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={() => handleShowDeleteModal(user._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal show={showAddUserModal} onHide={handleCloseAddUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreate}>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
                }}
                required
              />
              {/* {errors.name && <div className="text-danger">{errors.name}</div>} */}
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
                }}
                required
              />
              {/* {errors.email && <div className="text-danger">{errors.email}</div>} */}
            </div>

            <div className="mb-3">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                placeholder="Enter Age"
                className="form-control"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, age: "" }));
                }}
                required
              />
              {/* {errors.age && <div className="text-danger">{errors.age}</div>} */}
            </div>

            <Button variant="primary" type="submit">
              Create User
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Update User Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
                }}
                required
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
                }}
                required
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                placeholder="Enter Age"
                className="form-control"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, age: "" }));
                }}
                required
              />
              {errors.age && <div className="text-danger">{errors.age}</div>}
            </div>

            <Button variant="primary" type="submit">
              Update User
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User;
