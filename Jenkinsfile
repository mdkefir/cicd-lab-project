pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_NAME = 'cicd-lab-project'
        DOCKER_IMAGE = 'cicd-demo-app'
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
                bat 'docker build -t %DOCKER_IMAGE%:dev .'
                bat 'echo "Dev deployment completed"'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Деплой в production...'
                bat 'echo "Развертывание в production среде"'
                bat 'docker build -t %DOCKER_IMAGE%:latest .'
                bat 'docker build -t %DOCKER_IMAGE%:v1.0.%BUILD_NUMBER% .'
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
