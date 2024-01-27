import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Editor = () => {
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

        setStartDate(new Date(response.data.start));
        setEndDate(new Date(response.data.end));
        setPrice(response.data.price);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Failed to fetch shift data:", error);
      }
    };

    if (shiftId) {
      getShiftInfo();
    }
  }, [shiftId]);

  return (
    <div>
      {console.log(description)}
      <form className="m-5">
        <button
          className="btn btn-outline-secondary btn-large"
          onClick={() => navigate("/")}
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
          <h1>Edit shift details</h1>
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
              min="1"
              step="0.25"
              placeholder={price.toFixed(2)}
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
              placeholder={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="col-6 text-center">
            <br /> <br /> <br />
            <button className="btn btn-success btn-lg btn-block">
              Save Shift Changes
            </button>
            <br /> <br />
            <button className="btn btn-danger btn-lg btn-block">
              Delete Shift
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor;
