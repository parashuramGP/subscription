# Streamify - One Command Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Clone & Run

```bash
git clone https://github.com/parashuramGP/subscription.git && cd subscription && cd backend && pip install -r requirements.txt && echo DEBUG=True > .env && echo SECRET_KEY=streamify-secret-key-2024 >> .env && echo DATABASE_URL=sqlite:///db.sqlite3 >> .env && echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env && echo CORS_ALLOWED_ORIGINS=http://localhost:5173 >> .env && echo STRIPE_PUBLIC_KEY= >> .env && echo STRIPE_SECRET_KEY= >> .env && echo STRIPE_WEBHOOK_SECRET= >> .env && echo CELERY_BROKER_URL=redis://localhost:6379/0 >> .env && echo EMAIL_HOST=smtp.gmail.com >> .env && echo EMAIL_PORT=587 >> .env && echo EMAIL_HOST_USER= >> .env && echo EMAIL_HOST_PASSWORD= >> .env && python manage.py makemigrations accounts && python manage.py makemigrations subscriptions orders payments && python manage.py migrate && python -c "import os,django;os.environ['DJANGO_SETTINGS_MODULE']='subscription_store.settings';django.setup();from subscriptions.models import Plan;Plan.objects.all().delete();Plan.objects.create(name='Basic',description='Great for personal use.',price=199,interval='monthly',features=['3 Projects','Basic Analytics','Email Support','1 GB Storage']);Plan.objects.create(name='Pro',description='Best for professionals.',price=499,interval='monthly',features=['Unlimited Projects','Advanced Analytics','Priority Support','50 GB Storage','API Access','Custom Integrations']);Plan.objects.create(name='Business',description='For enterprises.',price=999,interval='monthly',features=['Everything in Pro','Dedicated Manager','Unlimited Storage','SSO & SAML','24/7 Phone Support','Custom SLA']);print('Plans created!')" && start python manage.py runserver && cd ../frontend && npm install && npm run dev
```

Open **http://localhost:5173** in your browser. Done!
