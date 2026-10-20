from datetime import datetime
from rest_framework import serializers
from .models import Hospital, Service, Doctor, Appointment
from django.contrib.auth import password_validation
from django.contrib.auth.models import User

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description']


class DoctorSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    work_days = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty', 'available_days', 'start_time', 'end_time',
                  'work_days', 'hospital', 'hospital_name']

    def get_work_days(self, doctor):
        # JavaScript's getDay(): Sunday = 0 ... Saturday = 6
        js_order = ['works_sun', 'works_mon', 'works_tue', 'works_wed', 'works_thu', 'works_fri', 'works_sat']
        return [i for i, field in enumerate(js_order) if getattr(doctor, field)]

class HospitalDetailSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    doctors = DoctorSerializer(many=True, read_only=True)

    class Meta:
        model = Hospital
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True, default=None)
    class Meta:
        model = Appointment
        fields = ['id', 'hospital', 'doctor', 'hospital_name', 'doctor_name',
                  'patient_name', 'phone', 'date', 'time_slot', 'note']
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
            if doctor.start_time and doctor.end_time:
                try:
                    slot = datetime.strptime(data['time_slot'], '%H:%M').time()
                except ValueError:
                    raise serializers.ValidationError("Please choose a valid time.")
                if not (doctor.start_time <= slot < doctor.end_time):
                    raise serializers.ValidationError(
                        f"Dr. {doctor.name} is available only between "
                        f"{doctor.start_time:%H:%M} and {doctor.end_time:%H:%M}."
                    )
        return data


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'
def clean_phone(value):
    digits = ''.join(ch for ch in value if ch.isdigit())
    if digits.startswith('977') and len(digits) == 13:
        digits = digits[3:]
    return digits


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    def validate_phone(self, value):
        phone = clean_phone(value)
        if len(phone) != 10 or not phone.startswith('9'):
            raise serializers.ValidationError("Enter a 10-digit mobile number, e.g. 98XXXXXXXX.")
        if User.objects.filter(username=phone).exists():
            raise serializers.ValidationError("An account with this phone number already exists.")
        return phone

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, data):
        return User.objects.create_user(
            username=data['phone'], password=data['password'], first_name=data['name'],
        )