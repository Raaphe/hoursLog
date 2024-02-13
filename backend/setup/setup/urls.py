"""
With this setup, the following URLs will be available:

- List and create employees: /employees/
- Retrieve, update, and delete a specific employee: /employees/{id}/
- List and create shifts: /shifts/
- Retrieve, update, and delete a specific shift: /shifts/{id}/
- List and create invoices: /invoices/
- Retrieve, update, and delete a specific invoice: /invoices/{id}/

You can use these URLs to perform CRUD operations on your Employee, Shift, and Invoice models using the corresponding viewsets and serializers.
"""

from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from hours_logger import views

router = DefaultRouter()
router.register(r'employees', views.employeeViewSet)
router.register(r'shifts', views.shiftViewSet)
router.register(r'invoices', views.invoiceViewSet)
router.register(r'pauseLogs', views.pauseLogViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('employee/<int:employee_id>/invoices/', views.get_employee_invoices, name='employee_invoices'),
    path('get_invoice_info/<int:invoice_id>', views.get_invoice, name='get_invoice_info'),
    path('get_invoice_pdf/<int:invoice_id>', views.get_pdf, name='get_generated_pdf'),
    
]

