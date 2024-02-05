import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  const [firstName, setFirstName] = useState(employee?.First_Name || '');
  const [lastName, setLastName] = useState(employee?.Last_Name || '');
  const [phoneNumber, setNumber] = useState(employee?.Phone_Number.match(/\d+/g)?.join('') || '');
  const [address, setAddress] = useState(employee?.Address || '');
  const [email, setEmail] = useState(employee?.Email || '');
  const [price, setPrice] = useState(employee?.Hourly_Rate || '');

  const updateEmployeeDescription = async (e) => {
    try {
      const patchResponse = await axios.patch(
        `http://127.0.0.1:8000/employees/${employee.Id}/`,
        {
          firstName,
          lastName,
          address,
          phoneNumber,
          email,
          hourlyRate: parseFloat(price),
        }
      );
      alert("Description updated successfully ", patchResponse);
      navigate("/");
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const deleteEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`http://127.0.0.1:8000/employees/${employee.Id}/`);
      alert("Employee deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  return (
    <div className="container m-5">
      <div className="m-5">
        <button
          type="button"
          className="btn btn-outline-secondary btn-large"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg> Back
        </button>
        <div className="row text-center">
          <h1>Edit Employee Details</h1>
        </div>
        <br />
        <div className="row">
          <div className="form-group col-md-4">
            <label htmlFor="firstNameInput">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstNameInput"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="lastNameInput">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastNameInput"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="phoneNumberInput">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumberInput"
              value={phoneNumber}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="addressInput">Address</label>
          <input
            type="text"
            className="form-control"
            id="addressInput"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <br />
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="emailInput">Email</label>
            <input
             type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="priceInput">Hourly Rate ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="priceInput"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-6">
            <button
              type="button"
              className="btn btn-success btn-lg w-100"
              onClick={updateEmployeeDescription}
            >
              Save Changes
            </button>
          </div>
          <div className="col-lg-6">
            <button
              type="button"
              className="btn btn-danger btn-lg w-100"
              onClick={deleteEmployee}
            >
              Delete Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditor;
