import Vue from "vue";
import util from "util";
import path from "path";
import ghAPI from "./github_api";
import renderMarkdown from "./markdown";
import Storage from "./storage"


function trimext (value) {
    return path.basename(value, path.extname(value));
};

function getItemByIndexOrNull(list, index) {
    if (list.length == 0) {
        return null;
    }
    if (index > list.length) {
        return null;
    }
    return list[index];
}

function makeEventBus() {
    return new Vue({
        data: {
            header: null,
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
                var file = this.fileList.currentItem;
                this.fileContent.refresh(file);
                this.fileContent.scrollToTop();
            },
            fileListSelectedDir(index) {

            },
            fileContentWillLoadIndex(index) {
                var self = this;
                if (!this.preloading && !this.fileList.loading && !this.fileContent.loading) {
                    var file = this.fileList.getavailableFileByIndex(index);
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

function makeFileListVue(meta, api, bus) {
    var vue = new Vue({
        el: meta.fileListEl,
        data: {
            meta: meta,
            fileList: [],
            index: null,
            api: api,
            bus: bus,
            loading: true,
            message: meta.loadingMessage,
            pattern: "",
        },
        computed: {
            currentItem() {
                return this.getfileByIndex(this.index);
            },
            availableFileList() {
                var fileList = [];
                var pattern = this.pattern.toLowerCase();
                for (var index in this.fileList) {
                    var file = this.fileList[index];
                    if (file.type === "dir" || file.name.startsWith(".")) {
                        continue;
                    }
                    if (file.name.toLowerCase().indexOf(pattern) >= 0) {
                        fileList.push(Object.assign({
                            title: trimext(file.name),
                            index: index,
                            number: fileList.length,
                        }, file));
                    }
                }
                return fileList;
            },
        },
        methods: {
            refresh(selectedName) {
                var self = this;
                self.loading = true;
                self.message = self.meta.loadingMessage;
                this.api.getRepoFiles((fileList) => {
                    self.fileList = fileList.filter(file => {
                        return file.name.search(self.meta.allowedExt) >= 0;
                    });
                    self.select(this.getIndexByTitle(selectedName) || 0);
                    self.loading = false;
                    self.message = "";
                    self.bus.fileListRefreshDone();
                }, (err) => {
                    self.message = err.message;
                    self.loading = false;
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
            getIndexByTitle(title) {
                for (const index in this.availableFileList) {
                    var file = this.availableFileList[index];
                    if (file.title == title) {
                        return file.index;
                    }
                }
                return null;
            },
            getfileByIndex(index) {
                return getItemByIndexOrNull(this.fileList, index);
            },
            getavailableFileByIndex(index) {
                return getItemByIndexOrNull(this.availableFileList, index);
            },
            preloadByIndex(index) {
                this.bus.fileContentWillLoadIndex(index);
            },
            applyPattern() {
                if (this.availableFileList.length === 0) {
                    return
                }
                var file = this.availableFileList[0];
                this.select(file.index);
            },
        },
    });
    return vue;
}

function makeContentVue(meta, api, bus) {
    var contentCache = Storage(meta.cacheSize);
    var vue = new Vue({
        el: meta.fileContentEl,
        data: {
            meta: meta,
            api: api,
            file: null,
            bus: bus,
            content: "",
            loading: true,
            message: meta.loadingMessage,
        },
        methods: {
            load(file, success_callback, err_callback) {
                var fileHash = util.format("file:%s", file.sha);
                var url = file.download_url;

                var content;

                var fetched = (data) => {
                    if (success_callback != undefined) {
                        success_callback(renderMarkdown(data));
                    }
                }
                content = contentCache.get(fileHash);
                if (content !== undefined) {
                    return fetched(content);
                }

                this.api.getFileContent(url, (data) => {
                    data = data.trim();
                    contentCache.set(fileHash, data);
                    fetched(data);
                }, (data) => {
                    if (err_callback != undefined) {
                        err_callback(data);
                    }
                });
            },
            scrollToTop() {
                this.$el.scrollTop = 0;
            },
            refresh(file) {
                this.file = file;

                if (this.file == null) {
                    return;
                }

                var self = this;
                self.loading = true;
                self.message = meta.loadingMessage;
                this.load(this.file, (content) => {
                    self.content = content;
                    self.loading = false;
                    self.message = "";
                    self.bus.fileContentRefreshDone();
                }, (err) => {
                    self.message = err.message;
                    self.loading = false;
                });
            },
        }
    });
    return vue;
}

function makeHeaderVue(el, meta) {
    return new Vue({
        el: el,
        data: {
            meta: meta,
            message: meta.loadingMessage,
        },
        mounted: function () {
            this.message = "";
        },
    });
}

export default function main(meta) {
    var vHeader = makeHeaderVue(meta.headerEl, meta);
    var api = new ghAPI(meta);
    var vBus = makeEventBus();
    var vFileList = makeFileListVue(meta, api, vBus);
    var vFileContent = makeContentVue(meta, api, vBus);

    vBus.header = vHeader;
    vBus.fileList = vFileList;
    vBus.fileContent = vFileContent;

    vFileList.refresh(meta.entry);
}