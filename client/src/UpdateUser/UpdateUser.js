import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getUsers, updateUser } from '../utils/api'; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./UpdateUser.css";

function UpdateUser() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUsers();
        const user = result.find(user => user._id === id); 
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setAge(user.age);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [id]);

  const validate = () => {
    if (!name) {
      toast.error("Name is required.");
      return false;
    }
    if (!email) {
      toast.error("Email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email address is invalid.");
      return false;
    }
    if (!age) {
      toast.error("Age is required.");
      return false;
    } else if (isNaN(age) || age < 0) {
      toast.error("Age must be a positive number.");
      return false;
    }
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      return; 
    }

    const updatedUser = { name, email, age };

    try {
      await updateUser(id, updatedUser); 
      toast.success("User updated successfully!");
      setShowModal(false);
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user!");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-50 bg-white rounded shadow p-5">
        <form onSubmit={handleUpdate}>
          <h2 className="text-center mb-4">Update User</h2>
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              placeholder="Enter Age"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            onClick={() => setShowModal(true)}
          >
            Update User
          </button>
        </form>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateUser;