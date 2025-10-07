pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_NAME = 'cicd-lab-project'
        PORT_DEV = '3001'
        PORT_PROD = '3000'
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
            when { branch 'dev' }
            steps {
                echo 'деплой в dev'
                bat '''
                chcp 65001 >nul
                setlocal
                set "NODE_ENV=development"
                set "PORT=%PORT_DEV%"
                start "" /B cmd /C "node src\\app.js >> app-dev.log 2>&1"
                endlocal
                '''


                bat '''
                set "NODE_ENV=development"
                set "PORT=%PORT_DEV%"
                start "" /B cmd /c "node src\\app.js >> app-dev.log 2>&1"
                '''
                bat 'powershell -Command "Start-Sleep -Seconds 3"'
                bat '''
                C:\\Windows\\System32\\curl.exe -sS http://localhost:%PORT_DEV%/health || echo приложение еще запускается
                '''
                echo 'dev deployment completed'
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                echo 'деплой в prod'
                bat '''
                chcp 65001 >nul
                setlocal
                set "NODE_ENV=production"
                set "PORT=%PORT_PROD%"
                start "" /B cmd /C "node src\\app.js >> app-prod.log 2>&1"
                endlocal
                '''


                bat '''
                set "NODE_ENV=production"
                set "PORT=%PORT_PROD%"
                start "" /B cmd /c "node src\\app.js >> app-prod.log 2>&1"
                '''
                bat 'powershell -Command "Start-Sleep -Seconds 3"'
                bat '''
                C:\\Windows\\System32\\curl.exe -sS http://localhost:%PORT_PROD%/health || echo приложение еще запускается
                '''
                echo 'production deployment completed'
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
