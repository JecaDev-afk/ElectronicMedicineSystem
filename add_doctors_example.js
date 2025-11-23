// Приклад використання API для додавання кількох лікарів
// Можна виконати в консолі браузера або через Node.js

// Додавання одного лікаря
async function addSingleDoctor() {
    const response = await fetch('http://localhost:3000/api/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: 'Марія',
            last_name: 'Іваненко',
            specialization: 'Терапевт',
            phone: '+380501234567',
            email: 'maria.ivanenko@ehealth.ua'
        })
    });

    const data = await response.json();
    console.log(data);
}

// Додавання кількох лікарів одночасно
async function addMultipleDoctors() {
    const doctors = [
        {
            first_name: 'Олександр',
            last_name: 'Петренко',
            specialization: 'Кардіолог',
            phone: '+380502345678',
            email: 'oleksandr.petrenko@ehealth.ua'
        },
        {
            first_name: 'Олена',
            last_name: 'Коваленко',
            specialization: 'Педіатр',
            phone: '+380503456789',
            email: 'olena.kovalenko@ehealth.ua'
        },
        {
            first_name: 'Володимир',
            last_name: 'Мельник',
            specialization: 'Невролог',
            phone: '+380504567890',
            email: 'volodymyr.melnyk@ehealth.ua'
        }
    ];

    const response = await fetch('http://localhost:3000/api/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctors)
    });

    const data = await response.json();
    console.log(data);
}

// Використання:
// addSingleDoctor();
// addMultipleDoctors();

