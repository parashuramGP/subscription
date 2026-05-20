import json
import os
import hashlib
import uuid
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / 'data'
USERS_FILE = DATA_DIR / 'users.json'


def _ensure_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not USERS_FILE.exists():
        USERS_FILE.write_text(json.dumps([], indent=2))


def _read_users():
    _ensure_file()
    with open(USERS_FILE, 'r') as f:
        return json.loads(f.read())


def _write_users(users):
    _ensure_file()
    with open(USERS_FILE, 'w') as f:
        f.write(json.dumps(users, indent=2))


def _hash_password(password, salt=None):
    if not salt:
        salt = uuid.uuid4().hex
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}${hashed}"


def _verify_password(password, stored):
    salt, hashed = stored.split('$')
    return _hash_password(password, salt) == stored


def create_user(email, username, password, first_name='', last_name=''):
    users = _read_users()
    for u in users:
        if u['email'] == email:
            raise ValueError('A user with this email already exists.')
        if u['username'] == username:
            raise ValueError('A user with this username already exists.')

    user = {
        'id': str(uuid.uuid4()),
        'email': email,
        'username': username,
        'password': _hash_password(password),
        'first_name': first_name,
        'last_name': last_name,
        'phone': '',
        'address': '',
        'city': '',
        'state': '',
        'zip_code': '',
        'is_admin': False,
    }
    users.append(user)
    _write_users(users)
    return {k: v for k, v in user.items() if k != 'password'}


def authenticate(email, password):
    users = _read_users()
    for u in users:
        if u['email'] == email and _verify_password(password, u['password']):
            return {k: v for k, v in u.items() if k != 'password'}
    return None


def get_user_by_id(user_id):
    users = _read_users()
    for u in users:
        if u['id'] == user_id:
            return {k: v for k, v in u.items() if k != 'password'}
    return None


def update_user(user_id, data):
    users = _read_users()
    for i, u in enumerate(users):
        if u['id'] == user_id:
            for key in ['first_name', 'last_name', 'phone', 'address', 'city', 'state', 'zip_code']:
                if key in data:
                    users[i][key] = data[key]
            _write_users(users)
            return {k: v for k, v in users[i].items() if k != 'password'}
    return None
