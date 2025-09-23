pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_NAME = 'cicd-lab-project'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Получение кода из репозитория...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Установка зависимостей...'
                bat 'npm ci'
            }
        }
        
        stage('Lint & Code Quality') {
            steps {
                echo 'Проверка качества кода...'
                bat 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Запуск тестов...'
                bat 'npm test'
            }
            post {
                always {
                    echo 'Тесты завершены. Отчеты доступны в папке coverage/'
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Сборка приложения...'
                bat 'npm run build'
            }
        }
        
        stage('Deploy to Dev') {
            when {
                branch 'dev'
            }
            steps {
                echo 'Деплой в dev окружение...'
                bat 'echo "Развертывание в dev среде"'
                bat 'echo "Остановка предыдущего процесса..."'
                bat 'taskkill /F /IM node.exe 2>nul || echo "Нет запущенных процессов"'
                bat 'set NODE_ENV=development'
                bat 'echo "Запуск приложения на порту 3001..."'
                bat 'start /B node src/app.js'
                bat 'ping 127.0.0.1 -n 4 >nul'
                bat 'echo "Приложение запущено! Проверка доступности..."'
                bat 'curl -s http://localhost:3001/health || echo "Приложение еще запускается..."'
                bat 'echo "Dev deployment completed"'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
               echo 'Деплой в prod окружение...'
                bat 'echo "Развертывание в prod среде"'
                bat 'echo "Остановка предыдущего процесса..."'
                bat 'taskkill /F /IM node.exe 2>nul || echo "Нет запущенных процессов"'
                bat 'set NODE_ENV=production'
                bat 'echo "Запуск приложения на порту 3000..."'
                bat 'start /B node src/app.js'
                bat 'ping 127.0.0.1 -n 4 >nul'
                bat 'echo "Приложение запущено! Проверка доступности..."'
                bat 'curl -s http://localhost:3000/health || echo "Приложение еще запускается..."'
                bat 'echo "Production deployment completed"'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline завершен'
        }
        success {
            echo 'Pipeline выполнен успешно!'
        }
        failure {
            echo 'Pipeline завершился с ошибкой!'
        }
    }
}
