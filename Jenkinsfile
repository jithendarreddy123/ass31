pipeline {
  agent any

  parameters {
    string(name: 'DOCKER_IMAGE_NAMESPACE', defaultValue: '', description: 'Optional Docker registry namespace, for example yourdockerhubuser')
    booleanParam(name: 'PUSH_DOCKER_IMAGES', defaultValue: false, description: 'Push Docker images from the main branch')
  }

  environment {
    DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Backend') {
      steps {
        dir('backend') {
          bat 'npm ci'
        }
      }
    }

    stage('Install Frontend') {
      steps {
        dir('frontend') {
          bat 'npm ci'
        }
      }
    }

    stage('Test') {
      parallel {
        stage('Backend') {
          steps {
            dir('backend') {
              bat 'npm test'
            }
          }
        }

        stage('Frontend') {
          steps {
            dir('frontend') {
              bat 'set CI=true&& npm test -- --watchAll=false --runInBand'
            }
          }
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat 'npm run build'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          def namespace = params.DOCKER_IMAGE_NAMESPACE?.trim()
          def prefix = namespace ? "${namespace}/" : ''
          env.BACKEND_IMAGE = "${prefix}lab27-backend:${env.BUILD_NUMBER}"
          env.FRONTEND_IMAGE = "${prefix}lab27-frontend:${env.BUILD_NUMBER}"
        }
        bat 'docker build -t "%BACKEND_IMAGE%" .\\backend'
        bat 'docker build -t "%FRONTEND_IMAGE%" .\\frontend'
      }
    }

    stage('Push Docker Images') {
      when {
        allOf {
          branch 'main'
          expression { params.PUSH_DOCKER_IMAGES }
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
          bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USER% --password-stdin'
          bat 'docker push "%BACKEND_IMAGE%"'
          bat 'docker push "%FRONTEND_IMAGE%"'
        }
      }
    }
  }

  post {
    always {
      bat 'docker logout || exit /b 0'
    }
  }
}
