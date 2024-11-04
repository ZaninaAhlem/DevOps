pipeline {
    environment {
        registryCredential = 'dockerhub'
        IMAGE_NAME = 'zaninaahlem/frontapp'
        PUSH_SUCCESS = 'false'  
    }
    agent any
    stages {
        stage('Cloning Git') {
            steps {
                checkout scm
            }
        }
        stage('Building image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}", "--platform linux/amd64 .")
                }
            }
        }
        stage('Vulnerability Scan') {
            steps {
                script {
                    sh "trivy image --severity HIGH,CRITICAL ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }
        stage('Deploy Image') {
            steps {
                script {
                    try {
                        docker.withRegistry('', registryCredential) {
                            docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push()
                            // Set the environment variable
                            sh "echo 'true' > .push_success"
                        }
                    } catch (Exception e) {
                        echo "Image push failed: ${e.getMessage()}"
                        sh "echo 'false' > .push_success"
                        error("Failed to push image to registry")
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}