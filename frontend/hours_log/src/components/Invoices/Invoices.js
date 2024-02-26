import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Invoices = () => {
  const location = useLocation();
  const invoiceList = location.state?.invoices;
  const navigate = useNavigate();

  const handleInvoiceClick = (invoice_id) => {
    //navigate("/invoice", { state: { invoice_id: invoice_id } });
    window.open(
      `http://127.0.0.1:8000/get_invoice_pdf/${invoice_id}`,
      "_blank"
    );
    window.location.reload();
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary btn-large"
            onClick={() => navigate(-1)}
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
            </svg> Back
          </button>
          <h2 className="text-center mb-4">Previous Invoices</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="text-center">
                <tr>
                  <th scope="col">
                    <h4>Invoice ID</h4>
                  </th>
                  <th scope="col">
                    <h4>Start Date</h4>
                  </th>
                  <th scope="col">
                    <h4>End Date</h4>
                  </th>
                  <th scope="col">
                    <h4>Download</h4>
                  </th>
                  <th scope="col">
                    <h4>Edit</h4>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceList &&
                  invoiceList.map((invoice) => (
                    <tr
                      className="text-center"
                      key={invoice.id}
                    >
                      <td>Invoice {invoice.id}</td>
                      <td>{invoice.start}</td>
                      <td>{invoice.end}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-success btn-small"
                          onClick={(e) => handleInvoiceClick(invoice.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-download"
                            viewBox="0 0 16 16"
                          >
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                          </svg>
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-small"
                          onClick={() =>
                            navigate("/invoice", {
                              state: { invoiceId: invoice.id },
                            })
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pen"
                            viewBox="0 0 16 16"
                          >
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                          </svg>
                        </button>
                      </td>
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
