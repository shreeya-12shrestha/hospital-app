from django.db import models
from django.conf import settings
class Hospital(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100, default='')
    phone = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    total_beds = models.IntegerField(default=0)
    available_beds = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    image = models.URLField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_promoted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Service(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} — {self.hospital.name}"


class Doctor(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='doctors')
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    available_days = models.CharField(max_length=100, blank=True)  # e.g. "Sun–Thu, 10–4"
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    # which days the doctor sees patients (Saturday is the usual day off in Nepal)
    works_sun = models.BooleanField('Sunday', default=True)
    works_mon = models.BooleanField('Monday', default=True)
    works_tue = models.BooleanField('Tuesday', default=True)
    works_wed = models.BooleanField('Wednesday', default=True)
    works_thu = models.BooleanField('Thursday', default=True)
    works_fri = models.BooleanField('Friday', default=True)
    works_sat = models.BooleanField('Saturday', default=False)

    def works_on(self, day):
        # Python's day.weekday(): Monday = 0 ... Sunday = 6
        fields = ['works_mon', 'works_tue', 'works_wed', 'works_thu', 'works_fri', 'works_sat', 'works_sun']
        return getattr(self, fields[day.weekday()])
    def __str__(self):
        return f"Dr. {self.name} ({self.specialty})"


class Appointment(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='appointments',
    )
    patient_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time_slot = models.CharField(max_length=50)   # e.g. "10:00–10:30"
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} @ {self.hospital.name} on {self.date}"


class PhoneOTP(models.Model):
    phone = models.CharField(max_length=10, db_index=True)
    code_hash = models.CharField(max_length=128)      # hashed like a password, never the plain code
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"OTP for {self.phone} at {self.created_at:%H:%M}"