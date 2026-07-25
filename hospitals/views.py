from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import os
from dotenv import load_dotenv
from google import genai
import joblib
import pandas as pd
from .models import Hospital
from .serializers import HospitalSerializer
from .models import Hospital, Service, Doctor, Appointment
from .serializers import HospitalSerializer, HospitalDetailSerializer, AppointmentSerializer
# --- Hospital list (already working) ---
class HospitalListView(generics.ListAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class HospitalDetailView(generics.RetrieveAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalDetailSerializer


class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
# --- Symptom checker: load the trained model once at startup ---
ML_DIR = settings.BASE_DIR / 'ml'
model = joblib.load(ML_DIR / 'disease_model.pkl')
symptom_list = joblib.load(ML_DIR / 'symptoms.pkl')

@api_view(['POST'])
def symptom_check(request):
    chosen = request.data.get('symptoms', [])
    if not chosen:
        return Response({'error': 'Please send at least one symptom.'})
    # turn the chosen symptoms into the 132-number row the model expects
    row = [1 if s in chosen else 0 for s in symptom_list]
    input_df = pd.DataFrame([row], columns=symptom_list)
    prediction = model.predict(input_df)[0]
    return Response({
        'possible_condition': prediction,
        'disclaimer': 'This is not a diagnosis — it is an informational suggestion only. Please see a qualified doctor.'
    })

load_dotenv()
gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@api_view(['POST'])
def chat(request):
    message = request.data.get('message', '')
    if not message:
        return Response({'error': 'Please send a message.'})
    response = gemini.models.generate_content(
        model="gemini-2.5-flash",
        contents=message
    )
    return Response({'reply': response.text})