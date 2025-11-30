-- Тестовый пользователь для быстрого старта
INSERT INTO app_user (username, display_name, role, created_at, updated_at)
SELECT 'demo', 'Demo User', 'ANALYST', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
WHERE NOT EXISTS (SELECT 1 FROM app_user WHERE username = 'demo');
