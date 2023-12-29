from rest_framework import viewsets
from hours_logger.other import functions
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from django.http import JsonResponse
from reportlab.pdfgen import canvas

class employeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = employeeSerializer

class shiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = shiftSerializer

class invoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = invoiceSerializer

@csrf_exempt
@require_GET
def get_invoice(request, invoice_id):
    try:
        invoice = Invoice.objects.filter(id=invoice_id).first()

        if not invoice:
            return JsonResponse({"error": "Invoice not found"}, status=404)
        
        return JsonResponse(functions.getInvoice(invoice))

    except Invoice.DoesNotExist:
        return JsonResponse({"error": "Invoice not found"}, status=404)
    except ValueError:
        return JsonResponse({"error": "Invalid 'invoice_id' parameter"}, status=400)

