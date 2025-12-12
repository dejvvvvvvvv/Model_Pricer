# Django Backend Setup Guide

This directory (`backend-django/`) is intended for a Django backend application.

## Installation and Setup Steps:

1.  **Create and Activate a Virtual Environment (Recommended):**
    ```bash
    cd backend-django
    python3 -m venv venv
    source venv/bin/activate # On Windows: venv\Scripts\activate
    ```

2.  **Install Django:**
    ```bash
    pip install Django djangorestframework # djangorestframework is common for APIs
    ```

3.  **Start a New Django Project:**
    ```bash
    django-admin startproject myproject .
    ```
    (The `.` at the end tells Django to create the project in the current directory)

4.  **Create a Django App (e.g., for printers, users, models):**
    ```bash
    python manage.py startapp printers
    ```

5.  **Configure `settings.py`:**
    *   Add your new app to `INSTALLED_APPS` (e.g., `'printers'`).
    *   Configure your database (Django uses SQLite by default, but you'll likely want PostgreSQL or MySQL for production).
    *   Configure CORS if your frontend is on a different origin (using `django-cors-headers` package).

6.  **Create Database Migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

7.  **Create Superuser (for admin interface):**
    ```bash
    python manage.py createsuperuser
    ```

8.  **Run the Development Server:**
    ```bash
    python manage.py runserver 0.0.0.0:3003 # Django defaults to 8000, changed to 3003 for this example
    ```

## Example API Endpoint (inside a Django App like `printers/views.py`):

```python
from rest_framework.views import APIView
from rest_framework.response import Response

class HelloDjangoAPI(APIView):
    def get(self, request):
        return Response({'message': 'Hello from Django backend!'})
```

This API view would then need to be hooked up to a URL in `printers/urls.py` and then included in `myproject/urls.py`.