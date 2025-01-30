# Deplyoments

Listing out steps for local minikube deployment for client and server.

## Steps

1. Use minikube's docker environment: `eval $(minikube docker-env)`
2. Build the client image: `docker build -t marai-client-reactjs:latest ./client`
3. Build the backend image: `docker build -t marai-backend:latest ./backend`
4. Apply client deployment: `kubectl apply -f deployments/client.yml`
5. Apply backend deployment: `kubectl apply -f deployments/backend.yml`
6. Check running pods: `kubectl get pods`
7. Access services: `minikube service marai-client-service`, `minikube service marai-backend-service`
