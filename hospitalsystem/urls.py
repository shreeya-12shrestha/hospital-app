from django.contrib import admin
from django.contrib.auth.models import User
from django.urls import path
from hospitals.views import HospitalListView, DoctorListView ,HospitalDetailView, AppointmentCreateView, symptom_check, chat
from hospitals.views import MyAppointmentsView, register, login, logout, me , send_otp
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hospitals/', HospitalListView.as_view()),
    path('api/hospitals/<int:pk>/', HospitalDetailView.as_view()),
    path('api/appointments/', AppointmentCreateView.as_view()),
    path('api/symptom-check/', symptom_check),
    path('api/chat/', chat),
    path('api/doctors/', DoctorListView.as_view()),
    path('api/my-appointments/', MyAppointmentsView.as_view()),
    path('api/send-otp/', send_otp),
    path('api/register/', register),
    path('api/login/', login),
    path('api/logout/', logout),
    path('api/me/', me),
]