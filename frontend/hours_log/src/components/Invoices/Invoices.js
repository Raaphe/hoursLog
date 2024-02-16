import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./invoices.css";


const Invoices = () => {
  const location = useLocation();
  const invoiceList  = location.state?.invoices
  const navigate = useNavigate();

  const handleInvoiceClick = (invoice_id) => {
    navigate("/invoice", { state: { invoice_id: invoice_id } })
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">Previous Invoices</h2>
          <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">Back</button>
          <div className="table-responsive">
            <table className="table table-hover table-dark">
              <tbody>
                {invoiceList && invoiceList.map((invoice) => (
                  <tr key={invoice.id} onClick={(e) => handleInvoiceClick(e.target.value)}>
                    <td>Invoice {invoice.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
