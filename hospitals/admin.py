from django.contrib import admin
from .models import Hospital, Service, Doctor, Appointment


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'rating', 'available_beds', 'is_promoted')
    list_filter = ('city', 'is_promoted')
    search_fields = ('name', 'city', 'address')
    list_editable = ('is_promoted', 'rating')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'hospital')
    list_filter = ('hospital',)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'hospital', 'available_days', 'start_time', 'end_time')
    list_filter = ('hospital', 'specialty')
    search_fields = ('name', 'specialty')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'hospital', 'doctor', 'date', 'time_slot', 'created_at')
    list_filter = ('date', 'hospital')
    search_fields = ('patient_name', 'phone')