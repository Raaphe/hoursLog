from django.contrib import admin
from .models import *

admin.site.register(Employee)
admin.site.register(Shift)
admin.site.register(Invoice)
admin.site.register(PauseLog)