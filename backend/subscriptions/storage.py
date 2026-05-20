import json
import uuid
import datetime
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / 'data'
SUBSCRIPTIONS_FILE = DATA_DIR / 'subscriptions.json'


def _ensure_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not SUBSCRIPTIONS_FILE.exists():
        SUBSCRIPTIONS_FILE.write_text(json.dumps([], indent=2))


def _read_all():
    _ensure_file()
    with open(SUBSCRIPTIONS_FILE, 'r') as f:
        return json.loads(f.read())


def _write_all(data):
    _ensure_file()
    with open(SUBSCRIPTIONS_FILE, 'w') as f:
        f.write(json.dumps(data, indent=2, default=str))


def create_subscription(user_id, plan_data):
    subs = _read_all()
    for s in subs:
        if s['user_id'] == user_id and s['status'] == 'active':
            s['status'] = 'cancelled'

    now = datetime.datetime.utcnow().isoformat()
    interval_days = {'monthly': 30, 'quarterly': 90, 'yearly': 365}
    days = interval_days.get(plan_data['interval'], 30)
    end = (datetime.datetime.utcnow() + datetime.timedelta(days=days)).isoformat()

    sub = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'plan': plan_data,
        'status': 'active',
        'current_period_start': now,
        'current_period_end': end,
        'cancel_at_period_end': False,
        'created_at': now,
    }
    subs.append(sub)
    _write_all(subs)
    return sub


def get_user_subscriptions(user_id):
    subs = _read_all()
    return [s for s in subs if s['user_id'] == user_id]


def cancel_subscription(sub_id, user_id):
    subs = _read_all()
    for s in subs:
        if s['id'] == sub_id and s['user_id'] == user_id:
            s['status'] = 'cancelled'
            s['cancel_at_period_end'] = True
            _write_all(subs)
            return s
    return None


def pause_subscription(sub_id, user_id):
    subs = _read_all()
    for s in subs:
        if s['id'] == sub_id and s['user_id'] == user_id:
            s['status'] = 'paused'
            _write_all(subs)
            return s
    return None


def resume_subscription(sub_id, user_id):
    subs = _read_all()
    for s in subs:
        if s['id'] == sub_id and s['user_id'] == user_id:
            s['status'] = 'active'
            _write_all(subs)
            return s
    return None
