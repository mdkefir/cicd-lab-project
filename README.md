# CI/CD Demo Project

Демонстрационный проект для изучения CI/CD с Jenkins.

## Описание

Простое Node.js веб-приложение с REST API для демонстрации принципов CI/CD.

## Функциональность

- **GET /** - информация о приложении
- **GET /health** - проверка состояния
- **GET /api/users** - получение списка пользователей
- **POST /api/users** - создание нового пользователя
- **GET /api/stats** - статистика сервера и приложения
- **GET /api/calculate/:operation/:a/:b** - калькулятор (add, subtract, multiply, divide)

## Локальная разработка

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Запуск тестов
```bash
npm test
```

### Запуск тестов с отслеживанием изменений
```bash
npm run test:watch
```

## Docker

### Сборка образа
```bash
docker build -t cicd-demo-app .
```

### Запуск контейнера
```bash
docker run -p 3000:3000 cicd-demo-app
```

## CI/CD Pipeline

Проект настроен для работы с Jenkins и включает:

- **CI для ветки dev**: автоматические тесты при каждом push
- **CD для ветки main**: автоматический деплой после успешных тестов

### Структура веток

- **main** - production код, автоматический деплой
- **dev** - development код, автоматическое тестирование  
- **feature/*** - ветки для новых функций

## Архитектура тестирования

- Unit тесты с Jest
- Integration тесты с Supertest
- Покрытие кода
- HTML отчеты

## Мониторинг

- Health check endpoint: `/health`
- Логирование запросов
- Метрики производительности
