from xhtml2pdf import pisa
from io import BytesIO

def convertInvoiceInfoToJson(invoice):
    shifts = invoice.shifts.values(
        "date", "hours", "price", "total", "description", "invoiced"
    )
    
    return {
        "Invoice_Date": invoice.date,
         "Employee": {
             "First_Name": invoice.employee.firstName,
             "Last_Name": invoice.employee.lastName,
             "Adress": invoice.employee.address,
             "Phone_Number": invoice.employee.phoneNumber,
             "Email": invoice.employee.email
         },
         "Shifts": list(shifts)
    }


def generatePdf(invoice):
    invoiceData = convertInvoiceInfoToJson(invoice)

    # Define your HTML and CSS with the invoice data
    html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Invoice2</title>
        </head>
        <body>
            
        </body>
        </html>
        """

    pdf_file = BytesIO()
    pisa.CreatePDF(BytesIO(html_content.encode('utf-8')), dest=pdf_file)
    
    return pdf_file
    
