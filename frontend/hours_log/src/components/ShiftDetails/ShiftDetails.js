import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const ShiftDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shiftId = location.state?.shiftId;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [price, setPrice] = useState(0.0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getShiftInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/shifts/${shiftId}/`
        );

        setStartDate(new Date(response?.data.start));
        setEndDate(new Date(response?.data.end));
        setPrice(response.data.price.toFixed(2) || 0.00);
        setDescription(response.data.description || "");
      } catch (error) {
        console.error("Failed to fetch shift data:", error);
      }
    }; getShiftInfo();
  }, [shiftId]);

  const updateShiftDescription = async () => {
    const patchResponse = await axios.patch(
      `http://127.0.0.1:8000/shifts/${shiftId}/`,
      { 
        start: startDate,
        end: endDate,
        price: price,
        description: description
      }
    );
   alert("Description updated successfully ", patchResponse.data);
  };

  const deleteShift = async () => {
    const deleteResponse = await axios.delete(`http://127.0.0.1:8000/shifts/${shiftId}/`)
    alert("Shift deleted successfully ", deleteResponse.data);
  }

  return (
    <div>
      <form className="m-5">
        <button
          className="btn btn-outline-secondary btn-large"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>
        <div className="row text-center">
          <h1>Edit Shift Details</h1>
        </div>
        <br />
        <div class="row">
          <div class="form-group col-md-4">
            <label>Start Time</label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy [h:mm aa]"
              showTimeInput
              withPortal
            />
          </div>
          <div class="form-group col-md-4">
            <label>End Time</label>
            <br />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy [h:mm aa]"
              showTimeInput
              withPortal
            />
          </div>
          <div class="form-group col-md-4">
            <label>Hourly Rate</label>
            <br />
            <input
              type="number"
              step="0.25"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-6">
            <label>Description</label>
            <textarea
              spellcheck="true"
              className="form-control w-100"
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="col-lg-6 text-center">
            <br /> <br /> <br />
            <button className="btn btn-success btn-lg btn-block" onClick={() => {updateShiftDescription(); navigate("/")}}>
              Save Shift Changes
            </button>
            <br /> <br />
            <button className="btn btn-danger btn-lg btn-block" onClick={() => {deleteShift(); navigate("/")}}>
              Delete Shift
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShiftDetails;
