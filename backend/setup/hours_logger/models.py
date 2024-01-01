from django.db import models

class Employee(models.Model):
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    address = models.TextField()
    phoneNumber = models.CharField(max_length=10)
    email = models.EmailField()
    
    def __str__(self):
        return f"{self.firstName} {self.lastName}"

class Shift(models.Model):
    hours = models.FloatField()
    price = models.FloatField()
    total = models.FloatField(null = True, blank = True)
    date = models.DateField()
    description = models.TextField()
    
    invoice = models.ForeignKey('Invoice', on_delete=models.CASCADE, related_name='shifts')

    def save(self, *args, **kwargs):
        self.total = self.hours * self.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date}"

class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='invoices')

    def __str__(self):
        return f"{self.date}"