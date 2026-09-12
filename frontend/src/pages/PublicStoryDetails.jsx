import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyAPI } from '../services/api.js';

function PublicStoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    storyAPI
      .getPublicById(id)
      .then(({ data }) => {
        setStory(data);
        if (data.media) {
          setMedia(data.media);
        }
      })
      .catch(() => setError('Story not found or is not public'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500 text-center py-16">Loading story...</p>;
  if (error) return <p className="text-red-600 text-center py-16">{error}</p>;
  if (!story) return <p className="text-gray-500 text-center py-16">Story not found</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link to="/explore" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-flex items-center gap-1">
        ← Back to Explore
      </Link>

      {/* Story header */}
      <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">{story.title}</h1>
            <p className="text-sm text-gray-500">
              By <span className="font-semibold">{story.author_name || 'Anonymous'}</span>
            </p>
          </div>
          {story.is_favorite && (
            <span className="text-amber-500 text-3xl" title="Favorite">★</span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          <span>
            📅 {new Date(story.story_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {story.category_name && (
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded">
              {story.category_name}
            </span>
          )}
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded">
            🌍 Public
          </span>
        </div>
      </div>

      {/* Story content */}
      <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {story.description}
          </p>
        </div>
      </div>

      {/* Transcript if available */}
      {story.transcript && (
        <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-400 font-semibold mb-3">📝 Transcript</p>
          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {story.transcript}
          </p>
        </div>
      )}

      {/* Tags */}
      {story.tags?.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-400 font-semibold mb-3">🏷️ Tags</p>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <span key={tag.tag_id} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                #{tag.tag_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Media */}
      {media?.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
          {/* Audio files */}
          {media.filter(m => m.media_type === 'audio').length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 font-semibold mb-3">🎙️ Voice Recordings</p>
              <div className="space-y-2">
                {media.filter(m => m.media_type === 'audio').map((m) => (
                  <div key={m.media_id} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                    <audio 
                      src={m.file_path} 
                      controls 
                      className="w-full"
                      controlsList="nodownload"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Image files */}
          {media.filter(m => m.media_type === 'image').length > 0 && (
            <div>
              <p className="text-sm text-gray-400 font-semibold mb-3">📸 Photos</p>
              <div className="grid grid-cols-3 gap-2">
                {media.filter(m => m.media_type === 'image').map((m) => (
                  <img key={m.media_id} src={m.file_path} alt="" className="rounded object-cover h-24 w-full" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metadata footer */}
      <div className="text-xs text-gray-500 text-center">
        <p>Published on {new Date(story.created_at).toLocaleDateString('en-US')}</p>
      </div>
    </div>
  );
}

export default PublicStoryDetails;
