# Конфигурации Jenkins Jobs

## 1. Multibranch Pipeline (Рекомендуемый подход)

### Преимущества:
- Автоматическое создание job'ов для каждой ветки
- Единая конфигурация в Jenkinsfile
- Простое управление

### Настройка:
1. Создайте Multibranch Pipeline job
2. Укажите Git репозиторий
3. Jenkins автоматически найдет Jenkinsfile в корне проекта

## 2. Отдельные Job'ы для CI и CD (Альтернативный подход)

### CI Job для ветки dev

**Тип:** Pipeline

**Pipeline Script:**
```groovy
pipeline {
    agent any
    
    tools {
        nodejs "Node 18"
    }
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/your-username/your-repo.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                bat 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
    }
    
    post {
        success {
            echo 'CI прошел успешно!'
        }
        failure {
            echo 'CI завершился с ошибкой!'
        }
    }
}
```

### CD Job для ветки main

**Тип:** Pipeline

**Pipeline Script:**
```groovy
pipeline {
    agent any
    
    tools {
        nodejs "Node 18"
    }
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("cicd-demo-app:${env.BUILD_NUMBER}")
                    docker.withRegistry('', '') {
                        image.push("latest")
                        image.push("v1.0.${env.BUILD_NUMBER}")
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Деплой в production...'
                // Здесь можно добавить команды для деплоя
                bat 'echo "Приложение развернуто в production"'
            }
        }
    }
    
    post {
        success {
            echo 'CD прошел успешно! Приложение развернуто.'
        }
        failure {
            echo 'CD завершился с ошибкой!'
        }
    }
}
```

## 3. Настройка Branch Protection Rules

### В GitHub:
1. Перейдите в Settings > Branches
2. Добавьте правило для ветки `main`:
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Включите проверки от Jenkins

## 4. Настройка уведомлений

### Email уведомления:
1. В Manage Jenkins > Configure System
2. Настройте SMTP сервер
3. В job добавьте post action для отправки email

### Slack уведомления (если нужно):
1. Установите Slack Notification plugin
2. Настройте webhook URL
3. Добавьте уведомления в pipeline

## 5. Параметризованные сборки

### Пример с параметрами:
```groovy
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'production'],
            description: 'Environment to deploy'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run tests'
        )
    }
    
    stages {
        stage('Test') {
            when {
                params.RUN_TESTS == true
            }
            steps {
                bat 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo "Deploying to ${params.ENVIRONMENT}"
            }
        }
    }
}
```

## 6. Архивирование артефактов

### Добавьте в pipeline:
```groovy
post {
    always {
        archiveArtifacts artifacts: 'coverage/**/*', fingerprint: true
        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true, allowEmptyArchive: true
    }
}
```
