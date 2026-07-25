from django.contrib import admin
from .models import Hospital, Service, Doctor, Appointment

admin.site.register(Hospital)
admin.site.register(Service)
admin.site.register(Doctor)
admin.site.register(Appointment)