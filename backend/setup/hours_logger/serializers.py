from rest_framework import serializers
from .models import *
import pytz

class employeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class shiftSerializer(serializers.ModelSerializer):
    def validate_my_datetime_field(self, value):
        eastern = pytz.timezone('America/New_York')
        return value.astimezone(eastern)
    
    class Meta:
        model = Shift
        fields = '__all__'
        
class invoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class pauseLogSerializer(serializers.ModelSerializer):
    def validate_my_datetime_field(self, value):
        eastern = pytz.timezone('America/New_York')
        return value.astimezone(eastern)
    
    class Meta:
        model = PauseLog
        fields = '__all__'