import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Timer from "../views/Timer";
import Shifts from "../views/Shifts";
import sort from "../../hooks/sort";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [forceRefreshCounter, setForceRefreshCounter] = useState(0);
  const [invoiceInfo, setinvoiceInfo] = useState({});
  const [invoicesState, setInvoices] = useState([]);

  const invoiceCurrent = async (employeeId, invoiceId) => {
    setForceRefreshCounter((prev) => prev + 1)
    try {
      if (invoiceInfo.Shifts && invoiceInfo.Shifts.length !== 0) {
        const url = "http://127.0.0.1:8000/invoices/";
        await axios.post(url, { employee: employeeId });
        window.open(
          `http://127.0.0.1:8000/get_invoice_pdf/${invoiceId}`,
          "_blank"
        );
        window.location.reload();
      } else {
        alert("No shifts to be invoiced");
        console.log(invoiceInfo.Shifts)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetInvoices = async () => {
    try {
      if (invoiceInfo.Shifts && invoiceInfo.Shifts.length !== 0) {
        console.log(invoicesState);
        navigate("/invoices", { state: { invoices: invoicesState } });
      } else {
        alert("No shifts to be invoiced");
      }
    } catch (error) {
      console.error("Error:", error);
    }

  }

  useEffect(() => {
    const getinvoiceInfo = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/employee/${userId}/invoices/`
        );
        const invoices = response.data;
        setInvoices(invoices)

        const invoiceInfoPromises = invoices.map((invoice) =>
          axios.get(`http://127.0.0.1:8000/get_invoice_info/${invoice.id}`)
        );
        const invoiceInfoResponses = await Promise.all(invoiceInfoPromises);
        const allInvoiceInfo = invoiceInfoResponses.map((res) => res.data);
        setinvoiceInfo(sort(allInvoiceInfo, "Id", false)[0]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getinvoiceInfo();
  }, [userId, forceRefreshCounter]);

  return (
    <div className="container m-5">
      <button
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
      <br />
      <br />
      <div className="row">
        <div className="col-lg-4">
          <h2>
            Welcome {invoiceInfo?.Employee?.First_Name}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil"
              viewBox="0 0 16 16"
              onMouseEnter={(e) => (e.currentTarget.style.cursor = "pointer")}
              onClick={() =>
                navigate("/employee-editor", {
                  state: { employee: invoiceInfo?.Employee },
                })
              }
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l5-5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
          </h2>
        </div>
        <div className="col-lg-8 text-end">
          <button
            className="btn btn-outline-primary btn-lg m-2"
            onClick={() =>
              handleGetInvoices()
            }
          >
            Invoice List
          </button>
          <button
            className="btn btn-primary btn-lg m-2"
            onClick={() =>
              invoiceCurrent(invoiceInfo?.Employee?.Id, invoiceInfo?.Id)
            }
          >
            Invoice {invoiceInfo?.Id}
          </button>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-lg-5">
          <Timer
            invoiceId={invoiceInfo?.Id}
            hourlyRate={invoiceInfo?.Employee?.Hourly_Rate}
            forceRefreshCallback={setForceRefreshCounter}
          />
        </div>
        <div className="col-lg-7">
          <Shifts
            invoiceId={invoiceInfo?.Id}
            forceRefreshValue={forceRefreshCounter}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
