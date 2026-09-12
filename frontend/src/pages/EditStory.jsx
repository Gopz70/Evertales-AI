import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storyAPI, categoryAPI, aiAPI } from '../services/api.js';

// Supported languages for Web Speech API
const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: '🇺🇸 English (US)' },
  { code: 'en-GB', name: '🇬🇧 English (UK)' },
  { code: 'en-AU', name: '🇦🇺 English (Australia)' },
  { code: 'es-ES', name: '🇪🇸 Spanish' },
  { code: 'es-MX', name: '🇲🇽 Spanish (Mexico)' },
  { code: 'fr-FR', name: '🇫🇷 French' },
  { code: 'de-DE', name: '🇩🇪 German' },
  { code: 'it-IT', name: '🇮🇹 Italian' },
  { code: 'pt-BR', name: '🇧🇷 Portuguese (Brazil)' },
  { code: 'pt-PT', name: '🇵🇹 Portuguese (Portugal)' },
  { code: 'nl-NL', name: '🇳🇱 Dutch' },
  { code: 'ru-RU', name: '🇷🇺 Russian' },
  { code: 'ja-JP', name: '🇯🇵 Japanese' },
  { code: 'zh-CN', name: '🇨🇳 Chinese (Simplified)' },
  { code: 'zh-TW', name: '🇹🇼 Chinese (Traditional)' },
  { code: 'ko-KR', name: '🇰🇷 Korean' },
  { code: 'hi-IN', name: '🇮🇳 Hindi' },
  { code: 'ml-IN', name: '🇮🇳 Malayalam' },
  { code: 'ta-IN', name: '🇮🇳 Tamil' },
  { code: 'te-IN', name: '🇮🇳 Telugu' },
  { code: 'kn-IN', name: '🇮🇳 Kannada' },
  { code: 'ar-SA', name: '🇸🇦 Arabic' },
  { code: 'th-TH', name: '🇹🇭 Thai' },
  { code: 'vi-VN', name: '🇻🇳 Vietnamese' },
  { code: 'tr-TR', name: '🇹🇷 Turkish' },
  { code: 'pl-PL', name: '🇵🇱 Polish' },
  { code: 'sv-SE', name: '🇸🇪 Swedish' },
  { code: 'nb-NO', name: '🇳🇴 Norwegian' },
  { code: 'da-DK', name: '🇩🇰 Danish' },
  { code: 'fi-FI', name: '🇫🇮 Finnish' },
  { code: 'el-GR', name: '🇬🇷 Greek' },
  { code: 'hu-HU', name: '🇭🇺 Hungarian' },
  { code: 'cs-CZ', name: '🇨🇿 Czech' },
  { code: 'ro-RO', name: '🇷🇴 Romanian' },
];

