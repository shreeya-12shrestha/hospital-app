from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from .otp import issue_code
import os
import json
from dotenv import load_dotenv
from google import genai
import joblib
import pandas as pd
from google.genai import types
from .models import Hospital, Service, Doctor, Appointment
from math import asin, cos, radians, sin, sqrt
from .serializers import HospitalSerializer, HospitalDetailSerializer, AppointmentSerializer, DoctorSerializer
from .serializers import RegisterSerializer, clean_phone
load_dotenv()
gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class HospitalListView(generics.ListAPIView):
    serializer_class = HospitalSerializer

    def get_queryset(self):
        qs = Hospital.objects.all()
        # ?search=janatapriya  (name or address)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                models.Q(name__icontains=search) | models.Q(address__icontains=search)
            )
        # ?city=Pokhara
        city = self.request.query_params.get('city')
        if city:
            qs = qs.filter(city__iexact=city)
        # ?promoted=true
        promoted = self.request.query_params.get('promoted')
        if promoted == 'true':
            qs = qs.filter(is_promoted=True)
        # ?sort=rating (default: name)
        sort = self.request.query_params.get('sort', 'name')
        if sort == 'rating':
            qs = qs.order_by('-rating')
        elif sort == 'beds':
            qs = qs.order_by('-available_beds')
        else:
            qs = qs.order_by('name')
        return qs

class HospitalDetailView(generics.RetrieveAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalDetailSerializer
class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        qs = Doctor.objects.select_related('hospital').all()
        hospital_id = self.request.query_params.get('hospital')
        if hospital_id:
            qs = qs.filter(hospital_id=hospital_id)
        specialty = self.request.query_params.get('specialty')
        if specialty:
            qs = qs.filter(specialty__icontains=specialty)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)
        return qs

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        # logged-in patients get the booking linked to their account; guests stay anonymous
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class MyAppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (Appointment.objects.filter(user=self.request.user)
                .select_related('hospital', 'doctor')
                .order_by('-date', '-time_slot'))


# --- Patient accounts ---

def account_payload(user, token):
    return {'token': token.key, 'user': {'name': user.first_name, 'phone': user.username}}

@api_view(['POST'])
def send_otp(request):
    phone = clean_phone(request.data.get('phone', ''))
    if len(phone) != 10 or not phone.startswith('9'):
        return Response({'error': 'Enter a 10-digit mobile number, e.g. 98XXXXXXXX.'}, status=400)
    if User.objects.filter(username=phone).exists():
        return Response({'error': 'An account with this phone number already exists.'}, status=400)
    wait = issue_code(phone)
    if wait:
        return Response({'error': f'Please wait {wait} seconds before asking for a new code.'}, status=429)
    return Response({'detail': 'Code sent.'})

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = Token.objects.create(user=user)
    return Response(account_payload(user, token), status=201)


