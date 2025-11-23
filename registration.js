// Обробка форми реєстрації пацієнта

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const alertContainer = document.getElementById('alert-container');

    // Функція для відображення повідомлень
    function showAlert(message, type = 'success') {
        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
        
        // Автоматично прибрати повідомлення через 5 секунд
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    // Обробка відправки форми
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Отримання даних з форми
        const formData = {
            first_name: document.getElementById('first_name').value.trim(),
            last_name: document.getElementById('last_name').value.trim(),
            date_of_birth: document.getElementById('date_of_birth').value,
            phone: document.getElementById('phone').value.trim() || null,
            email: document.getElementById('email').value.trim() || null,
            address: document.getElementById('address').value.trim() || null
        };

        // Валідація обов'язкових полів
        if (!formData.first_name || !formData.last_name || !formData.date_of_birth) {
            showAlert('Будь ласка, заповніть всі обов\'язкові поля', 'error');
            return;
        }

        // Валідація дати народження
        const birthDate = new Date(formData.date_of_birth);
        const today = new Date();
        if (birthDate > today) {
            showAlert('Дата народження не може бути в майбутньому', 'error');
            return;
        }

        try {
            // Відправка запиту на сервер
            const response = await fetch('http://localhost:3000/api/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const patientId = data.data.patient_id;
                showAlert(
                    `✅ Реєстрація успішна! Ваш ID пацієнта: <strong>${patientId}</strong><br>
                    Будь ласка, збережіть цей ID для подальшого використання.`, 
                    'success'
                );
                
                // Очищення форми
                form.reset();
                
                // Показати інформацію про наступні кроки
                setTimeout(() => {
                    alertContainer.innerHTML = `
                        <div class="alert alert-success">
                            <strong>Ваш ID пацієнта: ${patientId}</strong><br>
                            Тепер ви можете <a href="appointment.html" style="color: #155724; text-decoration: underline;">записатися на прийом</a> або 
                            <a href="history.html" style="color: #155724; text-decoration: underline;">переглянути медичну історію</a>.
                        </div>
                    `;
                }, 2000);
            } else {
                showAlert(`❌ Помилка: ${data.message || 'Не вдалося зареєструвати пацієнта'}`, 'error');
            }
        } catch (error) {
            console.error('Помилка при відправці запиту:', error);
            showAlert('❌ Помилка з\'єднання з сервером. Перевірте, чи запущений сервер.', 'error');
        }
    });
});

