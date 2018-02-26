DISTDIR := dist
HTMLDIR := src/html
JSDIR := src/js
CSSDIR := src/css
NPM := env NODE_ENV=production npm
DEVNPM := env NODE_ENV=development npm

.PHONY: build
build: ${DISTDIR}
	rm -rf "${DISTDIR}"/* || true
	${NPM} run build

${DISTDIR}:
	mkdir -p ${DISTDIR}

.PHONY: init
init:
	${DEVNPM} install

.PHONY: build-dev
build-dev:
	${DEVNPM} run build-dev

.PHONY: dev-server
dev-server:
	${DEVNPM} run dev-server

.PHONY: display-modules
display-modules:
	webpack --display-modules --sort-modules-by size