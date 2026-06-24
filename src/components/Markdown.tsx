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
    <div className={`space-y-5 text-sky-200/80 leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code Blocks
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const codeLines = lines.slice(1, lines.length - 1).join('\n');
          return (
            <pre key={i} className="bg-sky-900/40 p-4 rounded-2xl border border-white/[0.05] font-mono text-xs text-emerald-400 overflow-x-auto my-6 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]">
              <code>{codeLines}</code>
            </pre>
          );
        }

        // Headings
        if (trimmed.startsWith('# ')) {
          const text = trimmed.replace('# ', '').trim();
          return (
            <h1 key={i} className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 tracking-tight">
              {text}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          const text = trimmed.replace('## ', '').trim();
          const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
          const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <h2 key={i} id={id} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2 scroll-mt-24">
              {text}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace('### ', '').trim();
          const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
          const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <h3 key={i} id={id} className="text-lg sm:text-xl font-bold text-white mt-6 mb-3 scroll-mt-24">
              {text}
            </h3>
          );
        }

        // Lists (Unordered)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').map(item => item.replace(/^[-*]\s+/, ''));
          return (
            <ul key={i} className="list-none space-y-2.5 pl-6 my-5 text-sky-200/85">
              {items.map((item, idx) => (
                <li key={idx} className="relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-saffron before:rounded-full before:absolute before:-left-5 before:top-2.5" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
              ))}
            </ul>
          );
        }

        // Lists (Ordered)
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s+/, ''));
          return (
            <ol key={i} className="list-decimal list-inside space-y-2.5 pl-4 text-sky-200/85 my-5 marker:text-saffron marker:font-mono marker:font-bold">
              {items.map((item, idx) => (
                <li key={idx} className="pl-1" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
              ))}
            </ol>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '').trim();
          return (
            <blockquote key={i} className="pl-5 border-l-4 border-saffron/40 italic text-sky-200/70 my-6 py-1 bg-white/[0.01] rounded-r-2xl">
              <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(quoteText) }} />
            </blockquote>
          );
        }

        // Normal Paragraph
        return (
          <p key={i} className="mb-4 text-sky-200/85 leading-relaxed text-sm sm:text-base last:mb-0" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }} />
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
