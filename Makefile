install_client_dependencies:
	npm i

install_api_dependencies:
	cd api && npm i

run_api:
	cd api && npm start &

run_webapp:
	npm run serve

run_app: install_client_dependencies install_api_dependencies run_api run_webapp
