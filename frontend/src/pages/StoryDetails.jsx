import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storyAPI } from '../services/api.js';

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    storyAPI.getById(id).then(({ data }) => setStory(data)).catch(() => {});
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this story?')) return;
    await storyAPI.delete(id);
    navigate('/stories');
  };

  if (!story) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-semibold text-gray-100">{story.title}</h1>
        <div className="flex gap-3 text-sm">
          <Link to={`/stories/${id}/edit`} className="text-indigo-600">Edit</Link>
          <button onClick={handleDelete} className="text-red-600">Delete</button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">{story.story_date} · {story.category_name}</p>

      <p className="mt-4 text-gray-200 whitespace-pre-line">{story.description}</p>

      {story.transcript && (
        <div className="mt-4 bg-gray-950 border rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Voice Transcript</p>
          <p className="text-sm text-gray-200">{story.transcript}</p>
        </div>
      )}

      {story.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {story.tags.map((tag) => (
            <span key={tag.tag_id} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
              #{tag.tag_name}
            </span>
          ))}
        </div>
      )}

      {story.media?.length > 0 && (
        <div className="mt-4">
          {/* Audio files */}
          {story.media.filter(m => m.media_type === 'audio').length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 font-semibold mb-3">🎙️ Voice Recordings</p>
              <div className="space-y-2">
                {story.media.filter(m => m.media_type === 'audio').map((m) => (
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
          {story.media.filter(m => m.media_type === 'image').length > 0 && (
            <div>
              <p className="text-sm text-gray-400 font-semibold mb-3">📸 Photos</p>
              <div className="grid grid-cols-3 gap-2">
                {story.media.filter(m => m.media_type === 'image').map((m) => (
                  <img key={m.media_id} src={m.file_path} alt="" className="rounded object-cover h-24 w-full" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StoryDetails;
