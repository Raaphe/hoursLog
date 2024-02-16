
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Shifts from "../views/Shifts";


const InvoiceDetails = () => {

    const location = useLocation();
    const invoice_id  = location.invoice_id?.invoice_id

    

    return (

        <>
            {invoice_id && <Shifts invoiceId={invoice_id} forceRefreshValue={0}/>}
        </>

    );
}

export default InvoiceDetails;