all: check-coverage lint build
check-coverage: test
	CI=true yarn cover
lint: format
	yarn lint
build: node_modules
	yarn build
test: node_modules
	CI=true yarn test
check-format: node_modules
	yarn check-format
format: node_modules
	yarn format
cover: node_modules
	yarn cover
start: node_modules
	yarn start
serve-build: build
	yarn serve-build
install: node_modules
node_modules: package.json
	yarn
	touch $@

.PHONY: test lint format check-coverage build cover start install
