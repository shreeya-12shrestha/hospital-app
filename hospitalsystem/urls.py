from django.contrib import admin
from django.urls import path
from hospitals.views import HospitalListView, symptom_check, chat, HospitalDetailView, AppointmentCreateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hospitals/', HospitalListView.as_view()),
    path('api/hospitals/<int:pk>/', HospitalDetailView.as_view()),
    path('api/appointments/', AppointmentCreateView.as_view()),
    path('api/symptom-check/', symptom_check),
    path('api/chat/', chat),
]