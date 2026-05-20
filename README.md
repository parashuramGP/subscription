# Subscription Store

A full-stack subscription management platform with Django backend and React frontend.

## Tech Stack

- **Backend**: Django, Django REST Framework, Stripe, Celery, JWT Auth
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Payments**: Stripe Checkout & Webhooks

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/login/` - Login
- `POST /api/auth/registration/` - Register
- `GET /api/accounts/profile/` - User profile
- `GET /api/subscriptions/plans/` - List plans
- `GET /api/subscriptions/` - User subscriptions
- `POST /api/payments/checkout/` - Create Stripe checkout
- `POST /api/payments/webhook/` - Stripe webhook
- `GET /api/orders/` - User orders
- `GET /api/analytics/dashboard/` - Admin dashboard
