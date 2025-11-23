// Обробка форми запису на прийом

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointment-form');
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
            patient_id: parseInt(document.getElementById('patient_id').value),
            doctor_id: parseInt(document.getElementById('doctor_id').value),
            appointment_date: document.getElementById('appointment_date').value,
            appointment_type: document.getElementById('appointment_type').value || null,
            notes: document.getElementById('notes').value || null
        };

        // Валідація
        if (!formData.patient_id || !formData.doctor_id || !formData.appointment_date) {
            showAlert('Будь ласка, заповніть всі обов\'язкові поля', 'error');
            return;
        }

        try {
            // Відправка запиту на сервер
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showAlert(`✅ ${data.message}. ID запису: ${data.data.appointment_id}`, 'success');
                form.reset(); // Очищення форми
            } else {
                showAlert(`❌ Помилка: ${data.message || 'Не вдалося створити запис'}`, 'error');
            }
        } catch (error) {
            console.error('Помилка при відправці запиту:', error);
            showAlert('❌ Помилка з\'єднання з сервером. Перевірте, чи запущений сервер.', 'error');
        }
    });
});

