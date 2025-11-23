# Інструкція: Перегляд бази даних в pgAdmin

## Крок 1: Відкриття pgAdmin

1. Запустіть **pgAdmin 4** на вашому комп'ютері
2. Введіть master password (якщо потрібно)

## Крок 2: Підключення до сервера PostgreSQL

1. У лівій панелі знайдіть **"Servers"**
2. Клікніть правою кнопкою миші на **"Servers"** → **"Create"** → **"Server..."**
3. У вікні **"Create - Server"** заповніть:

### Вкладка "General":
- **Name**: `e-Health Local` (або будь-яка назва)

### Вкладка "Connection":
- **Host name/address**: `localhost`
- **Port**: `5432`
- **Maintenance database**: `postgres` (або `e_health_db` якщо вже створена)
- **Username**: `postgres`
- **Password**: `956400` (ваш пароль)
- ✅ Поставте галочку **"Save password"** (опціонально)

4. Натисніть **"Save"**

## Крок 3: Створення бази даних (якщо ще не створена)

1. Розгорніть ваш сервер → **"Databases"**
2. Клікніть правою кнопкою на **"Databases"** → **"Create"** → **"Database..."**
3. У полі **"Database"** введіть: `e_health_db`
4. Натисніть **"Save"**

## Крок 4: Виконання SQL скрипту для створення таблиць

1. Розгорніть базу даних `e_health_db`
2. Клікніть правою кнопкою на **"e_health_db"** → **"Query Tool"**
3. Відкрийте файл `database/schema.sql` у текстовому редакторі
4. Скопіюйте весь SQL код з файлу
5. Вставте в Query Tool
6. Натисніть кнопку **"Execute"** (▶️) або `F5`
7. Перевірте, що в панелі повідомлень з'явилося: `Query returned successfully`

## Крок 5: Перегляд таблиць

### Варіант 1: Через дерево об'єктів

1. Розгорніть `e_health_db` → **"Schemas"** → **"public"** → **"Tables"**
2. Ви побачите всі 6 таблиць:
   - `patients`
   - `doctors`
   - `appointments`
   - `medicalrecords`
   - `prescriptions`
   - `communication`

3. Для перегляду даних:
   - Клікніть правою кнопкою на таблицю (наприклад, `patients`)
   - Оберіть **"View/Edit Data"** → **"All Rows"**

### Варіант 2: Через Query Tool (SQL запити)

1. Клікніть правою кнопкою на `e_health_db` → **"Query Tool"**
2. Введіть SQL запит, наприклад:

```sql
-- Перегляд всіх пацієнтів
SELECT * FROM Patients;

-- Перегляд всіх лікарів
SELECT * FROM Doctors;

-- Перегляд всіх записів на прийом
SELECT * FROM Appointments;

-- Перегляд медичних записів
SELECT * FROM MedicalRecords;

-- Перегляд рецептів
SELECT * FROM Prescriptions;

-- Перегляд комунікацій
SELECT * FROM Communication;
```

3. Натисніть **"Execute"** (▶️) або `F5`

## Крок 6: Перевірка структури таблиць

1. Клікніть правою кнопкою на таблицю → **"Properties"**
2. Перейдіть на вкладку **"Columns"** щоб побачити всі поля
3. Перейдіть на вкладку **"Constraints"** щоб побачити Foreign Keys

## Корисні SQL запити для тестування

### Додавання тестових даних:

```sql
-- Додати тестового пацієнта
INSERT INTO Patients (first_name, last_name, date_of_birth, phone, email)
VALUES ('Іван', 'Петренко', '1990-05-15', '+380501234567', 'ivan@example.com');

-- Додати тестового лікаря
INSERT INTO Doctors (first_name, last_name, specialization, phone, email)
VALUES ('Марія', 'Іваненко', 'Терапевт', '+380507654321', 'maria@example.com');

-- Перевірити ID створених записів
SELECT patient_id, first_name, last_name FROM Patients;
SELECT doctor_id, first_name, last_name, specialization FROM Doctors;
```

### Перегляд зв'язаних даних:

```sql
-- Записи на прийом з іменами пацієнтів та лікарів
SELECT 
    a.appointment_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    d.first_name || ' ' || d.last_name AS doctor_name,
    d.specialization,
    a.appointment_date,
    a.status
FROM Appointments a
JOIN Patients p ON a.patient_id = p.patient_id
JOIN Doctors d ON a.doctor_id = d.doctor_id;
```

## Розв'язання проблем

### Помилка підключення:
- Перевірте, чи запущений PostgreSQL сервіс
- Перевірте правильність пароля та username
- Перевірте, чи порт 5432 не заблокований файрволом

### Таблиці не відображаються:
- Переконайтеся, що ви виконали SQL скрипт `schema.sql`
- Перевірте, що ви переглядаєте схему `public`
- Оновіть дерево об'єктів (клік правою кнопкою → Refresh)

### Помилка при виконанні SQL:
- Перевірте, що база даних `e_health_db` створена
- Переконайтеся, що ви підключені до правильної бази даних

