import type { Post } from '../../types/Post';

interface PostCardProps {
  post: Post;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => (
    <p key={i} className={line.trim() === '' ? 'h-3' : 'mb-1 last:mb-0'}>
      {line.split(/(#\S+)/g).map((part, j) =>
        part.startsWith('#') ? (
          <span key={j} className="text-[#C41E3A] font-semibold">{part}</span>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </p>
  ));
}

export default function PostCard({ post }: PostCardProps) {
  const initials = post.author
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#C41E3A] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
            <svg className="w-3.5 h-3.5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight">
            {post.author}
            {post.context && (
              <span className="font-normal text-gray-500"> {post.context}</span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(post.date)}</p>
        </div>
      </div>

      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {renderContent(post.content)}
      </div>

      {post.reply && (
        <div className="mt-4 pl-4 border-l-2 border-gray-100">
          <p className="text-sm">
            <span className="font-semibold text-gray-900">{post.reply.author}</span>{' '}
            <span className="text-gray-500 mx-1">·</span>
            <span className="text-gray-600">{post.reply.text}</span>
          </p>
        </div>
      )}
    </article>
  );
}
