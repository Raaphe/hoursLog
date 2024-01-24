import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useStopwatch } from "react-timer-hook";
import moment from "moment-timezone";

const sortItems = (items, attribute, ascending = true) => {
  return [...items].sort((a, b) => {
    if (a[attribute] < b[attribute]) {
      return ascending ? -1 : 1;
    }
    if (a[attribute] > b[attribute]) {
      return ascending ? 1 : -1;
    }
    return 0;
  });
};

const Timer = ({ invoiceId, hourlyRate }) => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [hasStarted, setHasStarted] = useState(false);

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
    reset();
    pause();
    setHasStarted(false);

    try {
      const shiftId = await getLastShiftId(invoiceId);
      if (shiftId) {
        await updateShiftEndTime(shiftId);
      } else {
        console.log("No shift ID found to update");
      }
    } catch (error) {
      console.error("Error in clock-out process:", error);
    }
  };

  return (
    <div>
      <div>
        <div className="col-2 text-center m-5">
          <h1>
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
          </h1>
        </div>
        <div className="row">
          <div className="col-2 text-center">
            {!isRunning && !hasStarted ? (
              <button
                className="btn btn-success btn-lg"
                onClick={handleClockIn}
              >
                Clock in
              </button>
            ) : (
              <button
                className="btn btn-danger btn-lg"
                onClick={handleClockOut}
              >
                Clock Out
              </button>
            )}
          </div>
          <div className="col-2">
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={handlePauseResume}
              disabled={!hasStarted}
            >
              {isRunning ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [invoicesInfo, setInvoicesInfo] = useState([]);

  useEffect(() => {
    const getInvoicesInfo = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/employee/${userId}/invoices/`
        );
        const invoices = response.data;

        const invoiceInfoPromises = invoices.map((invoice) =>
          axios.get(`http://127.0.0.1:8000/get_invoice_info/${invoice.id}`)
        );
        const invoiceInfoResponses = await Promise.all(invoiceInfoPromises);
        const allInvoiceInfo = invoiceInfoResponses.map((res) => res.data);
        setInvoicesInfo(sortItems(allInvoiceInfo, "Id", true));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getInvoicesInfo();
  }, [userId]);

  return (
    <div className="container m-5">
      <div className="col-4">
        <h1>Welcome {invoicesInfo[0]?.Employee.First_Name}</h1>
      </div>
      <Timer invoiceId={invoicesInfo[invoicesInfo.length - 1]?.Id} hourlyRate={invoicesInfo[invoicesInfo.length - 1]?.Employee.Hourly_Rate} />
    </div>
  );
};

export default Dashboard;
