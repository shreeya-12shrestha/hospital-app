from rest_framework import serializers
from .models import Hospital, Service, Doctor, Appointment


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description']


class DoctorSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty', 'available_days', 'hospital', 'hospital_name']


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

    def validate_phone(self, value):
        cleaned = value.replace('-', '').replace(' ', '').replace('+', '')
        if not cleaned.isdigit() or len(cleaned) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

    def validate_date(self, value):
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        return value

    def validate(self, data):
        doctor = data.get('doctor')
        if doctor:
            exists = Appointment.objects.filter(
                doctor=doctor,
                date=data['date'],
                time_slot=data['time_slot'],
            ).exists()
            if exists:
                raise serializers.ValidationError(
                    "This doctor already has a booking at that date and time."
                )
        return data


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'