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
import os
import json
from dotenv import load_dotenv
from google import genai
from .serializers import HospitalSerializer, HospitalDetailSerializer, AppointmentSerializer, DoctorSerializer
load_dotenv()
gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class HospitalListView(generics.ListAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class HospitalDetailView(generics.RetrieveAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalDetailSerializer
class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        qs = Doctor.objects.select_related('hospital').all()
        # optional ?hospital=<id> filter, used by the detail page's doctors section
        hospital_id = self.request.query_params.get('hospital')
        if hospital_id:
            qs = qs.filter(hospital_id=hospital_id)
        return qs

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
# --- Symptom checker: load the trained model once at startup ---
ML_DIR = settings.BASE_DIR / 'ml'
model = joblib.load(ML_DIR / 'disease_model.pkl')
symptom_list = joblib.load(ML_DIR / 'symptoms.pkl')

@api_view(['POST'])
def symptom_check(request):
    # Accept both shapes:
    #   new free-text page  -> {"symptoms": "I have fever and headache", "lang": "ne"}
    #   old checkbox client -> {"symptoms": ["fever", "headache"]}
    raw = request.data.get('symptoms', '')
    lang = request.data.get('lang', 'en')

    if not raw:
        return Response({'error': 'Please describe your symptoms.'})

    if isinstance(raw, list):
        chosen = raw
        gemini_reply = None
    else:
        chosen, gemini_reply = extract_symptoms_with_gemini(raw, lang)

    prediction = None
    matched = [s for s in chosen if s in symptom_list]
    if matched:
        row = [1 if s in matched else 0 for s in symptom_list]
        input_df = pd.DataFrame([row], columns=symptom_list)
        prediction = model.predict(input_df)[0]

    disclaimer = (
        'यो निदान होइन — जानकारीमूलक सुझाव मात्र हो। कृपया योग्य डाक्टरलाई भेट्नुहोस्।'
        if lang == 'ne' else
        'This is not a diagnosis — it is an informational suggestion only. Please see a qualified doctor.'
    )

    return Response({
        'result': gemini_reply,          # human-readable text, in the user's language
        'prediction': prediction,        # disease label from the Random Forest (or null)
        'matched_symptoms': matched,     # which known symptoms we recognized
        'disclaimer': disclaimer,
    })


def extract_symptoms_with_gemini(text, lang):
    """Returns (list_of_symptom_names, human_readable_reply)."""
    language = 'Nepali (Devanagari script)' if lang == 'ne' else 'English'
    prompt = (
        "You are a careful health assistant. A patient describes how they feel.\n"
        f"1. Write a short, calm reply in {language} (2-3 sentences). "
        "Do not diagnose; suggest what to watch for and when to see a doctor.\n"
        "2. From the description, pick the matching symptom names from THIS EXACT LIST "
        "(use the names verbatim, do not invent new ones):\n"
        f"{', '.join(symptom_list)}\n\n"
        "Respond as strict JSON only, no markdown:\n"
        '{"reply": "<your reply>", "symptoms": ["name1", "name2"]}\n\n'
        f'Patient: "{text}"'
    )
    try:
        response = gemini.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        cleaned = response.text.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
        data = json.loads(cleaned)
        return data.get('symptoms', []), data.get('reply', '')
    except Exception:
        # Gemini failed or returned non-JSON — fall back to ML-only, no reply
        return [], None
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
