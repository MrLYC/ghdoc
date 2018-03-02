import main from "./view";

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
    loadingMessage: "Loading...",
    allowQueryString: true,
}, META);

var entry = location.hash.replace(new RegExp("^" + entryPrefix), "");
if (entry !== "") {
    meta.entry = entry;
}

if (meta.allowQueryString) {
    require(["query-string"], function (queryString) {
        meta = Object.assign(meta, queryString.parse(location.search));
        main(meta);
    })
} else {
    if (meta.user == "") {
        meta.user = location.hostname.split(".", 1)[0];
    }

    if (meta.repo == "") {
        meta.repo = location.pathname.split("/", 2)[1];
    }
    main(meta);
}