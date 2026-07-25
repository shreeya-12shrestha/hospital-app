from rest_framework import serializers
from .models import Hospital
from .models import Hospital, Service, Doctor, Appointment  # mathi ko import line lai yo le replace gara


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description']


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty', 'available_days']


class HospitalDetailSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    doctors = DoctorSerializer(many=True, read_only=True)

    class Meta:
        model = Hospital
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'hospital', 'doctor', 'patient_name', 'phone', 'date', 'time_slot', 'note']
class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'