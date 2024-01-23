import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useStopwatch } from 'react-timer-hook';
import moment from 'moment-timezone';

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

const Timer = ({ invoiceId }) => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });
  const [hasStarted, setHasStarted] = useState(false);

  const currentDateTime = () => {
    return moment().tz("America/New_York").format();
  }

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleClockIn = async () => {
    setHasStarted(true);
    reset();
    start();

    const url = 'http://127.0.0.1:8000/shifts/'; // Replace with your actual endpoint URL
    const data = {
      start: currentDateTime(),
      end: null,
      hours: null,
      price: 30,
      total: null,
      description: "n/a",
      invoice: invoiceId
    };

    try {
      const response = await axios.post(url, data);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePauseResume = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleClockOut = async () => {
    reset();
    pause();
    setHasStarted(false);
  
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get_invoice_info/${invoiceId}`);
      const invoice = response.data;
  
      const lastShiftIndex = invoice.Shifts.length - 1;
      const shiftId = invoice.Shifts[lastShiftIndex]?.id;
  
      if (shiftId) {
        const patchResponse = await axios.patch(`http://127.0.0.1:8000/shifts/${shiftId}/`, { end: currentDateTime() });
        console.log('Shift updated successfully:', patchResponse.data);
      } else {
        console.log('No shift ID found to update');
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-2 text-center">
          {!isRunning && !hasStarted ? (
            <button className="btn btn-success btn-lg" onClick={handleClockIn}>
              Clock in
            </button>
          ) : (
            <button className="btn btn-danger btn-lg" onClick={handleClockOut}>
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
        <div className="col-2">
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </div>
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
      <h1>Welcome {invoicesInfo[0]?.Employee.First_Name}</h1>
      <br />
      <Timer invoiceId={invoicesInfo[0]?.Id}/>
    </div>
  );
};

export default Dashboard;
