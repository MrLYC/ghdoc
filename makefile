DISTDIR := dist
HTMLDIR := html
JSDIR := js
CSSDIR := css

.PHONY: build
build: ${DISTDIR}
	npm run build

${DISTDIR}:
	mkdir -p ${DISTDIR}

.PHONY: init
init:
	npm install

.PHONY: build-dev
build-dev:
	npm run build-dev

.PHONY: dev-server
dev-server:
	npm run dev-server