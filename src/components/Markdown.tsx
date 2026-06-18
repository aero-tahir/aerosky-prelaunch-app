import React from 'react';

interface MarkdownProps {
  content?: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into blocks by double newlines
  const blocks = content.split(/\n\n+/);

  return (
    <div className={`space-y-4 text-sky-200/80 leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code Blocks
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const codeLines = lines.slice(1, lines.length - 1).join('\n');
          return (
            <pre key={i} className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 overflow-x-auto my-4">
              <code>{codeLines}</code>
            </pre>
          );
        }

        // Headings
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={i} className="text-2xl sm:text-3xl font-bold text-white mt-6 mb-3">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="text-xl sm:text-2xl font-bold text-white mt-5 mb-2">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="text-lg sm:text-xl font-bold text-white mt-4 mb-2">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Lists (Unordered)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').map(item => item.replace(/^[-*]\s+/, ''));
          return (
            <ul key={i} className="list-disc list-inside space-y-1.5 pl-4 text-sky-200/85">
              {items.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
              ))}
            </ul>
          );
        }

        // Lists (Ordered)
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s+/, ''));
          return (
            <ol key={i} className="list-decimal list-inside space-y-1.5 pl-4 text-sky-200/85">
              {items.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
              ))}
            </ol>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '').trim();
          return (
            <blockquote key={i} className="pl-4 border-l-2 border-amber-500/40 italic text-sky-200/70 my-3">
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(quoteText) }} />
            </blockquote>
          );
        }

        // Normal Paragraph
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }} />
        );
      })}
    </div>
  );
};

function parseInlineMarkdown(text: string): string {
  if (!text) return '';

  // Escape HTML entities to prevent raw injection, keeping code tags intact
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Inline code: `code`
  html = html.replace(/`(.*?)`/g, '<code class="bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs text-amber-400">$1</code>');
  
  // Links: [text](url)
  // Let's decode html entities for links so we can match them
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    // Replace URL entities back
    const decodedUrl = url.replace(/&amp;/g, '&');
    return `<a href="${decodedUrl}" class="text-amber-400 hover:text-amber-300 underline font-medium transition-colors" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });

  return html;
}

export default Markdown;
