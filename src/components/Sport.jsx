import { useEffect, useState } from 'react';
import { fetchNewsEntries } from '../lib/contentfull';

export default function Sport({ onOpenArticle }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSportsNews = async () => {
      try {
        setLoading(true);
        const allEntries = await fetchNewsEntries();
        const sportsEntries = allEntries.filter((story) => {
          const category = String(story.category || '').toLowerCase();
          return category === 'sports' || category === 'sport';
        });

        if (isMounted) {
          setStories(sportsEntries);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load sports news.');
          setStories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSportsNews();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroStory = stories[0] ?? null;
  const sideStories = stories.slice(1, 4);
  const highlightStories = stories.slice(4, 7);

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';

    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto">
      <div className="mx-auto mb-10">
        <div className="flex justify-start items-center mx-auto border-b w-[90%] p-6">
          <span className="text-4xl text-red-700 ml-2">&bull;</span>
          <h1 className="font-bold text-3xl">Sports News</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 text-neutral-900">
        {loading && (
          <div className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600">
            Loading sports stories from Contentful...
          </div>
        )}

        {!loading && error && (
          <div className="mb-8 rounded-sm border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="mb-8 rounded-sm border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600">
            No sports entries were found in Contentful.
          </div>
        )}

        {!loading && !error && heroStory && (
          <>
            <section className="grid grid-cols-1 gap-10 lg:grid-cols-3 mb-12">
              <div className="lg:col-span-1 flex flex-col divide-y divide-neutral-200 border border-neutral-300">
                {sideStories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => onOpenArticle?.(story)}
                    className="p-4 text-left"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-red-300 px-2 py-1 text-[10px] font-bold uppercase text-red-700">
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
                onClick={() => onOpenArticle?.(heroStory)}
                className="relative min-h-[320px] overflow-hidden rounded-sm text-left lg:col-span-2"
              >
                <img
                  src={heroStory.imageUrl || 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80'}
                  alt={heroStory.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="relative z-10 flex h-full flex-col justify-end p-6">
                  <span className="mb-3 inline-block w-fit rounded-sm bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase">
                    {heroStory.category}
                  </span>
                  <h2 className="mb-2 max-w-xl text-3xl font-bold leading-tight text-white">
                    {heroStory.title}
                  </h2>
                  <p className="max-w-xl text-sm text-neutral-200">{heroStory.summary}</p>
                </div>
              </button>
            </section>

            <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-4 border-b-2 border-neutral-900 pb-2 text-xl font-bold text-neutral-900">
                  Latest updates
                </h3>
                <ul className="space-y-4">
                  {stories.slice(0, 3).map((story) => (
                    <li key={story.id}>
                      <button
                        type="button"
                        onClick={() => onOpenArticle?.(story)}
                        className="border-l-4 border-red-600 pl-3 text-left text-sm font-medium leading-relaxed text-neutral-700"
                      >
                        {story.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 border-b-2 border-neutral-900 pb-2 text-xl font-bold text-neutral-900">
                  Match analysis
                </h3>
                <div className="space-y-4">
                  {stories.slice(0, 2).map((story) => (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => onOpenArticle?.(story)}
                      className="block w-full rounded-sm border border-neutral-200 p-3 text-left"
                    >
                      <h4 className="text-base font-bold text-neutral-900">{story.title}</h4>
                      <p className="mt-2 text-sm text-neutral-600">{story.summary}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b-2 border-neutral-900 pb-2 text-xl font-bold text-neutral-900">
                  Highlights
                </h3>
                <div className="space-y-4">
                  {highlightStories.map((story) => (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => onOpenArticle?.(story)}
                      className="block w-full text-left"
                    >
                      {story.imageUrl && (
                        <img src={story.imageUrl} alt={story.title} className="mb-3 h-36 w-full rounded-sm object-cover" />
                      )}
                      <h4 className="text-base font-bold leading-snug text-neutral-900">{story.title}</h4>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}