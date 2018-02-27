import queryString from "query-string"
import main from "./view"

const entryPrefix = "#/";
var meta = Object.assign({
    user: "",
    repo: "",
    path: "docs",
    base: "//api.github.com",
    entryPrefix: entryPrefix,
    entry: "readme.md",
    cacheSize: 10,
    fileListEl: "#file-list",
    fileContentEl: "#file-content",
    headerEl: "#header",
    allowedExt: /(md|markdown|mkd)$/,
}, META);
meta = Object.assign(meta, queryString.parse(location.search));

if (meta.user == "") {
    meta.user = location.hostname.split(".", 1)[0];
}

if (meta.repo == "") {
    meta.repo = location.pathname.split("/", 2)[1];
}

var entry = location.hash.replace(new RegExp("^" + entryPrefix), "");
if (entry !== "") {
    meta.entry = entry;
}

main(meta);
