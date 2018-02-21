import marked from "marked"

export default function renderMarkdown(content) {
    return marked(content);
}