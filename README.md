# e-Health Portal - MVP

Система електронного здоров'я для управління медичними послугами.

## Вимоги

- Node.js (версія 14 або вище)
- PostgreSQL (версія 12 або вище)
- npm або yarn

## Встановлення

1. Встановіть залежності:
```bash
npm install
```

2. Створіть базу даних PostgreSQL:
```sql
CREATE DATABASE e_health_db;
CREATE USER dev_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE e_health_db TO dev_user;
```

3. Запустіть SQL скрипт для створення таблиць:
```bash
psql -U dev_user -d e_health_db -f database/schema.sql
```

Або виконайте SQL команди з файлу `database/schema.sql` вручну через psql або pgAdmin.

## Запуск сервера

```bash
npm start
```

Сервер буде доступний на `http://localhost:3000`

## Структура проєкту

```
ElectronicMedicineSystem/
├── server.js              # Express сервер з API endpoints
├── package.json           # Залежності проєкту
├── styles.css             # Загальні стилі
├── database/
│   └── schema.sql        # SQL схема бази даних
├── index.html            # Головна сторінка
├── appointment.html      # Сторінка запису на прийом
├── appointment.js        # JavaScript для форми запису
├── history.html          # Сторінка медичної історії
├── history.js            # JavaScript для завантаження записів
├── communication.html    # Сторінка комунікації
└── about.html            # Сторінка "Про нас"
```

## API Endpoints

### POST /api/appointments
Створення нового запису на прийом.

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_date": "2024-12-25T10:00:00",
  "appointment_type": "консультація",
  "notes": "Додаткові примітки"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Запис на прийом успішно створено",
  "data": { ... }
}
```

### GET /api/records/:patientId
Отримання медичних записів та рецептів для пацієнта.

**Response:**
```json
{
  "success": true,
  "data": {
    "medical_records": [ ... ],
    "prescriptions": [ ... ]
  }
}
```

## База даних

Проєкт використовує PostgreSQL з наступними таблицями:
- Patients (Пацієнти)
- Doctors (Лікарі)
- Appointments (Записи на прийом)
- MedicalRecords (Медичні записи)
- Prescriptions (Рецепти)
- Communication (Комунікації)

Всі таблиці мають правильні зв'язки через Foreign Keys.

## Примітки

- Для тестування потрібно створити тестові дані в базі (пацієнтів та лікарів)
- Змініть credentials в `server.js` якщо використовуєте інші дані для підключення до БД
- Всі сторінки перекладені українською мовою

