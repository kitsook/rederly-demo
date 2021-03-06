FRONTEND_SRC_TAG=v1.6.1
BACKEND_SRC_TAG=v1.6.2
RENDERER_SRC_TAG=v1.2.1
CONTAINER_REGISTRY_NAME=kitsook

init: clone_all build_all

###
clone_all: clone_frontend clone_backend clone_renderer

clone_frontend:
	git clone https://github.com/rederly/frontend.git frontend

clone_backend:
	git clone https://github.com/rederly/backend.git backend

clone_renderer:
	git clone https://github.com/rederly/renderer.git renderer

###
build_all: build_frontend_img build_backend_img build_renderer_img

build_frontend_img:
	cd frontend && git checkout "${FRONTEND_SRC_TAG}"
	cp deploy/frontend/.dockerignore frontend/.dockerignore
	cp deploy/frontend/Dockerfile frontend/Dockerfile
	cp deploy/frontend/nginx.conf frontend/nginx.conf
	cp deploy/frontend/HomePage.tsx frontend/src/Home/HomePage.tsx
	docker build -t ${CONTAINER_REGISTRY_NAME}/rederly_frontend:${FRONTEND_SRC_TAG} -t ${CONTAINER_REGISTRY_NAME}/rederly_frontend:latest frontend

build_backend_img:
	cd backend && git checkout "${BACKEND_SRC_TAG}"
	cp deploy/backend/.dockerignore backend/.dockerignore
	cp deploy/backend/Dockerfile backend/Dockerfile
	cp deploy/backend/startup.sh backend/startup.sh
	cp deploy/backend/demo-db-preload.ts backend/src/demo-db-preload.ts
	cd backend && touch .env
	docker build -t ${CONTAINER_REGISTRY_NAME}/rederly_backend:${BACKEND_SRC_TAG} -t ${CONTAINER_REGISTRY_NAME}/rederly_backend:latest backend

build_renderer_img:
	cd renderer && git checkout "${RENDERER_SRC_TAG}"
	cp deploy/renderer/Dockerfile renderer/Dockerfile
	docker build -t ${CONTAINER_REGISTRY_NAME}/rederly_renderer:${RENDERER_SRC_TAG} -t ${CONTAINER_REGISTRY_NAME}/rederly_renderer:latest renderer

###
push_images:
	docker push ${CONTAINER_REGISTRY_NAME}/rederly_frontend:$(FRONTEND_SRC_TAG)
	docker push ${CONTAINER_REGISTRY_NAME}/rederly_frontend:latest
	docker push ${CONTAINER_REGISTRY_NAME}/rederly_backend:$(BACKEND_SRC_TAG)
	docker push ${CONTAINER_REGISTRY_NAME}/rederly_backend:latest
	docker push ${CONTAINER_REGISTRY_NAME}/rederly_renderer:$(RENDERER_SRC_TAG)
	docker push ${CONTAINER_REGISTRY_NAME}/rederly_renderer:latest
