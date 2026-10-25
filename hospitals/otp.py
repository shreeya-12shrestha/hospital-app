import secrets
from datetime import timedelta

from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from .models import PhoneOTP

CODE_LIFETIME = timedelta(minutes=5)
RESEND_WAIT = timedelta(seconds=60)
MAX_ATTEMPTS = 5


def send_sms(phone, text):
    # Development stand-in: print the message instead of paying an SMS gateway.
    # To go live, replace only this function with a call to the provider's API.
    print(f"\n[SMS to {phone}] {text}\n", flush=True)


def issue_code(phone):
    """Create and send a new code. Returns how many seconds to wait if asked too soon, else 0."""
    last = PhoneOTP.objects.filter(phone=phone).order_by('-created_at').first()
    if last and timezone.now() - last.created_at < RESEND_WAIT:
        return int((RESEND_WAIT - (timezone.now() - last.created_at)).total_seconds()) + 1
    PhoneOTP.objects.filter(phone=phone).delete()          # only one live code per phone
    code = f"{secrets.randbelow(1_000_000):06d}"
    PhoneOTP.objects.create(phone=phone, code_hash=make_password(code))
    send_sms(phone, f"Your Swasthya Track code is {code}. It expires in 5 minutes.")
    return 0


def check_code(phone, code):
    """Return None if the code is right, otherwise a message saying what is wrong."""
    otp = PhoneOTP.objects.filter(phone=phone).order_by('-created_at').first()
    if otp is None or timezone.now() - otp.created_at > CODE_LIFETIME:
        return "The code has expired. Please ask for a new one."
    if otp.attempts >= MAX_ATTEMPTS:
        return "Too many wrong tries. Please ask for a new code."
    if not check_password(code, otp.code_hash):
        otp.attempts += 1
        otp.save(update_fields=['attempts'])
        return "That code is not right."
    otp.delete()                                           # a code works only once
    return None