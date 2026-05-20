import json
import uuid
import datetime
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / 'data'
HISTORY_FILE = DATA_DIR / 'watch_history.json'


def _ensure_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text(json.dumps([], indent=2))


def _read_all():
    _ensure_file()
    with open(HISTORY_FILE, 'r') as f:
        return json.loads(f.read())


def _write_all(data):
    _ensure_file()
    with open(HISTORY_FILE, 'w') as f:
        f.write(json.dumps(data, indent=2, default=str))


def add_to_history(user_id, movie):
    history = _read_all()
    for item in history:
        if item['user_id'] == user_id and item['movie']['id'] == movie['id']:
            item['watched_at'] = datetime.datetime.utcnow().isoformat()
            item['watch_count'] = item.get('watch_count', 1) + 1
            _write_all(history)
            return item

    entry = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'movie': movie,
        'watched_at': datetime.datetime.utcnow().isoformat(),
        'watch_count': 1,
    }
    history.insert(0, entry)
    _write_all(history)
    return entry


def get_user_history(user_id):
    history = _read_all()
    user_history = [h for h in history if h['user_id'] == user_id]
    user_history.sort(key=lambda x: x['watched_at'], reverse=True)
    return user_history
