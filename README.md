# Analyster

Минимальный бэкенд + SPA для работы аналитика с требованиями, user story, статьями и моделями.

## Запуск

1. Установите JDK 21+.
2. Задайте секрет HS256: переменная `ANALYSTER_JWT_SECRET` или свойство `analyster.jwt.secret` в `application.properties` (32+ символа). По умолчанию стоит заглушка `change-me-to-a-secure-secret-key-32-chars-min`.
3. Запустите:
   ```bash
   ./gradlew bootRun
   ```
   Приложение поднимется на `http://localhost:8080/`. Используется in-memory H2.

## Фронтенд

- SPA лежит в `src/main/resources/static/index.html`. При открытии `http://localhost:8080/` должна загрузиться страница (статические файлы разрешены в security).
- Для API нужен Bearer JWT (HS256). Форма входа умеет получить токен через `/auth/login` или принять готовый токен.
- Основные эндпоинты:
  - `/api/projects`
  - `/api/user-stories`
  - `/api/requirements`
  - `/api/articles`
  - `/api/models`
  - `/api/users`
  - `/auth/login` — получить JWT по username (демо, без пароля)

## Получить токен

POST `http://localhost:8080/auth/login`
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","displayName":"Demo User"}'
```
Ответ:
```json
{"tokenType":"Bearer","accessToken":"<JWT>","expiresInSeconds":14400}
```
Скопируйте `accessToken` в форму входа на SPA (поле "JWT токен" или используйте форму логина).

### Тестовые данные
- При старте поднимается пользователь `demo` (см. `src/main/resources/data.sql`):
  - username: `demo`
  - display_name: `Demo User`
  - role: `ANALYST`

## H2 консоль

- Доступна по `http://localhost:8080/h2-console`.
- JDBC URL: `jdbc:h2:mem:analyster`
- User: `sa`, пароль пустой.

## Если фронт не открывается

- Проверьте, что запущен `./gradlew bootRun`.
- Обновите страницу с очисткой кэша (Ctrl+F5).
- Убедитесь, что `SecurityConfig` не менялся и пути статики разрешены.
