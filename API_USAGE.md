# Інструкція з використання API

## Реєстрація пацієнта

### POST /api/patients

**Приклад через curl:**

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Іван",
    "last_name": "Петренко",
    "date_of_birth": "1990-05-15",
    "phone": "+380501234567",
    "email": "ivan@example.com",
    "address": "м. Київ, вул. Хрещатик, 1"
  }'
```

**Приклад через JavaScript (fetch):**

```javascript
const response = await fetch("http://localhost:3000/api/patients", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    first_name: "Іван",
    last_name: "Петренко",
    date_of_birth: "1990-05-15",
    phone: "+380501234567",
    email: "ivan@example.com",
    address: "м. Київ, вул. Хрещатик, 1",
  }),
});

const data = await response.json();
console.log(data);
```

**Відповідь:**

```json
{
  "success": true,
  "message": "Пацієнта успішно зареєстровано",
  "data": {
    "patient_id": 1,
    "first_name": "Іван",
    "last_name": "Петренко",
    ...
  }
}
```

## Додавання лікарів

### POST /api/doctors

**Додавання одного лікаря:**

```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Марія",
    "last_name": "Іваненко",
    "specialization": "Терапевт",
    "phone": "+380501234567",
    "email": "maria@example.com"
  }'
```

**Додавання кількох лікарів одночасно:**

```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '[
    {
      "first_name": "Олександр",
      "last_name": "Петренко",
      "specialization": "Кардіолог",
      "phone": "+380502345678",
      "email": "oleksandr@example.com"
    },
    {
      "first_name": "Олена",
      "last_name": "Коваленко",
      "specialization": "Педіатр",
      "phone": "+380503456789",
      "email": "olena@example.com"
    }
  ]'
```

**Приклад через JavaScript:**

```javascript
// Один лікар
const response1 = await fetch("http://localhost:3000/api/doctors", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    first_name: "Марія",
    last_name: "Іваненко",
    specialization: "Терапевт",
    phone: "+380501234567",
    email: "maria@example.com",
  }),
});

// Кілька лікарів
const response2 = await fetch("http://localhost:3000/api/doctors", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify([
    {
      first_name: "Олександр",
      last_name: "Петренко",
      specialization: "Кардіолог",
      phone: "+380502345678",
      email: "oleksandr@example.com",
    },
    {
      first_name: "Олена",
      last_name: "Коваленко",
      specialization: "Педіатр",
      phone: "+380503456789",
      email: "olena@example.com",
    },
  ]),
});
```

**Відповідь:**

```json
{
  "success": true,
  "message": "Успішно додано 2 лікарів",
  "data": [
    {
      "doctor_id": 1,
      "first_name": "Олександр",
      ...
    },
    {
      "doctor_id": 2,
      "first_name": "Олена",
      ...
    }
  ]
}
```

## Альтернативний спосіб: SQL скрипт

Найпростіший спосіб додати кілька лікарів - використати SQL скрипт:

1. Відкрийте pgAdmin
2. Підключіться до бази `e_health_db`
3. Відкрийте Query Tool
4. Скопіюйте вміст файлу `database/insert_doctors.sql`
5. Виконайте скрипт (F5)

Це додасть 10 тестових лікарів різних спеціалізацій.
