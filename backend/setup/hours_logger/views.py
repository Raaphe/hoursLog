from ast import List
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import viewsets
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Min, Max

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

from django.http import JsonResponse, HttpResponse
from hours_logger.other import functions

class employeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = employeeSerializer

class shiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = shiftSerializer

class invoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = invoiceSerializer
    
class pauseLogViewSet(viewsets.ModelViewSet):
    queryset = PauseLog.objects.all()
    serializer_class = pauseLogSerializer

@csrf_exempt
@require_GET
def get_employee_invoices(request, employee_id):
    try:
        employee = Employee.objects.get(pk=employee_id)
        invoices = Invoice.objects.filter(employee=employee).order_by('id')
        
        invoices_data = []
        for invoice in invoices:
            # Fetch shifts related to the invoice and calculate the min start date and max end date
            shifts_aggregate = invoice.shifts.aggregate(first_shift_start=Min('start'), last_shift_end=Max('end'))

            # Convert datetime to date (if not None)
            first_shift_start_date = shifts_aggregate['first_shift_start'].date() if shifts_aggregate['first_shift_start'] else None
            last_shift_end_date = shifts_aggregate['last_shift_end'].date() if shifts_aggregate['last_shift_end'] else None

            # Construct the invoice data including the additional shift information
            invoice_data = {
                'id': invoice.id,
                'employee_id': employee.id,
                'start': first_shift_start_date,
                'end': last_shift_end_date,
                # Include other invoice fields as needed
            }
            invoices_data.append(invoice_data)
        
        return JsonResponse(invoices_data, safe=False)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)

@csrf_exempt
@require_GET
def get_invoice(request, invoice_id):
    try:
        invoice = Invoice.objects.filter(id=invoice_id).first()

        if not invoice:
            return JsonResponse({"error": "Invoice not found"}, status=404)

        return JsonResponse(functions.convertInvoiceInfoToJson(invoice))

    except Invoice.DoesNotExist:
        return JsonResponse({"error": "Invoice not found"}, status=404)
    except ValueError:
        return JsonResponse({"error": "Invalid 'invoice_id' parameter"}, status=400)

@csrf_exempt
@require_GET
def get_pdf(request, invoice_id):
    try:
        invoice = Invoice.objects.filter(id=invoice_id).first()

        if not invoice:
            return JsonResponse({"error": "Invoice not found"}, status=404)

        response = HttpResponse(functions.generatePdf(invoice).getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="invoice.pdf"'
        return response

    except Invoice.DoesNotExist:
        return JsonResponse({"error": "Invoice not found"}, status=404)
    except ValueError:
        return JsonResponse({"error": "Invalid 'invoice_id' parameter"}, status=400)


# @csrf_exempt
# @require_GET
# def get_employee_invoices(request, employee_id:int) -> JsonResponse:
    
#     try :
#         employee:Employee = get_object_or_404(Employee, pk=employee_id);
#         invoices:List[Invoice] = Invoice.objects.filter(employee=employee).values();

#         context = {"invoices": invoices, "employee": employee};
#         return JsonResponse(context, safe=False);
#     except: 
#         return JsonResponse({"error": "Invalid request"}, status=400)