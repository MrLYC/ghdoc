import marked from "marked"
import highlight from "highlight.js"

highlight.initHighlightingOnLoad();
marked.setOptions({
    highlight: function (code, lang) {
        if (lang) {
            return highlight.highlight(lang, code, true).value;
        }
        return highlight.highlightAuto(code).value;
    },
});

export default function renderMarkdown(content) {
    return marked(content);
}