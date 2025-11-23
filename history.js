// Обробка завантаження медичної історії

document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-records-btn');
    const patientIdInput = document.getElementById('patient-id-input');
    const recordsContainer = document.getElementById('records-container');
    const alertContainer = document.getElementById('alert-container');

    // Функція для відображення повідомлень
    function showAlert(message, type = 'success') {
        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
        
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    // Функція для форматування дати
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Функція для відображення медичних записів
    function displayRecords(data) {
        recordsContainer.innerHTML = '';

        // Відображення медичних записів
        if (data.medical_records && data.medical_records.length > 0) {
            const recordsCard = document.createElement('div');
            recordsCard.className = 'card';
            recordsCard.innerHTML = '<h2>📋 Медичні записи</h2>';

            const recordsTable = document.createElement('table');
            recordsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Лікар</th>
                        <th>Спеціалізація</th>
                        <th>Діагноз</th>
                        <th>Симптоми</th>
                        <th>Примітки</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.medical_records.map(record => `
                        <tr>
                            <td>${formatDate(record.record_date)}</td>
                            <td>${record.doctor_first_name} ${record.doctor_last_name}</td>
                            <td>${record.specialization}</td>
                            <td>${record.diagnosis || 'Не вказано'}</td>
                            <td>${record.symptoms || 'Не вказано'}</td>
                            <td>${record.treatment_notes || 'Немає'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            recordsCard.appendChild(recordsTable);
            recordsContainer.appendChild(recordsCard);
        } else {
            const noRecordsCard = document.createElement('div');
            noRecordsCard.className = 'card';
            noRecordsCard.innerHTML = '<p>Медичних записів не знайдено.</p>';
            recordsContainer.appendChild(noRecordsCard);
        }

        // Відображення рецептів
        if (data.prescriptions && data.prescriptions.length > 0) {
            const prescriptionsCard = document.createElement('div');
            prescriptionsCard.className = 'card';
            prescriptionsCard.innerHTML = '<h2>💊 Рецепти</h2>';

            const prescriptionsTable = document.createElement('table');
            prescriptionsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Дата призначення</th>
                        <th>Лікар</th>
                        <th>Спеціалізація</th>
                        <th>Ліки</th>
                        <th>Дозування</th>
                        <th>Частота</th>
                        <th>Тривалість</th>
                        <th>Інструкції</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.prescriptions.map(prescription => `
                        <tr>
                            <td>${formatDate(prescription.prescribed_date)}</td>
                            <td>${prescription.doctor_first_name} ${prescription.doctor_last_name}</td>
                            <td>${prescription.specialization}</td>
                            <td><strong>${prescription.medication_name}</strong></td>
                            <td>${prescription.dosage || 'Не вказано'}</td>
                            <td>${prescription.frequency || 'Не вказано'}</td>
                            <td>${prescription.duration || 'Не вказано'}</td>
                            <td>${prescription.instructions || 'Немає'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            prescriptionsCard.appendChild(prescriptionsTable);
            recordsContainer.appendChild(prescriptionsCard);
        } else {
            const noPrescriptionsCard = document.createElement('div');
            noPrescriptionsCard.className = 'card';
            noPrescriptionsCard.innerHTML = '<p>Рецептів не знайдено.</p>';
            recordsContainer.appendChild(noPrescriptionsCard);
        }
    }

    // Обробка натискання кнопки завантаження
    loadBtn.addEventListener('click', async () => {
        const patientId = parseInt(patientIdInput.value);

        if (!patientId || isNaN(patientId)) {
            showAlert('Будь ласка, введіть валідний ID пацієнта', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/records/${patientId}`);
            const result = await response.json();

            if (response.ok && result.success) {
                displayRecords(result.data);
                showAlert('Записи успішно завантажено', 'success');
            } else {
                showAlert(`Помилка: ${result.message || 'Не вдалося завантажити записи'}`, 'error');
                recordsContainer.innerHTML = '';
            }
        } catch (error) {
            console.error('Помилка при завантаженні записів:', error);
            showAlert('❌ Помилка з\'єднання з сервером. Перевірте, чи запущений сервер.', 'error');
            recordsContainer.innerHTML = '';
        }
    });

    // Можливість завантажити при натисканні Enter
    patientIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadBtn.click();
        }
    });
});

