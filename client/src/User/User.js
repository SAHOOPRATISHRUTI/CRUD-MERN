import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./User.css";
import { deleteUser, createUser, updateUser } from "../utils/api";
import axios from "axios";

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

  const [loading, setLoading] = useState(true);

  const [searchKey, setSearchKey] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 5,
    limit: 4,
  });

  const API_URL = "http://localhost:4002/api/users";

  // FETCH USERS FROM API
  const getUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(API_URL, {
        params: {
          searchKey: searchKey,
          page: pagination.currentPage,
          limit: pagination.limit,
        },
      });

      const fetchedUsers = Array.isArray(response.data.data.users)
        ? response.data.data.users
        : [];
      setUsers(fetchedUsers);

      setPagination((prevPagination) => ({
        ...prevPagination,
        totalPages: response.data.data.totalPages,
      }));
      console.log(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setAge("");
    setErrors({}); // Optional: Clear any validation errors
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page when search changes
  };

  // Handle pagination change
  const handlePaginationChange = (direction) => {
    const newPage =
      direction === "next"
        ? pagination.currentPage + 1
        : pagination.currentPage - 1;

    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  // Fetch users whenever searchKey or pagination changes
  useEffect(() => {
    getUsers();
  }, [searchKey, pagination.currentPage]);

  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    resetForm();
  };

  // FOR SHOW UPDATE MODAL
  const handleShowUpdateModal = (user) => {
    setUserToUpdate(user);
    setName(user.name); //TO SET PREV DATA IN THE INPUT BOX
    setEmail(user.email);
    setAge(user.age);
    setShowUpdateModal(true);
  };
// FOR CLOSE UPDATE MODAL
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUserToUpdate(null);
    resetForm();
  };
// FOR SHOW DELETE MODAL
  const handleShowDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };
// FOR CLOSE DELETE MODAL
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

// FOR CONFIRM DELETE MODAL
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
        setUsers(users.filter((user) => user._id !== userToDelete));
        toast.success("User deleted successfully!");
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user!");
      }
    }
  };
//  FORM VALIDATION
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

  //CREATE USER
  const handleCreate = async (e) => {
    e.preventDefault();

    const newErrors = validate(); //VALIDATE FORM

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
      console.log(response);

      if (response.success) {
        toast.success(response.message);
        console.log("ggg", response.message);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("hyy", error.response.data.message);
    }
    handleCloseAddUserModal();
  };

 //UPDATE USER
  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const updatedUser = { name, email, age };

    try {
      const result = await updateUser(userToUpdate._id, updatedUser);
      if (result.success) {
        setUsers(
          users.map((user) =>
            user._id === userToUpdate._id ? result.data : user
          )
        );
        toast.success(result.message);
        handleCloseUpdateModal();
      } else {
        toast.error("Error updating user!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user!");
    }
  };

//RESET FORM
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

        {/* SEARCH CONTAINER */}
        <div className="search-container ">
          <input
            type="text"
            className="form-control search-box"
            placeholder="Search users by name or email"
            value={searchKey}
            onChange={handleSearchChange}
          />
        </div>

        {/* SHOWING WHICH PAGES  */}
        {users.length > 0 && (
          <span className="pagination-info">
            Showing Page {pagination.currentPage} of {pagination.totalPages}{" "}
            entities.
          </span>
        )}

        <Button
          variant="success"
          className="mb-2"
          onClick={handleShowAddUserModal}
        >
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
                    <button
                      className="btn btn-warning"
                      onClick={() => handleShowUpdateModal(user)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleShowDeleteModal(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination-container">
          <button
            className="pagination-btn prev-btn"
            onClick={() => handlePaginationChange("prev")}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>

          <button
            className="pagination-btn next-btn"
            onClick={() => handlePaginationChange("next")}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
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
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
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
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
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

            <div className="d-flex justify-content-between">
              <Button variant="secondary" type="button" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="primary" type="submit">
                Update User
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
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
