-- SQL скрипт для додавання кількох лікарів до бази даних
-- Виконайте цей скрипт в pgAdmin Query Tool або через psql

-- Додавання кількох лікарів різних спеціалізацій
INSERT INTO Doctors (first_name, last_name, specialization, phone, email) VALUES
('Марія', 'Іваненко', 'Терапевт', '+380501234567', 'maria.ivanenko@ehealth.ua'),
('Олександр', 'Петренко', 'Кардіолог', '+380502345678', 'oleksandr.petrenko@ehealth.ua'),
('Олена', 'Коваленко', 'Педіатр', '+380503456789', 'olena.kovalenko@ehealth.ua'),
('Володимир', 'Мельник', 'Невролог', '+380504567890', 'volodymyr.melnyk@ehealth.ua'),
('Наталія', 'Шевченко', 'Гінеколог', '+380505678901', 'natalia.shevchenko@ehealth.ua'),
('Андрій', 'Бондаренко', 'Ортопед', '+380506789012', 'andriy.bondarenko@ehealth.ua'),
('Тетяна', 'Ткаченко', 'Дерматолог', '+380507890123', 'tetyana.tkachenko@ehealth.ua'),
('Сергій', 'Морозенко', 'Офтальмолог', '+380508901234', 'serhiy.morozenko@ehealth.ua'),
('Ірина', 'Лисенко', 'Ендокринолог', '+380509012345', 'iryna.lysenko@ehealth.ua'),
('Дмитро', 'Романенко', 'Хірург', '+380500123456', 'dmytro.romanenko@ehealth.ua');

-- Перевірка доданих лікарів
SELECT doctor_id, first_name, last_name, specialization, phone, email 
FROM Doctors 
ORDER BY doctor_id;

