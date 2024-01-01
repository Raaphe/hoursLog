from xhtml2pdf import pisa
from io import BytesIO
from datetime import *

def convertInvoiceInfoToJson(invoice):
    shifts = invoice.shifts.values(
        "date", "hours", "price", "total", "description"
    )
    
    number = str(invoice.employee.phoneNumber)
    formatted_number = f"({number[:3]}) - {number[3:6]} - {number[6:]}"
    
    return {
        "Id": invoice.id,
        "Invoice_Date": invoice.date,
         "Employee": {
             "First_Name": invoice.employee.firstName,
             "Last_Name": invoice.employee.lastName,
             "Adress": invoice.employee.address,
             "Phone_Number": formatted_number,
             "Email": invoice.employee.email
         },
         "Shifts": list(shifts)
    }


def generatePdf(invoice):
    invoiceData = convertInvoiceInfoToJson(invoice)
    
    html_content = f"""
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Invoice</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 12px; color: #555; background: #f9f9f9; margin: 0; padding: 0;">
                <div style="max-width: 800px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
                <div style="text-align: center; padding-bottom: 20px; margin-bottom: 20px;">
                    <h2 style="font-size: 24px; color: #333;">Invoice</h2>
                </div>
                <table style="width: 100%; font-size: 14px; color: #555;">
                    <tr>
                    <td style="text-align: left; padding: 5px;">
                        <strong>From:</strong>
                        <br>
                        {(invoiceData["Employee"]["First_Name"]) + " " + (invoiceData["Employee"]["Last_Name"])}
                        <br>
                        {invoiceData["Employee"]["Adress"]}
                        <br>
                        {invoiceData["Employee"]["Phone_Number"]}
                        <br>
                        {invoiceData["Employee"]["Email"]}
                    </td>
                    <td style="text-align: right; padding: 5px;">
                        <strong>Start Date:</strong> {invoiceData["Shifts"][0]['date']}
                        <br>
                        <strong>End Date:</strong> {invoiceData["Shifts"][-1]['date']}
                        <br>
                        <strong>Invoice #:</strong> {invoiceData["Id"]}
                    </td>
                    </tr>
                </table>
                <table style="width: 100%; line-height: inherit; text-align: left; border-collapse: collapse;">
                    <thead>
                    <tr>
                        <th style="background-color: #007bff; color: white; text-align: left; padding: 5px;">Description</th>
                        <th style="background-color: #007bff; color: white; text-align: left; padding: 5px;">Date</th>
                        <th style="background-color: #007bff; color: white; text-align: left; padding: 5px;">Hours</th>
                        <th style="background-color: #007bff; color: white; text-align: left; padding: 5px;">Rate</th>
                        <th style="background-color: #007bff; color: white; text-align: left; padding: 5px;">Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
    """

    total = 0
    invoiceData["Shifts"] = sorted(invoiceData["Shifts"], key=lambda x: (x['date'], '%Y-%m-%d'))
    
    for shift in invoiceData["Shifts"]:
        total += shift['total']
        html_content += f"""
            <tr>
                <td style="border-bottom: 1px solid #ddd; text-align: left; padding: 5px;"><b>{shift['description']}</b></td>
                <td style="border-bottom: 1px solid #ddd; text-align: left; padding: 5px;">{shift['date']}</td>
                <td style="border-bottom: 1px solid #ddd; text-align: left; padding: 5px;">{float(shift['hours']):.2f}</td>
                <td style="border-bottom: 1px solid #ddd; text-align: left; padding: 5px;">{float(shift['price']):.2f} $</td>
                <td style="border-bottom: 1px solid #ddd; text-align: left; padding: 5px;">{float(shift['total']):.2f} $</td>
            </tr>
        """
                                          
    html_content += f"""                
                    </tbody>
                </table>
                <!-- Total Section -->
                <div style="text-align: right; margin-top: 20px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; margin-right: 15px;">Total:</span>
                    <span style="color: #007bff; font-weight: bold;">{float(total):.2f} $</span>
                </div>
                </div>
                </div>
            </body>
        </html>
    """
        
    pdf_file = BytesIO()
    pisa.CreatePDF(BytesIO(html_content.encode('utf-8')), dest=pdf_file)
    
    return pdf_file