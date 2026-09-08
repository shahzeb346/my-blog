import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

const renderArticleBody = (body, fallback) => {
  if (!body) return fallback;

  return typeof body === "object"
    ? documentToReactComponents(body, {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const file = node.data?.target?.fields?.file;
            const imageUrl = file?.url ? (file.url.startsWith('//') ? `https:${file.url}` : file.url) : '';

            return imageUrl ? (
              <img
                src={imageUrl}
                alt={node.data?.target?.fields?.title || 'Article image'}
                className="my-8 h-auto w-full rounded-md object-cover"
              />
            ) : null;
          },
        },
      })
    : body;
};

export default function Detail({ article, onBack }) {
  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center text-neutral-600">
        <p>No article selected.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Back to news
        </button>
      </div>
    );
  }

  const authorName = article.authorName || article.author?.fields?.authorName || "Editorial team";
  const authorImageUrl = article.authorImageUrl || "";
  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString()
    : "Date unavailable";
  const readingTime = article.readingTime !== null && article.readingTime !== undefined && Number.isFinite(Number(article.readingTime))
    ? `${Number(article.readingTime)} min read`
    : "Reading time unavailable";

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 text-neutral-900">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-red-700 hover:text-red-800"
      >
        ← Back
      </button>

      <div className="mb-6">
        <span className="inline-block rounded-full bg-red-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
          {article.category}
        </span>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900">{article.title}</h1>
        <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:gap-4">
          {authorImageUrl ? (
            <img
              src={authorImageUrl}
              alt={authorName}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-base font-semibold text-neutral-600"
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900">By {authorName}</p>
            <p>
              {publishDate}
              <span className="mx-2" aria-hidden="true">•</span>
              {readingTime}
            </p>
          </div>
        </div>
      </div>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="mb-8 h-[420px] w-full rounded-md object-cover"
        />
      )}

      <div className="prose max-w-none text-lg leading-8 text-neutral-700">
        <p>{article.summary}</p>
        <div className="mt-6 whitespace-pre-line">
          {renderArticleBody(article.body, article.summary)}
        </div>
      </div>
    </div>
  );
}


 