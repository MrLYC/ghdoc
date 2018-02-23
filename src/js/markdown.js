import marked from "marked"
import highlight from "highlight.js"

highlight.initHighlightingOnLoad();
marked.setOptions({
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
    },
});

export default function renderMarkdown(content) {
    return marked(content);
}