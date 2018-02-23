import main from "./view"

main({
    base: "http://api.github.com",
    user: "MrLYC",
    repo: "ghdoc-test",
    path: "",
    cacheSize: 10,
    fileListEl: "#file-list",
    fileContentEl: "#file-content",
    headerEl: "#header",
});