import React, { useState } from "react";
import axios from "axios";
import { useStopwatch } from "react-timer-hook";
import moment from "moment-timezone";

const Timer = ({ invoiceId, hourlyRate, forceRefreshCallback }) => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [hasStarted, setHasStarted] = useState(false);

  const [shiftDescription, setShiftDescription] = useState("");

  const currentDateTime = () => moment().tz("America/New_York").format();
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const postPauseLog = async (shiftId) => {
    const url = "http://localhost:8000/pauseLogs/";
    const data = {
      pause_time: currentDateTime(),
      resume_time: null,
      pauseDuration: null,
      shift: shiftId,
    };
    const response = await axios.post(url, data);
    console.log("Pause logged:", response.data);
  };

  const updateLastBreak = async (invoice) => {
    const lastShift = invoice.Shifts[invoice.Shifts.length - 1];
    const lastBreakId = lastShift.breaks[lastShift.breaks.length - 1]?.id;

    if (lastBreakId) {
      const patchResponse = await axios.patch(
        `http://localhost:8000/pauseLogs/${lastBreakId}/`,
        { resume_time: currentDateTime() }
      );
      console.log("Break updated successfully:", patchResponse.data);
    } else {
      console.log("No break ID found to update");
    }
  };

  const getLastShiftId = async (invoiceId) => {
    const response = await axios.get(
      `http://127.0.0.1:8000/get_invoice_info/${invoiceId}`
    );
    const invoice = response.data;
    return invoice.Shifts[invoice.Shifts.length - 1]?.id;
  };

  const updateShiftEndTime = async (shiftId) => {
    const patchResponse = await axios.patch(
      `http://127.0.0.1:8000/shifts/${shiftId}/`,
      { end: currentDateTime() }
    );
    console.log("Shift updated successfully:", patchResponse.data);
  };

  const updateShiftDescription = async (shiftId) => {
    const patchResponse = await axios.patch(
      `http://127.0.0.1:8000/shifts/${shiftId}/`,
      { description: shiftDescription }
    );
    console.log("Description updated successfully:", patchResponse.data);
  };

  const handleClockIn = async () => {
    setHasStarted(true);
    reset();
    start();

    const url = "http://127.0.0.1:8000/shifts/";
    const data = {
      start: currentDateTime(),
      end: null,
      hours: null,
      price: hourlyRate,
      total: null,
      description: "n/a",
      invoice: invoiceId,
    };

    try {
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePauseResume = async () => {
    let shiftId = null,
      invoice = null;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/get_invoice_info/${invoiceId}`
      );
      invoice = response.data;
      shiftId = invoice.Shifts[invoice.Shifts.length - 1]?.id;
    } catch (error) {
      console.error("Error fetching invoice info:", error);
      return;
    }

    try {
      if (isRunning) {
        pause();
        await postPauseLog(shiftId);
      } else {
        start();
        await updateLastBreak(invoice);
      }
    } catch (error) {
      console.error("Error in pause/resume operation:", error);
    }
  };

  const handleClockOut = async () => {
    if (shiftDescription.length > 4) {
      forceRefreshCallback((prevValue) => prevValue + 1);
      reset();
      pause();
      setHasStarted(false);

      try {
        const shiftId = await getLastShiftId(invoiceId);
        if (shiftId) {
          await updateShiftEndTime(shiftId);
          await updateShiftDescription(shiftId);
        } else {
          console.log("No shift ID found to update");
        }
      } catch (error) {
        console.error("Error in clock-out process:", error);
      }
    } else {
      alert(
        "Please enter at least 4 caracters in the description box to clock out of a shit."
      );
    }

    setShiftDescription("");
  };

  return (
    <div>
      <div>
        <div>
          <h3>
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
          </h3>
        </div>
        <div className="row">
          <div className="col-2 text-center">
            {!isRunning && !hasStarted ? (
              <button className="btn btn-success" onClick={handleClockIn}>
                Start
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleClockOut}>
                End
              </button>
            )}
            <br /> <br />
          </div>
          <div className="col-2">
            <button
              className="btn btn-outline-secondary"
              onClick={handlePauseResume}
              disabled={!hasStarted}
            >
              {isRunning ? "Pause" : "Resume"}
            </button>
          </div>
          {hasStarted ? (
            <textarea
              spellcheck="true"
              className="form-control w-75"
              rows="10"
              placeholder="Enter a description of the work completed during the shift"
              onChange={(event) => setShiftDescription(event.target.value)}
              value={shiftDescription}
            />
          ) : (
            <textarea
              disabled
              className="form-control w-75"
              rows="10"
              placeholder="Please start a shift to be able to enter a description"
              onChange={(event) => setShiftDescription(event.target.value)}
              value={shiftDescription}
            />
          )}
        </div>
        <br />
      </div>
    </div>
  );
};

export default Timer;
