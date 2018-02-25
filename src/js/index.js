import main from "./view"

var entryPrefix = "#&";
var config = Object.assign({
    user: "",
    repo: "",
    path: "docs",
    base: "//api.github.com",
    entryPrefix: entryPrefix,
    entry: location.hash.replace(new RegExp("^" + entryPrefix), ""),
    cacheSize: 10,
    fileListEl: "#file-list",
    fileContentEl: "#file-content",
    headerEl: "#header",
}, CONFIG);

if (config.user == "") {
    config.user = location.hostname.split(".", 1)[0];
}

if (config.repo == "") {
    config.repo = location.pathname.split("/", 2)[1];
}

window.onhashchange = function () {
    if (location.hash.startsWith(entryPrefix)) {
        window.scrollTo(0, 0);
    }
}

main(config);