import jquery from "jquery"

export default function getRepo(callback) {
    jquery.get("https://api.github.com/users/MrLYC/repos", callback);
}