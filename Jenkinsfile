pipeline {
    agent any
    triggers {
        pollSCM('H/5 * * * *')
    }
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub') 
        IMAGE_NAME_SERVER = 'zaninaahlem/server' 
        IMAGE_NAME_CLIENT = 'zaninaahlem/web-app' 
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:ZaninaAhlem/DevOps.git',
                    credentialsId: '012799'
            }
        }

        stage('Build Server Image') {
            steps {
                dir('server') {
                    script {
                        dockerImageServer = docker.build("${IMAGE_NAME_SERVER}")
                    }
                }
            }
        }

        stage('Build Web App Image') {
            steps {
                dir('web-app') {
                    script {
                        dockerImageClient = docker.build("${IMAGE_NAME_CLIENT}")
                    }
                }
            }
        }

        stage('Scan Server Image') {
            steps {
                script {
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                        aquasec/trivy:latest image --exit-code 0 --severity LOW,MEDIUM,HIGH,CRITICAL \\
                        ${IMAGE_NAME_SERVER}
                    """
                }
            }
        }

        stage('Scan Client Image') {
            steps {
                script {
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                        aquasec/trivy:latest image --exit-code 0 --severity LOW,MEDIUM,HIGH,CRITICAL \\
                        ${IMAGE_NAME_CLIENT}
                    """
                }
            }
        }
        
        stage('Push Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                        sh '''
                            echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
                            docker push ${IMAGE_NAME_SERVER}
                            docker push ${IMAGE_NAME_CLIENT}
                        '''
                    }
                }
            }
        }
    }
}