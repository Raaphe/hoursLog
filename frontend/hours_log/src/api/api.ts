import axios from "axios";


class Api {


    public getInvoices(employee_id: number) {

        return axios.get(`http://localhost:8000/get_invoice_list/${employee_id}`)

    } 

}

const api = new Api();
export default api;