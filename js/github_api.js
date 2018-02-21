import jquery from "jquery"
import util from "util"

export function getRepoFiles(base, user, repo, path, callback) {
    var url = util.format("%s/repos/%s/%s/contents/%s", base, user, repo, path);
    jquery.get(url, callback);
}