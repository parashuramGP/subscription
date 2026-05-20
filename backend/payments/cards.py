import json
import uuid
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / 'data'
CARDS_FILE = DATA_DIR / 'saved_cards.json'


def _ensure_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not CARDS_FILE.exists():
        CARDS_FILE.write_text(json.dumps([], indent=2))


def _read_all():
    _ensure_file()
    with open(CARDS_FILE, 'r') as f:
        return json.loads(f.read())


def _write_all(data):
    _ensure_file()
    with open(CARDS_FILE, 'w') as f:
        f.write(json.dumps(data, indent=2))


def save_card(user_id, card_last4, card_type, card_name, expiry):
    cards = _read_all()
    for c in cards:
        if c['user_id'] == user_id and c['card_last4'] == card_last4 and c['card_type'] == card_type:
            return c

    card = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'card_last4': card_last4,
        'card_type': card_type,
        'card_name': card_name,
        'expiry': expiry,
    }
    cards.append(card)
    _write_all(cards)
    return card


def get_user_cards(user_id):
    cards = _read_all()
    return [c for c in cards if c['user_id'] == user_id]


def delete_card(card_id, user_id):
    cards = _read_all()
    cards = [c for c in cards if not (c['id'] == card_id and c['user_id'] == user_id)]
    _write_all(cards)
