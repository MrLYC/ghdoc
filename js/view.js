import Vue from "vue"
import { getRepoFiles as getRepoFiles } from "./github_api"

export function makeFileListVue(el, config) {
    return new Vue({
        el: el,
        data: {
            fileList: [],
            config: config,
        },
        methods: {
            refresh: function() {
                var self = this;
                getRepoFiles(this.config.base, this.config.user, this.config.repo, this.config.path, (fileList) => {
                    self.fileList = fileList;
                });
            },
        },
    });
}

export default function main(el, config) {
    var vFileList = makeFileListVue(el, config);
    vFileList.refresh();
}