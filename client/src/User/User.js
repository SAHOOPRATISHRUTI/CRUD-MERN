// User.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "./User.css"; 
import { getUsers, deleteUser } from '../utils/api'; 

function User() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const handleShowModal = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
        setUsers(users.filter(user => user._id !== userToDelete));
        toast.success("User deleted successfully!");
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user!");
      }
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-75 bg-white rounded shadow p-4">
        <h2 className="text-center mb-4">User Management</h2>
        <Link to="/create" className="btn btn-success mb-3">Add User +</Link>
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
                    <Link to={`/update/${user._id}`} className="btn btn-warning me-2">Update</Link>
                    <button className="btn btn-danger" onClick={() => handleShowModal(user._id)}>Delete</button>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default User;
