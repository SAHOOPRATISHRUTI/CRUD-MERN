import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { createUser } from "../utils/api";
import { validateForm } from "../utils/validation";
import { toast } from "react-toastify";

function AddUserModal({ show, handleClose, fetchUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  const handleCreate = async (e) => {
    e.preventDefault();
    const newErrors = validateForm({ name, email, age });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const newUser = { name, email, age };
    try {
      const response = await createUser(newUser);
      if (response.success) {
        toast.success(response.message);
        fetchUsers(); // Refetch users after adding a new one
        handleClose();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error("Error creating user!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreate}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label>Age</label>
            <input
              type="number"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {errors.age && <div className="text-danger">{errors.age}</div>}
          </div>
          <Button variant="primary" type="submit">
            Create User
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddUserModal;
