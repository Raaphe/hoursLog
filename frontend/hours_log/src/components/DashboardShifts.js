import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Shifts = ({ invoiceId, forceRefreshValue }) => {
  const [shifts, setShifts] = useState([{}]);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const getShiftsInfo = async () => {
        if (!invoiceId) return;

        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/get_invoice_info/${invoiceId}`
          );
          const invoice = response.data;
          const tempShifts = invoice.Shifts;
          setShifts(tempShifts);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };

      getShiftsInfo();
    }, 100);

    return () => clearTimeout(timer);
  }, [invoiceId, forceRefreshValue]);

  return (
    <table class="col-7 table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">
            <h4>Start</h4>
          </th>
          <th scope="col">
            <h4>Time</h4>
          </th>
          <th scope="col">
            <h4>Profit</h4>
          </th>
          <th scope="col">
            <h4>End</h4>
          </th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((shift) => (
          <tr
            key={shift.id}
            onClick={() =>
              navigate("/shift-editor", { state: { shiftId: shift.id } })
            }
            onMouseEnter={(e) => (e.currentTarget.style.cursor = "pointer")}
          >
            <th scope="row">{shift.start}</th>
            <td>{parseFloat(shift.hours).toFixed(2)} hours</td>
            <td>$ {parseFloat(shift.total).toFixed(2)}</td>
            <td>{shift.end}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Shifts;
