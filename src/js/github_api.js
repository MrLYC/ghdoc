import jquery from "jquery"
import util from "util"
import path from "path"

export default function API(config) {
    var self = this;
    self.config = config;

    self.getRepoFiles = function (callback) {
        var url = util.format("%s/repos/%s/%s/contents/%s", config.base, config.user, config.repo, config.path);
        jquery.get(url, callback);
    }

    self.getFileContent = function (url, callback) {
        jquery.get(url, callback);
    }
}