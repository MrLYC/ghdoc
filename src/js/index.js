import main from "./view"

var config = Object.assign({
    user: "",
    repo: "",
    path: "docs",
    base: "//api.github.com",
    cacheSize: 10,
    fileListEl: "#file-list",
    fileContentEl: "#file-content",
    headerEl: "#header",
}, CONFIG);

if (config.user == "") {
    config.user = document.location.hostname.split(".", 1)[0];
}

if (config.repo == "") {
    config.repo = document.location.pathname.split("/", 2)[1];
}

main(config);