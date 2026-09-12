import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

function AddStory() {
  const [form, setForm] = useState({ title: '', description: '', story_date: '', category_id: '', is_public: false });
  const [categories, setCategories] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Recording state - Speech to Text
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

  const navigate = useNavigate();

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data)).catch(() => {});

    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage; // Use selected language

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
  }, [selectedLanguage]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    setPhotoFiles(Array.from(e.target.files || []));
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech Recognition not supported in your browser. Use Chrome, Firefox, or Edge.');
      return;
    }
    setError('');
    setTranscript('');
    setIsRecording(true);
    recognitionRef.current.lang = selectedLanguage;
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

      const response = await fetch('http://localhost:5000/api/audio/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setPhotoFiles(prev => [...prev, { isAudio: true, ...data }]);
        alert('Audio uploaded successfully!');
        setRecordedAudio(null);
        setAudioBlob(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      // 1. Generate tags from description before creating
      let generatedTags = [];
      if (form.description.trim()) {
        try {
          const { data } = await aiAPI.generateTags(form.description);
          generatedTags = data.tags || [];
        } catch (err) {
          console.warn('Tag generation failed:', err);
          // Continue without tags if generation fails
        }
      }

      // 2. Create the story with generated tags
      const storyData = {
        ...form,
        tags: generatedTags
      };
      const { data } = await storyAPI.create(storyData);
      const storyId = data.story_id;

      // 3. Upload audio if recorded
      if (audioBlob) {
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('duration', audioRef.current?.duration || 0);
          formData.append('storyId', storyId);

          await fetch('http://localhost:5000/api/audio/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
        } catch (audioErr) {
          console.error('Error uploading audio:', audioErr);
          // Don't fail - story is already created
        }
      }

      // 4. Upload photos if selected
      if (photoFiles.length > 0) {
        for (const file of photoFiles) {
          const formData = new FormData();
          formData.append('file', file);
          await storyAPI.uploadMedia(storyId, formData);
        }
      }

      // 5. Show success and redirect
      navigate(`/stories/${storyId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save story');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Add a New Story</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title" placeholder="Title" value={form.title}
          onChange={handleChange} className="border rounded px-3 py-2" required disabled={uploading}
        />
        <textarea
          name="description" placeholder="Tell your story..." value={form.description}
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

        {/* Voice Recording with Web Speech API */}
        <div className="border rounded px-3 py-2 bg-blue-50">
          <label className="text-sm text-gray-400 block mb-2 font-semibold">🎤 Record Your Story (optional)</label>
          <p className="text-xs text-gray-500 mb-3">Click record, speak naturally in your language, and the browser will transcribe instantly.</p>
          
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
            <div className="bg-gray-900 border border-green-200 rounded p-2 mb-2">
              <p className="text-xs text-green-600 mb-1">✓ Transcribed so far:</p>
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
                  onClick={clearAudioRecording}
                  disabled={uploading}
                  className="px-4 py-2 rounded text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                >
                  ✕ Clear Recording
                </button>
                <p className="text-xs text-gray-400 self-center">Audio will be uploaded when you save the story</p>
              </div>
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div className="border rounded px-3 py-2">
          <label className="text-sm text-gray-400 block mb-1">📸 Photos (optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handlePhotoChange}
            disabled={uploading}
          />
          {photoFiles.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{photoFiles.length} photo(s) selected</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          className="bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
        >
          {uploading ? 'Saving...' : '💾 Save Story'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-2 rounded">
        <p><strong>💡 Tip:</strong> Web Speech API works best in Chrome, Firefox, and Edge. Safari and older browsers may have limited support.</p>
      </div>
    </div>
  );
}

export default AddStory;
