import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Timer from "./DashboardTimer";
import Shifts from "./DashboardShifts";

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

const Dashboard = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [forceRefreshCounter, setForceRefreshCounter] = useState(0);

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
      <div className="row">
        <div className="col-4">
          <h2>
            Welcome {invoicesInfo[0]?.Employee.First_Name}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil"
              viewBox="0 0 16 16"
              onMouseEnter={(e) => (e.currentTarget.style.cursor = "pointer")}
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
            </svg>
          </h2>
        </div>

        <div className="col-8 text-end">
          <button className="btn btn-outline-primary btn-lg">
            Invoice {invoicesInfo[invoicesInfo.length - 1]?.Id}
          </button>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-5">
          <Timer
            invoiceId={invoicesInfo[invoicesInfo.length - 1]?.Id}
            hourlyRate={
              invoicesInfo[invoicesInfo.length - 1]?.Employee.Hourly_Rate
            }
            forceRefreshCallback={setForceRefreshCounter}
          />
        </div>
        <div className="col-7">
          <Shifts
            invoiceId={invoicesInfo[invoicesInfo.length - 1]?.Id}
            forceRefreshValue={forceRefreshCounter}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
