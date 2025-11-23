const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для парсингу JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статичні файли (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Конфігурація підключення до PostgreSQL
const pool = new Pool({
    user: 'postgres',
    password: '956400',
    host: 'localhost',
    database: 'e_health_db',
    port: 5432,
});

// Перевірка підключення до бази даних
pool.connect()
    .then(() => {
        console.log('✅ Успішно підключено до PostgreSQL!');
    })
    .catch(err => {
        console.error('❌ Помилка підключення до БД:', err.message);
    });

// API Endpoint: POST /api/appointments
// Створення нового запису на прийом
app.post('/api/appointments', async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, appointment_type, notes } = req.body;

        // Валідація обов'язкових полів
        if (!patient_id || !doctor_id || !appointment_date) {
            return res.status(400).json({
                success: false,
                message: 'Необхідно вказати patient_id, doctor_id та appointment_date'
            });
        }

        // Вставка даних в таблицю Appointments
        const result = await pool.query(
            `INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_type, notes, status)
             VALUES ($1, $2, $3, $4, $5, 'заплановано')
             RETURNING *`,
            [patient_id, doctor_id, appointment_date, appointment_type || null, notes || null]
        );

        res.status(201).json({
            success: true,
            message: 'Запис на прийом успішно створено',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Помилка при створенні запису:', error);
        res.status(500).json({
            success: false,
            message: 'Помилка сервера при створенні запису',
            error: error.message
        });
    }
});

// API Endpoint: POST /api/patients
// Реєстрація нового пацієнта
app.post('/api/patients', async (req, res) => {
    try {
        const { first_name, last_name, date_of_birth, phone, email, address } = req.body;

        // Валідація обов'язкових полів
        if (!first_name || !last_name || !date_of_birth) {
            return res.status(400).json({
                success: false,
                message: 'Необхідно вказати first_name, last_name та date_of_birth'
            });
        }

        // Вставка даних в таблицю Patients
        const result = await pool.query(
            `INSERT INTO Patients (first_name, last_name, date_of_birth, phone, email, address)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [first_name, last_name, date_of_birth, phone || null, email || null, address || null]
        );

        res.status(201).json({
            success: true,
            message: 'Пацієнта успішно зареєстровано',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Помилка при реєстрації пацієнта:', error);
        res.status(500).json({
            success: false,
            message: 'Помилка сервера при реєстрації пацієнта',
            error: error.message
        });
    }
});

// API Endpoint: POST /api/doctors
// Додавання нового лікаря (можна додавати кілька)
app.post('/api/doctors', async (req, res) => {
    try {
        const doctors = Array.isArray(req.body) ? req.body : [req.body];
        const results = [];
        const errors = [];

        for (const doctor of doctors) {
            const { first_name, last_name, specialization, phone, email } = doctor;

            // Валідація обов'язкових полів
            if (!first_name || !last_name || !specialization) {
                errors.push({
                    doctor: doctor,
                    error: 'Необхідно вказати first_name, last_name та specialization'
                });
                continue;
            }

            try {
                const result = await pool.query(
                    `INSERT INTO Doctors (first_name, last_name, specialization, phone, email)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING *`,
                    [first_name, last_name, specialization, phone || null, email || null]
                );
                results.push(result.rows[0]);
            } catch (error) {
                errors.push({
                    doctor: doctor,
                    error: error.message
                });
            }
        }

        if (results.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Не вдалося додати жодного лікаря',
                errors: errors
            });
        }

        res.status(201).json({
            success: true,
            message: `Успішно додано ${results.length} лікарів`,
            data: results,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Помилка при додаванні лікарів:', error);
        res.status(500).json({
            success: false,
            message: 'Помилка сервера при додаванні лікарів',
            error: error.message
        });
    }
});

// API Endpoint: GET /api/records/:patientId
// Отримання медичних записів та рецептів для конкретного пацієнта
app.get('/api/records/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId);

        if (isNaN(patientId)) {
            return res.status(400).json({
                success: false,
                message: 'Невірний ID пацієнта'
            });
        }

        // Отримання медичних записів з інформацією про лікаря
        const medicalRecordsQuery = `
            SELECT 
                mr.record_id,
                mr.diagnosis,
                mr.symptoms,
                mr.treatment_notes,
                mr.record_date,
                d.first_name as doctor_first_name,
                d.last_name as doctor_last_name,
                d.specialization
            FROM MedicalRecords mr
            JOIN Doctors d ON mr.doctor_id = d.doctor_id
            WHERE mr.patient_id = $1
            ORDER BY mr.record_date DESC
        `;

        // Отримання рецептів з інформацією про лікаря
        const prescriptionsQuery = `
            SELECT 
                p.prescription_id,
                p.medication_name,
                p.dosage,
                p.frequency,
                p.duration,
                p.instructions,
                p.prescribed_date,
                d.first_name as doctor_first_name,
                d.last_name as doctor_last_name,
                d.specialization
            FROM Prescriptions p
            JOIN Doctors d ON p.doctor_id = d.doctor_id
            WHERE p.patient_id = $1
            ORDER BY p.prescribed_date DESC
        `;

        const [medicalRecordsResult, prescriptionsResult] = await Promise.all([
            pool.query(medicalRecordsQuery, [patientId]),
            pool.query(prescriptionsQuery, [patientId])
        ]);

        res.json({
            success: true,
            data: {
                medical_records: medicalRecordsResult.rows,
                prescriptions: prescriptionsResult.rows
            }
        });

    } catch (error) {
        console.error('Помилка при отриманні записів:', error);
        res.status(500).json({
            success: false,
            message: 'Помилка сервера при отриманні записів',
            error: error.message
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порті ${PORT}`);
    console.log(`📋 Відкрийте браузер: http://localhost:${PORT}`);
});
