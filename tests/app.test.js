const request = require('supertest');
const app = require('../src/app');

describe('CI/CD Demo Application', () => {
  describe('GET /', () => {
    it('должен возвращать информацию о приложении', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'CI/CD Demo Application');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /health', () => {
    it('должен возвращать статус здоровья', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('GET /api/users', () => {
    it('должен возвращать список пользователей', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  describe('POST /api/users', () => {
    it('должен создавать нового пользователя', async () => {
      const newUser = {
        name: 'Тестовый Пользователь',
        email: 'test@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newUser.name);
      expect(response.body).toHaveProperty('email', newUser.email);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('должен возвращать ошибку при отсутствии обязательных полей', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/calculate/:operation/:a/:b', () => {
    it('должен выполнять сложение', async () => {
      const response = await request(app).get('/api/calculate/add/5/3');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 8);
      expect(response.body).toHaveProperty('operation', 'add');
      expect(response.body.operands).toEqual({ a: 5, b: 3 });
    });

    it('должен выполнять вычитание', async () => {
      const response = await request(app).get('/api/calculate/subtract/10/4');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 6);
      expect(response.body).toHaveProperty('operation', 'subtract');
    });

    it('должен выполнять умножение', async () => {
      const response = await request(app).get('/api/calculate/multiply/6/7');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 42);
      expect(response.body).toHaveProperty('operation', 'multiply');
    });

    it('должен выполнять деление', async () => {
      const response = await request(app).get('/api/calculate/divide/15/3');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 5);
      expect(response.body).toHaveProperty('operation', 'divide');
    });

    it('должен возвращать ошибку при делении на ноль', async () => {
      const response = await request(app).get('/api/calculate/divide/10/0');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Деление на ноль невозможно');
    });

    it('должен возвращать ошибку при неподдерживаемой операции', async () => {
      const response = await request(app).get('/api/calculate/power/2/3');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Неподдерживаемая операция');
    });

    it('должен возвращать ошибку при некорректных числах', async () => {
      const response = await request(app).get('/api/calculate/add/abc/def');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Параметры должны быть числами');
    });
  });

  describe('404 handler', () => {
    it('должен возвращать 404 для несуществующих путей', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Endpoint не найден');
      expect(response.body).toHaveProperty('path', '/nonexistent');
      expect(response.body).toHaveProperty('method', 'GET');
    });
  });
});
