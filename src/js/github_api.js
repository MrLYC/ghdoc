import jquery from "jquery"
import util from "util"
import path from "path"
import lru from "lru-cache"

export default function API(config) {
    var self = this;
    self.config = config;
    self.contentCache = lru(config.cacheSize);

    self.getRepoFiles = function (callback) {
        var url = util.format("%s/repos/%s/%s/contents/%s", config.base, config.user, config.repo, config.path);
        jquery.get(url, callback);
    }

    self.getFileContent = function (url, callback) {
        var content = self.contentCache.get(url);
        if (content == undefined) {
            jquery.get(url, function (content) {
                self.contentCache.set(url, content);
                callback(content);
            });
        } else {
            callback(content);
        }
    }
}