DISTDIR := dist
HTMLDIR := src/html
JSDIR := src/js
CSSDIR := src/css
NPMENV := NODE_ENV=development
NPM := env ${NPMENV} npm

.PHONY: build
build: ${DISTDIR}
	${NPM} run build

${DISTDIR}:
	mkdir -p ${DISTDIR}

.PHONY: init
init:
	${NPM} install

.PHONY: build-dev
build-dev:
	${NPM} run build-dev

.PHONY: dev-server
dev-server:
	${NPM} run dev-server