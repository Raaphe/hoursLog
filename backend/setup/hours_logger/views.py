from .models import *
from .serializers import *
from rest_framework import viewsets

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
