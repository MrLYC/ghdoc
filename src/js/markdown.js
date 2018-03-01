import MarkdownIt from 'markdown-it';
import mkHighlight from 'markdown-it-highlightjs';

export default function renderMarkdown(content) {
    var render = new MarkdownIt({
        html: true,
    });
    render.use(mkHighlight);
    return render.render(content);
}