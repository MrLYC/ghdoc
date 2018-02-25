import Vue from "vue"
import util from "util"
import path from "path"
import lru from "lru-cache"
import ghAPI from "./github_api"
import renderMarkdown from "./markdown"


Vue.filter("trimext", function (value) {
    return path.basename(value, path.extname(value));
});

function makeEventBus() {
    return new Vue({
        data: {
            fileList: null,
            fileContent: null,
            preloading: false,
        },
        methods: {
            fileListRefreshDone() {

            },
            fileContentRefreshDone() {

            },
            fileListSelectedFile(index) {
                this.fileContent.refresh(this.fileList.currentItem);
                this.fileContentWillLoadIndex(index + 1);
            },
            fileListSelectedDir(index) {

            },
            fileContentWillLoadIndex(index) {
                var self = this;
                if (!this.preloading && !this.fileList.loading && !this.fileContent.loading) {
                    var file = this.fileList.getfileByIndex(index);
                    if (file != null) {
                        this.fileContent.load(file, function () {
                            self.preloading = false;
                        });
                    }
                }
            },
        }
    });
}

function makeFileListVue(config, api, bus) {
    var vue = new Vue({
        el: config.fileListEl,
        data: {
            config: config,
            fileList: null,
            index: null,
            api: api,
            bus: bus,
            loading: true,
        },
        computed: {
            currentItem() {
                return this.getfileByIndex(this.index);
            },
        },
        methods: {
            refresh() {
                var self = this;
                self.loading = true;
                this.api.getRepoFiles((fileList) => {
                    self.fileList = fileList;
                    self.select(0);
                    self.loading = false;
                    self.bus.fileListRefreshDone();
                });
            },
            select(index) {
                if (this.index == index) {
                    return;
                }
                this.index = index;
                if (this.currentItem.type == "file") {
                    this.bus.fileListSelectedFile(index);
                } else if (this.currentItem.type == "dir") {
                    this.bus.fileListSelectedDir(index);
                }
            },
            getfileByIndex(index) {
                if (this.fileList.length == 0) {
                    return null;
                }
                if (index > this.fileList.length) {
                    return null;
                }
                return this.fileList[index];
            },
            preloadByIndex(index) {
                this.bus.fileContentWillLoadIndex(index);
            },
        },
    });
    return vue;
}

function makeContentVue(config, api, bus) {
    var fileCache = lru(config.cacheSize);
    var vue = new Vue({
        el: config.fileContentEl,
        data: {
            config: config,
            api: api,
            file: null,
            bus: bus,
            content: "",
            loading: true,
        },
        methods: {
            load(file, callback) {
                var self = this;
                var url = file.download_url;
                var loaded = function (content) {
                    fileCache.set(url, content);
                    if (callback != undefined) {
                        callback(content);
                    }
                }
                var content = fileCache.get(url);
                if (content == undefined) {
                    this.api.getFileContent(url, function (content) {
                        loaded(renderMarkdown(content.trim()));
                    });
                } else {
                    loaded(content);
                }
            },
            refresh(file) {
                var self = this;
                this.file = file;

                if (this.file == null) {
                    return;
                }

                self.loading = true;
                this.load(this.file, function (content) {
                    self.content = content;
                    self.loading = false;
                    self.bus.fileContentRefreshDone();
                });
            },
        }
    });
    return vue;
}

function makeHeaderVue(el, config) {
    return new Vue({
        el: el,
        data: {
            config: config,
        }
    })
}

export default function main(config) {
    var vHeader = makeHeaderVue(config.headerEl, config);
    var api = new ghAPI(config);
    var vBus = makeEventBus();
    var vFileList = makeFileListVue(config, api, vBus);
    var vFileContent = makeContentVue(config, api, vBus);

    vBus.fileList = vFileList;
    vBus.fileContent = vFileContent;

    vFileList.refresh();
}