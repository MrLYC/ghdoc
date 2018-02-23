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
        },
        methods: {
            fileListRefreshDone() {
                this.fileContent.refresh(this.fileList.currentItem);
            },
            fileContentWillLoad(file, callback) {
                if (file != null) {
                    this.fileContent.load(file, callback);
                }
            },
            fileContentRefreshDone() {

            },
            fileListSelectedFile() {
                this.fileContent.refresh(this.fileList.currentItem);
            },
            fileListSelectedDir() {

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
            index: 0,
            api: api,
            bus: bus,
            preloading: false,
        },
        computed: {
            currentItem() {
                return this.getfileByIndex(this.index);
            },
        },
        methods: {
            refresh() {
                var self = this;
                this.api.getRepoFiles((fileList) => {
                    self.fileList = fileList;
                    self.index = 0;
                    self.bus.fileListRefreshDone();
                });
            },
            select(index) {
                if (this.index == index) {
                    return;
                }
                this.index = index;
                if (this.currentItem.type == "file") {
                    this.bus.fileListSelectedFile();
                } else if (this.currentItem.type == "dir") {
                    this.bus.fileListSelectedDir();
                }
            },
            preloadByIndex(index) {
                if (this.preloading) {
                    return;
                }
                var self = this;
                var file = this.getfileByIndex(index);
                if (file != null) {
                    self.preloading = true;
                    this.bus.fileContentWillLoad(file, function () {
                        self.preloading = false;
                    });
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
            }
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
        },
        methods: {
            load(file, callback) {
                var self = this;
                var url = file.download_url;
                var loaded = function (content) {
                    content = renderMarkdown(content);
                    fileCache.set(url, content);
                    if (callback != undefined) {
                        callback(content);
                    }
                }
                var content = fileCache.get(url);
                if (content == undefined) {
                    this.api.getFileContent(url, loaded);
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

                this.load(this.file, function (content) {
                    self.content = content;
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