function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', story_date: '', category_id: '', is_favorite: false, is_public: false,
  });
  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const recognitionRef = useRef(null);

  // Audio file recording state
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    Promise.all([storyAPI.getById(id), categoryAPI.getAll()])
      .then(([storyRes, catRes]) => {
        const s = storyRes.data;
        setForm({
          title: s.title || '',
          description: s.description || '',
          story_date: s.story_date ? s.story_date.slice(0, 10) : '',
          category_id: s.category_id || '',
          is_public: s.is_public || false,
          is_favorite: !!s.is_favorite,
        });
        setMedia(s.media || []);
        setCategories(catRes.data);
      })
      .catch(() => setError('Could not load story'))
      .finally(() => setLoading(false));

    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setError(`Transcription error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [id, selectedLanguage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFiles(Array.from(e.target.files || []));
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech Recognition not supported in your browser.');
      return;
    }
    setError('');
    setTranscript('');
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript) {
        setForm((f) => ({ ...f, description: `${f.description}\n${transcript}`.trim() }));
      }
    }
  };

  // Audio file recording functions
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordedAudio(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsAudioRecording(true);
      setError('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Please enable microphone access in your browser settings');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsAudioRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      setError('No audio recorded');
      return;
    }

    setUploadingAudio(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('duration', audioRef.current?.duration || 0);
      formData.append('storyId', id);  // Send storyId so backend creates Media record

      const response = await fetch('http://localhost:5000/api/audio/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Add to media array for preview
        const newMedia = {
          media_id: Date.now(),
          story_id: id,
          media_type: 'audio',
          file_path: data.filePath,
          fileSize: data.fileSize,
          duration: data.duration
        };

        setMedia(prev => [...prev, newMedia]);
        alert('Audio uploaded successfully!');
        setRecordedAudio(null);
        setAudioBlob(null);
      } else {
        setError('Failed to upload audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError('Failed to upload audio');
    } finally {
      setUploadingAudio(false);
    }
  };

  const clearAudioRecording = () => {
    setRecordedAudio(null);
    setAudioBlob(null);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Delete this media?')) return;
    try {
      await storyAPI.deleteMedia(mediaId);
      setMedia((prev) => prev.filter((m) => m.media_id !== mediaId));
    } catch (err) {
      setError('Failed to delete media');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      // 1. Generate tags from description
      let generatedTags = [];
      if (form.description.trim()) {
        try {
          const { data } = await aiAPI.generateTags(form.description);
          generatedTags = data.tags || [];
        } catch (err) {
          console.warn('Tag generation failed:', err);
        }
      }

      // 2. Update story metadata with tags
      const updateData = {
        ...form,
        tags: generatedTags
      };
      await storyAPI.update(id, updateData);

      // 3. Upload new photos if selected
      if (photoFiles.length > 0) {
        for (const file of photoFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const { data } = await storyAPI.uploadMedia(id, formData);
          setMedia((prev) => [...prev, data]);
        }
      }

      setPhotoFiles([]);
      navigate(`/stories/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Edit Story</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title" placeholder="Title" value={form.title}
          onChange={handleChange} className="border rounded px-3 py-2" required disabled={uploading}
        />
        <textarea
          name="description" placeholder="Story description" value={form.description}
          onChange={handleChange} className="border rounded px-3 py-2 h-32" disabled={uploading}
        />
        <input
          name="story_date" type="date" value={form.story_date}
          onChange={handleChange} className="border rounded px-3 py-2" disabled={uploading}
        />
        <select
          name="category_id" value={form.category_id}
          onChange={handleChange} className="border rounded px-3 py-2" disabled={uploading}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox" name="is_favorite" checked={form.is_favorite}
            onChange={handleChange} disabled={uploading}
          />
          Mark as favorite
        </label>

        {/* Visibility Toggle */}
        <div className="border rounded px-3 py-2 bg-gray-950">
          <label className="text-sm text-gray-400 block mb-2 font-semibold">Visibility</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={!form.is_public}
                onChange={() => setForm({ ...form, is_public: false })}
                disabled={uploading}
              />
              <span className="text-sm text-gray-200">🔒 Private (only you)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={form.is_public}
                onChange={() => setForm({ ...form, is_public: true })}
                disabled={uploading}
              />
              <span className="text-sm text-gray-200">🌍 Public (anyone can view)</span>
            </label>
          </div>
        </div>

        {/* Existing media */}
        {media.length > 0 && (
          <div className="bg-gray-950 rounded p-3">
            <p className="text-sm font-semibold text-gray-200 mb-2">Current Media</p>
            <div className="grid grid-cols-3 gap-2">
              {media.map((m) => (
                <div key={m.media_id} className="relative">
                  {m.media_type === 'image' ? (
                    <img src={m.file_path} alt="" className="rounded object-cover h-20 w-full" />
                  ) : (
                    <audio src={m.file_path} controls className="col-span-3 w-full" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(m.media_id)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice Recording */}
        <div className="border rounded px-3 py-2 bg-blue-50">
          <label className="text-sm text-gray-400 block mb-2 font-semibold">🎤 Add Voice Recording (optional)</label>
          
          {/* Language Selector */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 block mb-1">Select Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isRecording || uploading}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={startRecording}
              disabled={isRecording || uploading}
              className={`px-4 py-2 rounded text-sm font-semibold text-white ${
                isRecording
                  ? 'bg-red-500'
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
              }`}
            >
              {isRecording ? '🔴 Recording...' : '🎙️ Start Recording'}
            </button>
            <button
              type="button"
              onClick={stopRecording}
              disabled={!isRecording || uploading}
              className="px-4 py-2 rounded text-sm font-semibold text-white bg-gray-9500 hover:bg-gray-600 disabled:bg-gray-300"
            >
              ⏹️ Stop
            </button>
          </div>

          {transcript && (
            <div className="bg-gray-900 border border-green-200 rounded p-2">
              <p className="text-xs text-green-600 mb-1">✓ Transcribed:</p>
              <p className="text-sm text-gray-200">{transcript}</p>
            </div>
          )}
        </div>

        {/* Audio File Recording */}
        <div className="border rounded px-3 py-2 bg-purple-50">
          <label className="text-sm text-gray-900 block mb-2 font-semibold">🎙️ Record Voice Message (optional)</label>
          
          {!recordedAudio ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={startAudioRecording}
                disabled={isAudioRecording || uploading}
                className={`px-4 py-2 rounded text-sm font-semibold text-white ${
                  isAudioRecording 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-gray-400`}
              >
                {isAudioRecording ? '🔴 Recording...' : '🎤 Start Recording'}
              </button>
              
              {isAudioRecording && (
                <button
                  type="button"
                  onClick={stopAudioRecording}
                  className="px-4 py-2 rounded text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700"
                >
                  ⏹️ Stop Recording
                </button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-900 mb-3">✓ Recording captured! Preview:</p>
              <audio
                ref={audioRef}
                src={recordedAudio}
                controls
                className="w-full mb-3"
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={uploadAudio}
                  disabled={uploadingAudio || uploading}
                  className="px-4 py-2 rounded text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploadingAudio ? '⏳ Uploading...' : '☁️ Upload Voice'}
                </button>
                
                <button
                  type="button"
                  onClick={clearAudioRecording}
                  disabled={uploading}
                  className="px-4 py-2 rounded text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                >
                  ✕ Clear Recording
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Photos */}
        <div className="border rounded px-3 py-2">
          <label className="text-sm text-gray-400 block mb-1">📸 Add Photos (optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handlePhotoChange}
            disabled={uploading}
          />
          {photoFiles.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{photoFiles.length} new photo(s) selected</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          className="bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
        >
          {uploading ? 'Uploading...' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditStory;
