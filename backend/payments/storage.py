import json
import uuid
import datetime
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / 'data'
PAYMENTS_FILE = DATA_DIR / 'payments.json'


def _ensure_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not PAYMENTS_FILE.exists():
        PAYMENTS_FILE.write_text(json.dumps([], indent=2))


def _read_all():
    _ensure_file()
    with open(PAYMENTS_FILE, 'r') as f:
        return json.loads(f.read())


def _write_all(data):
    _ensure_file()
    with open(PAYMENTS_FILE, 'w') as f:
        f.write(json.dumps(data, indent=2, default=str))


def create_payment(user_id, plan_data, card_last4, card_type, card_name):
    payments = _read_all()
    now = datetime.datetime.utcnow().isoformat()

    payment = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'plan': plan_data,
        'amount': str(plan_data['price']),
        'currency': 'INR',
        'status': 'succeeded',
        'card_last4': card_last4,
        'card_type': card_type,
        'card_name': card_name,
        'created_at': now,
    }
    payments.append(payment)
    _write_all(payments)
    return payment


def get_user_payments(user_id):
    payments = _read_all()
    return [p for p in payments if p['user_id'] == user_id]
