/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
}

export default function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 dark:prose-invert break-words overflow-x-auto">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