@api_view(['POST'])
def login(request):
    user = authenticate(
        username=clean_phone(request.data.get('phone', '')),
        password=request.data.get('password', ''),
    )
    if user is None:
        return Response({'error': 'Wrong phone number or password.'}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response(account_payload(user, token))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response(status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({'name': request.user.first_name, 'phone': request.user.username})
ML_DIR = settings.BASE_DIR / 'ml'
model = joblib.load(ML_DIR / 'disease_model.pkl')
symptom_list = joblib.load(ML_DIR / 'symptoms.pkl')

@api_view(['POST'])
def symptom_check(request):

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
    possible = []
    matched = [s for s in chosen if s in symptom_list]
    if matched:
        row = [1 if s in matched else 0 for s in symptom_list]
        input_df = pd.DataFrame([row], columns=symptom_list)
        prediction = model.predict(input_df)[0]
        # the 3 most likely conditions, with how sure the model is about each
        chances = model.predict_proba(input_df)[0]
        best = chances.argsort()[::-1][:3]
        possible = [{'name': str(model.classes_[i]), 'chance': round(float(chances[i]) * 100)}
                    for i in best if chances[i] > 0]
    disclaimer = (
        'यो निदान होइन — जानकारीमूलक सुझाव मात्र हो। कृपया योग्य डाक्टरलाई भेट्नुहोस्।'
        if lang == 'ne' else
        'This is not a diagnosis — it is an informational suggestion only. Please see a qualified doctor.'
    )

    return Response({
        'result': gemini_reply,          # human-readable text, in the user's language
        'prediction': prediction,        # disease label from the Random Forest (or null)
        'matched_symptoms': matched,     # which known symptoms we recognized
        'possible': possible,            # top 3 conditions with a percentage each           # top 3 conditions with a percentage each # which known symptoms we recognized
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
        return [], None

def hospitals_context():
    lines = []
    for h in Hospital.objects.prefetch_related('services', 'doctors'):
        services = ', '.join(s.name for s in h.services.all()) or 'not listed'
        doctors = ', '.join(f'Dr. {d.name} ({d.specialty})' for d in h.doctors.all()) or 'not listed'
        lines.append(
            f'- {h.name}, {h.address}. Free beds: {h.available_beds} of {h.total_beds}. '
            f'Services: {services}. Doctors: {doctors}.'
        )
    return '\n'.join(lines)

CHAT_RULES = (
    "You are the AI health assistant for Swasthya Track, a hospital-finder app in Nepal.\n"
    "Rules:\n"
    "- Give general health information only. Never diagnose, and never suggest medicine doses.\n"
    "- For anything serious, advise seeing a doctor. For emergencies (chest pain, trouble "
    "breathing, heavy bleeding, fainting), tell the user to call 102 for an ambulance right away.\n"
    "- Keep replies short: 2-4 sentences in plain language.\n"
    "- Politely decline requests clearly unrelated to health, such as poems or homework. "
    "You may use details the user shared earlier in this chat, like their name.\n"
    "- Write plain text only: no markdown, no asterisks, no bullet lists."
)


@api_view(['POST'])
def chat(request):
    message = request.data.get('message', '')
    if not message:
        return Response({'error': 'Please send a message.'}, status=400)
    lang = request.data.get('lang', 'en')
    language = 'Nepali (Devanagari script)' if lang == 'ne' else 'English'
    history = request.data.get('history', [])
    if not isinstance(history, list):
        history = []

    contents = []
    for turn in history[-10:]:
        role = 'user' if turn.get('me') else 'model'
        contents.append(types.Content(role=role, parts=[types.Part(text=str(turn.get('text', '')))]))
    contents.append(types.Content(role='user', parts=[types.Part(text=message)]))
    try:
        response = gemini.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=(
                    CHAT_RULES
                    + "\n- Reply in the same language the user writes in. If they write Nepali in "
                    "Devanagari, reply in Devanagari. If they write Nepali in Roman letters "
                    "(like 'malai jwaro aayo'), reply in Nepali using Roman letters."
                    + f"\n- If the language is unclear, reply in {language}."
                    + "\n\nHospitals listed in Swasthya Track. When recommending a hospital, "
                    "choose only from this list, and say so if none fit:\n"
                    + hospitals_context()
                ),
            ),
        )
        return Response({'reply': response.text})
    except Exception as e:
        print("CHAT ERROR:", repr(e))
        return Response(
            {'error': 'AI service is temporarily unavailable. Please try again.'},
            status=503,
        )


# --- Ambulances near the patient ---

def distance_km(lat1, lng1, lat2, lng2):
    # Haversine formula: distance between two points on the Earth's surface
    lat1, lng1, lat2, lng2 = map(radians, (lat1, lng1, lat2, lng2))
    a = sin((lat2 - lat1) / 2) ** 2 + cos(lat1) * cos(lat2) * sin((lng2 - lng1) / 2) ** 2
    return 2 * 6371 * asin(sqrt(a))           # 6371 km = Earth's radius


@api_view(['GET'])
def nearby_ambulances(request):
    try:
        lat = float(request.query_params['lat'])
        lng = float(request.query_params['lng'])
    except (KeyError, ValueError):
        return Response({'error': 'Send your location as ?lat=...&lng=...'}, status=400)

    results = []
    for amb in Ambulance.objects.filter(is_available=True).select_related('hospital'):
        results.append({
            'id': amb.id,
            'name': amb.name,
            'hospital': amb.hospital.name if amb.hospital else '',
            'phone': amb.phone,
            'latitude': float(amb.latitude),
            'longitude': float(amb.longitude),
            'distance_km': round(distance_km(lat, lng, float(amb.latitude), float(amb.longitude)), 1),
        })
    results.sort(key=lambda r: r['distance_km'])
    return Response(results[:10])