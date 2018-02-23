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
        },
        computed: {
            currentItem() {
                if (this.fileList.length == 0) {
                    return null;
                }
                if (this.index > this.fileList.length) {
                    this.index = 0;
                }
                return this.fileList[this.index];
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
            refresh(file) {
                var self = this;
                this.file = file;

                if (this.file == null) {
                    return;
                }

                var url = this.file.download_url;
                var callback = function (content) {
                    self.content = renderMarkdown(content);
                    fileCache.set(url, self.content);
                    self.bus.fileContentRefreshDone();
                }

                var content = fileCache.get(url);
                if (content == undefined) {
                    this.api.getFileContent(url, callback);
                } else {
                    callback(content);
                }
            }
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