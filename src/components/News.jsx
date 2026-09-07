
import { useEffect, useMemo, useState } from 'react';
import { fetchNewsEntries } from '../lib/contentfull';

const categoryOrder = ['news', 'sports', 'health', 'technology'];

export default function News({ onOpenArticle }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        const news = await fetchNewsEntries();

        if (isMounted) {
          setEntries(news);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong while loading news.');
          setEntries([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryGroups = useMemo(() => {
    const groups = {
      news: [],
      sports: [],
      health: [],
      technology: [],
    };

    entries.forEach((story) => {
      const category = (story.category || '').toLowerCase();
      const key = categoryOrder.includes(category) ? category : 'news';
      groups[key].push(story);
    });

    return groups;
  }, [entries]);
  const topStory = categoryGroups.news[0] || entries[0] || null;
  const sideStories = categoryGroups.news.slice(1, 4);

  const categoryCards = categoryOrder.map((category) => ({
    key: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
    items: categoryGroups[category].slice(0, 3),
  }));

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto">
      <div className="mx-auto mb-10">
        <div className="flex justify-start items-center mx-auto border-b w-[90%] p-6">
          <span className="text-4xl text-red-700 ml-2">&bull;</span>
          <h1 className="font-bold text-3xl">Breaking News</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 text-neutral-900">
        {loading && (
          <div className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600">
            Loading the latest stories from Contentful...
          </div>
        )}

        {!loading && error && (
          <div className="mb-8 rounded-sm border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600">
            No news entries were found. Add content in Contentful and refresh the page.
          </div>
        )}

        {!loading && !error && topStory && (
          <section className="grid grid-cols-1 gap-10 lg:grid-cols-3 mb-12">
            <div className="flex flex-col divide-y divide-neutral-200 border border-neutral-300 lg:col-span-1">
              {sideStories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => onOpenArticle?.(story)}
                  className="p-4 text-left"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold bg-red-300 p-2 rounded-full text-red-700 uppercase">
                      {story.category}
                    </span>
                    <span className="text-xs text-neutral-500">{formatDate(story.publishedAt)}</span>
                  </div>
                  <h2 className="mb-1 text-base font-bold leading-snug text-neutral-900">
                    {story.title}
                  </h2>
                  <p className="text-sm text-neutral-600">{story.summary}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onOpenArticle?.(topStory)}
              className="relative min-h-[320px] overflow-hidden rounded-sm text-left lg:col-span-2"
            >
              <img
                src={topStory.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80'}
                alt={topStory.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="relative z-10 flex h-full flex-col justify-end p-6">
                <span className="mb-3 inline-block w-fit rounded-sm bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase">
                  {topStory.category}
                </span>

                <h2 className="mb-2 max-w-xl text-3xl font-bold leading-tight text-white">
                  {topStory.title}
                </h2>

                <p className="max-w-xl text-sm text-neutral-200">{topStory.summary}</p>
              </div>
            </button>
          </section>
        )}

        {!loading && !error && entries.length > 0 && (
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {categoryCards.map(({ key, label, items }) => (
              <div key={key}>
                <h3 className="mb-3 pb-2 text-xl border-b-3 border-neutral-900 font-bold text-neutral-900">
                  {label}
                </h3>

                {items.length > 0 ? (
                  items.map((story) => (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => onOpenArticle?.(story)}
                      className="mb-4 block w-full text-left"
                    >
                      {story.imageUrl && (
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="mb-3 h-40 w-full rounded-sm object-cover"
                        />
                      )}
                      <h4 className="mb-1 text-base font-bold leading-snug text-neutral-900">
                        {story.title}
                      </h4>
                      <p className="text-sm text-neutral-600">{story.summary}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No {label.toLowerCase()} stories available.</p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}