import main from "./view"

var entryPrefix = "#/";
var meta = Object.assign({
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
}, META);

if (meta.user == "") {
    meta.user = location.hostname.split(".", 1)[0];
}

if (meta.repo == "") {
    meta.repo = location.pathname.split("/", 2)[1];
}

main(meta);
