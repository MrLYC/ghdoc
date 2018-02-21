import jquery from "jquery"
import util from "util"
import path from "path"

export default function API(config) {
    this.config = config;

    this.getRepoFiles = function (callback) {
        var url = util.format("%s/repos/%s/%s/contents/%s", config.base, config.user, config.repo, config.path);
        jquery.get(url, callback);
    }

    this.getFileContent = function (url, callback) {
        jquery.get(url, callback);
    }
}