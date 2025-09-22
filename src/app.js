const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'CI/CD Demo Application',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
    { id: 2, name: 'Анна Сидорова', email: 'anna@example.com' },
    { id: 3, name: 'Петр Иванов', email: 'petr@example.com' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: 'Имя и email обязательны'
    });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(newUser);
});

app.get('/api/calculate/:operation/:a/:b', (req, res) => {
  const { operation, a, b } = req.params;
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  
  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({
      error: 'Параметры должны быть числами'
    });
  }
  
  let result;
  switch (operation) {
    case 'add':
      result = numA + numB;
      break;
    case 'subtract':
      result = numA - numB;
      break;
    case 'multiply':
      result = numA * numB;
      break;
    case 'divide':
      if (numB === 0) {
        return res.status(400).json({
          error: 'Деление на ноль невозможно'
        });
      }
      result = numA / numB;
      break;
    default:
      return res.status(400).json({
        error: 'Неподдерживаемая операция'
      });
  }
  
  res.json({
    operation,
    operands: { a: numA, b: numB },
    result,
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint не найден',
    path: req.path,
    method: req.method
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступные endpoints:`);
    console.log(`  GET  / - информация о приложении`);
    console.log(`  GET  /health - статус здоровья`);
    console.log(`  GET  /api/users - список пользователей`);
    console.log(`  POST /api/users - создание пользователя`);
    console.log(`  GET  /api/calculate/:operation/:a/:b - калькулятор`);
  });
}

module.exports = app;
