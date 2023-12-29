from hours_logger import models

def getInvoice(invoice):
    shifts = invoice.shifts.values(
        "date", "hours", "price", "total", "description", "invoiced"
    )
    
    return {
        "Invoice Date": invoice.date,
         "Employee": {
             "First Name": invoice.employee.firstName,
             "Last Name": invoice.employee.lastName,
             "Adress": invoice.employee.address,
             "Phone Number": invoice.employee.phoneNumber,
             "Email": invoice.employee.email
         },
         "Shifts": list(shifts)
    }