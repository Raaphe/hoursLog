import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useStopwatch } from "react-timer-hook";

const MyStopwatch = () => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "48px" }}>
        <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:
        <span>{formatTime(seconds)}</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button
        onClick={() => {
          reset();
          pause();
        }}
      >
        Reset
      </button>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [invoicesInfo, setInvoicesInfo] = useState([]);

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
      setInvoicesInfo(allInvoiceInfo);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getInvoicesInfo();
  }, [userId]);

  return (
    <div className="container m-5">
      <h1>Welcome {invoicesInfo[0]?.Employee.First_Name}</h1>
      {userId && <p>User ID: {userId}</p>}
      {invoicesInfo.map((info, index) => (
        <div key={index}>
          <h1>{info.Employee?.First_Name}</h1>
        </div>
      ))}
      <MyStopwatch />
    </div>
  );
};

export default Dashboard;
