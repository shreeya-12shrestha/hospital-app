from django.contrib import admin
from django.urls import path
from hospitals.views import HospitalListView, DoctorListView ,HospitalDetailView, AppointmentCreateView, symptom_check, chat
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hospitals/', HospitalListView.as_view()),
    path('api/hospitals/<int:pk>/', HospitalDetailView.as_view()),
    path('api/appointments/', AppointmentCreateView.as_view()),
    path('api/symptom-check/', symptom_check),
    path('api/chat/', chat),
    path('api/doctors/', DoctorListView.as_view()),
]