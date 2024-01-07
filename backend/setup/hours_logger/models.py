from django.db import models, transaction
from datetime import timedelta

class Employee(models.Model):
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    address = models.TextField()
    phoneNumber = models.CharField(max_length=10)
    email = models.EmailField()
    
    def __str__(self):
        return f"{self.firstName} {self.lastName}"

class Shift(models.Model):
    start_time = models.DateTimeField(null=True)
    end_time = models.DateTimeField(null=True)
    hours = models.FloatField(null=True, blank=True)
    price = models.FloatField()
    total = models.FloatField(null=True, blank=True)
    description = models.TextField()
    
    invoice = models.ForeignKey('Invoice', on_delete=models.CASCADE, related_name='shifts')

    def total_worked_time(self):
        if not self.end_time or not self.start_time:
            return timedelta(0)
        
        worked_time = self.end_time - self.start_time
        
        total_paused = timedelta(0)
        for log in self.pauselogs.all():
            total_paused += log.pauseDuration

        if total_paused > timedelta(0):
            worked_time -= total_paused

        return worked_time
    
    def rounded_hours(self):
        hours = self.total_worked_time().total_seconds() / 3600 
        quarter_hours = 0.25
        return round(hours / quarter_hours) * quarter_hours

    def save(self, *args, **kwargs):
        if self.end_time and self.start_time:
            self.hours = self.rounded_hours()
            self.total = self.hours * self.price if self.price is not None else None
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Shift starting at {self.start_time}"

class PauseLog(models.Model):
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='pauselogs')
    pause_time = models.DateTimeField()
    resume_time = models.DateTimeField(null=True, blank=True)
    pauseDuration = models.DurationField(null=True, blank=True)
    
    def duration(self):
        if self.pause_time and self.resume_time:
            return self.resume_time - self.pause_time
        return timedelta(0)
    
    def save(self, *args, **kwargs):
        self.pauseDuration = self.duration()

        with transaction.atomic():
            super().save(*args, **kwargs)
            try:
                related_shift = Shift.objects.get(id=self.shift_id)
                related_shift.save()
            except Shift.DoesNotExist:
                pass

    def __str__(self):
        return f"PauseLog for {self.shift} paused at {self.pause_time}"

class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='invoices')

    def __str__(self):
        return f"Invoice id {self.id}"