# Инструкции по настройке Jenkins для CI/CD

## 1. Установка Jenkins

### Для Windows:

1. Скачайте Jenkins с официального сайта: https://jenkins.io/download/
2. Установите Java 11 или выше
3. Запустите установщик Jenkins
4. Откройте браузер и перейдите на http://localhost:8080
5. Следуйте мастеру настройки

### Альтернативный способ через Docker:

```bash
docker run -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

## 2. Первоначальная настройка

1. При первом запуске введите пароль администратора из файла:
   - Windows: `C:\Program Files\Jenkins\secrets\initialAdminPassword`
   - Docker: выполните `docker exec <container_id> cat /var/jenkins_home/secrets/initialAdminPassword`

2. Установите рекомендуемые плагины

3. Создайте учетную запись администратора

## 3. Необходимые плагины

Убедитесь, что установлены следующие плагины:
- Git plugin
- GitHub plugin
- NodeJS plugin
- Pipeline plugin
- HTML Publisher plugin
- Test Results Analyzer

### Установка плагинов:
1. Перейдите в "Manage Jenkins" > "Manage Plugins"
2. Во вкладке "Available" найдите нужные плагины
3. Установите и перезапустите Jenkins

## 4. Настройка инструментов

### NodeJS:
1. Перейдите в "Manage Jenkins" > "Global Tool Configuration"
2. В разделе "NodeJS" нажмите "Add NodeJS"
3. Укажите:
   - Name: Node 18
   - Version: NodeJS 18.x.x
   - Отметьте "Install automatically"

## 5. Создание Multibranch Pipeline Job

1. На главной странице нажмите "New Item"
2. Введите имя: `cicd-lab-project`
3. Выберите "Multibranch Pipeline"
4. Нажмите "OK"

### Настройка источника кода:
1. В разделе "Branch Sources" нажмите "Add source" > "Git"
2. Укажите URL вашего репозитория
3. При необходимости добавьте credentials для доступа к приватному репозиторию

### Настройка поведения сканирования:
1. В разделе "Scan Multibranch Pipeline Triggers" отметьте "Periodically if not otherwise run"
2. Установите интервал: 1 minute

### Настройка фильтров веток:
1. В разделе "Property strategy" выберите "All branches get the same properties"
2. Можно добавить фильтры для включения только нужных веток (main, dev, feature/*)

## 6. Webhook для автоматического запуска

### Настройка в GitHub:
1. Перейдите в настройки репозитория
2. Выберите "Webhooks" > "Add webhook"
3. Укажите Payload URL: `http://your-jenkins-url:8080/github-webhook/`
4. Content type: `application/json`
5. Выберите события: "Just the push event"

### Настройка в Jenkins:
1. В настройках job отметьте "GitHub hook trigger for GITScm polling"

## 7. Проверка настройки

1. Сделайте push в любую ветку
2. Проверьте, что Jenkins автоматически запустил сборку
3. Убедитесь, что тесты выполняются
4. Проверьте отчеты о покрытии кода

## 8. Мониторинг и отчеты

### Настройка отчетов о тестах:
Jenkins автоматически подхватит отчеты Jest из pipeline

### Настройка отчетов о покрытии:
HTML Publisher plugin будет публиковать отчеты покрытия из папки `coverage/`

## Troubleshooting

### Проблема: Jenkins не может найти npm/node
**Решение:** Убедитесь, что NodeJS плагин установлен и настроен в Global Tool Configuration

### Проблема: Webhook не срабатывает
**Решение:** 
1. Проверьте URL webhook
2. Убедитесь, что Jenkins доступен извне
3. Проверьте логи GitHub webhook

### Проблема: Тесты не выполняются
**Решение:**
1. Проверьте, что в Jenkinsfile указана правильная версия Node.js
2. Убедитесь, что зависимости устанавливаются корректно
3. Проверьте права доступа к файлам
