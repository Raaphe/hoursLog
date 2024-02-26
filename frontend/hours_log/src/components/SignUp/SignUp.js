import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState(0);

  const createEmployee = async () => {
    try {
      const url = "http://localhost:8000/employees/";
      const resp = await axios.post(url, {
        firstName,
        lastName,
        address,
        phoneNumber,
        email,
        hourlyRate: price,
      });
      await axios.post("http://127.0.0.1:8000/invoices/", {
        employee: resp?.data.id,
      });
      alert("Employee created succesfully")
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
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
          </svg>{" "} Back
        </button>
        <div className="row text-center">
          <h1>Add New Employee</h1>
        </div>
        <br />
        <div className="row">
          <div className="form-group col-md-4">
            <label htmlFor="firstNameInput">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstNameInput"
              placeholder="John"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="lastNameInput">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastNameInput"
              placeholder="Smith"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="phoneNumberInput">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumberInput"
              placeholder="1110001111"
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
            placeholder="1234 Main Street, Ottawa, Ontario, A1B 2C3"
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
              placeholder="john@email.com"
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
              placeholder="16.50"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-success btn-lg w-100"
              onClick={createEmployee}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
