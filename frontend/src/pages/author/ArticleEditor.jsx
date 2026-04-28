import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiSave, FiSend, FiImage, FiX, FiVideo,
  FiEdit3, FiTag, FiList, FiFileText, FiAlignLeft,
  FiCheckCircle, FiClock,
} from 'react-icons/fi';
import ReactQuill from 'react-quill-new';
import Select from 'react-select';
import 'react-quill-new/dist/quill.snow.css';
import { articlesAPI, categoriesAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000';

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const MAX_VIDEO_MB = 100;

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link', 'image'],
    ['clean'],
  ],
};

/* ─────── Character counter helper ─────── */
const CharCounter = ({ value, max }) => {
  const pct = value / max;
  const cls = pct >= 0.95 ? 'danger' : pct >= 0.8 ? 'warn' : '';
  return (
    <span className={`char-counter ${cls}`}>
      {value} / {max}
    </span>
  );
};

/* ─────── Section wrapper ─────── */
const Section = ({ icon: Icon, label, children }) => (
  <div className="editor-section">
    <div className="editor-section-title">
      <Icon size={15} />
      {label}
    </div>
    {children}
  </div>
);

/* ─────── Main component ─────── */
const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const fileInputRef  = useRef(null);
  const videoInputRef = useRef(null);

  const [title,      setTitle]      = useState('');
  const [body,       setBody]       = useState('');
  const [summary,    setSummary]    = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags,       setTags]       = useState('');

  const [coverImage,        setCoverImage]        = useState(null);
  const [coverPreview,      setCoverPreview]      = useState('');
  const [videoFile,         setVideoFile]         = useState(null);
  const [videoPreview,      setVideoPreview]      = useState('');
  const [existingVideoUrl,  setExistingVideoUrl]  = useState('');
  const [removeVideo,       setRemoveVideo]       = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [lastSaved,  setLastSaved]  = useState(null);

  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(1);

  const isEditing = !!id;

  useEffect(() => {
    fetchCategories();
    if (id) fetchArticle();
  }, [id]);

  // Calculate stats in real-time
  useEffect(() => {
    const text = body.replace(/<[^>]*>/g, ' ').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setReadTime(Math.max(1, Math.ceil(words / 200)));
  }, [body]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (e) { console.error(e); }
  };

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res     = await articlesAPI.getById(id);
      const article = res.data.data;
      setTitle(article.title);
      setBody(article.body);
      setSummary(article.summary || '');
      setCategoryId(article.category?._id || '');
      setTags(article.tags?.join(', ') || '');
      if (article.coverImage)  setCoverPreview(`${API_URL}${article.coverImage}`);
      if (article.videoUrl)    setExistingVideoUrl(`${API_URL}${article.videoUrl}`);
    } catch (e) {
      showToast('Failed to load article', 'error');
    }
    setLoading(false);
  };

  /* ── Cover image ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be < 5 MB', 'error'); return; }
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  /* ── Video ── */
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      showToast('Only MP4, WebM, OGG or MOV videos allowed', 'error');
      e.target.value = ''; return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      showToast(`Video must be < ${MAX_VIDEO_MB} MB`, 'error');
      e.target.value = ''; return;
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setRemoveVideo(false);
    setExistingVideoUrl('');
  };

  const handleRemoveVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null); setVideoPreview('');
    setExistingVideoUrl(''); setRemoveVideo(true);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  /* ── Save ── */
  const handleSave = async (submitOrPublish = false) => {
    if (!title.trim())  { showToast('Title is required', 'error');           return; }
    if (!body.trim())   { showToast('Article body is required', 'error');    return; }
    if (!categoryId)    { showToast('Please select a category', 'error');    return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',    title);
      fd.append('body',     body);
      fd.append('summary',  summary);
      fd.append('category', categoryId);
      
      const targetStatus = submitOrPublish 
        ? (isAdmin ? 'published' : 'pending')
        : 'draft';
      
      fd.append('status', targetStatus);

      tags.split(',').map(t => t.trim()).filter(Boolean)
          .forEach(t => fd.append('tags[]', t));

      if (coverImage)  fd.append('coverImage', coverImage);
      if (videoFile)   fd.append('videoFile',  videoFile);
      if (removeVideo) fd.append('removeVideo', 'true');

      if (isEditing) {
        await articlesAPI.update(id, fd);
      } else {
        await articlesAPI.create(fd);
      }

      setLastSaved(new Date());
      showToast(submitOrPublish 
        ? (isAdmin ? 'Article Published!' : 'Submitted for review!') 
        : 'Draft saved!', 'success');
      
      const redirectPath = window.location.pathname.startsWith('/admin') ? '/admin/posts' : '/dashboard';
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to save article', 'error');
    }
    setSaving(false);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const activeVideoSrc = videoPreview || existingVideoUrl;

  return (
    <div className="editor-page">
      {/* ── Toast ── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <FiCheckCircle style={{ marginRight: 6 }} /> : null}
          {toast.message}
        </div>
      )}

      {/* ── Gradient header ── */}
      <div className="editor-header animate-slide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="editor-header-badge">
            <FiEdit3 size={11} />
            {isEditing ? 'Editing Article' : 'New Article'}
          </div>
          <h1>{isEditing ? 'Edit Article' : 'Create New Article'}</h1>
          <p>{isAdmin ? 'Publish directly or save as draft.' : 'Fill in the details below and submit for review when ready.'}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.7, letterSpacing: '0.05em' }}>Author Session</div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{user?.name}</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>

      {/* ── SECTION 1: Media ── */}
      <Section icon={FiImage} label="Cover Image &amp; Video">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Cover image */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Cover Image <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(max 5 MB)</span>
            </p>
            {coverPreview ? (
              <div className="image-preview-wrap">
                <img src={coverPreview} alt="Cover" />
                <div className="image-preview-actions">
                  <button
                    className="btn btn-sm"
                    style={{ background: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(6px)', borderRadius: 8, fontSize: 12, padding: '5px 12px' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiImage size={12} /> Replace
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
                    onClick={() => { setCoverImage(null); setCoverPreview(''); }}
                  >
                    <FiX size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-zone-icon image"><FiImage /></div>
                <h4>Click to upload image</h4>
                <p>JPEG, PNG or WebP</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange} style={{ display: 'none' }} id="cover-image-input" />
          </div>

          {/* Video */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Article Video <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional · max {MAX_VIDEO_MB} MB)</span>
            </p>
            {activeVideoSrc ? (
              <div className="video-preview-wrap">
                <video key={activeVideoSrc} controls preload="metadata">
                  <source src={activeVideoSrc} />
                </video>
                {videoFile && (
                  <div className="video-info-bar">
                    <FiVideo size={13} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {videoFile.name}
                    </span>
                    <span style={{ flexShrink: 0 }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                )}
                <div className="image-preview-actions">
                  <button
                    className="btn btn-sm"
                    style={{ background: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(6px)', borderRadius: 8, fontSize: 12, padding: '5px 12px' }}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <FiVideo size={12} /> Replace
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
                    onClick={handleRemoveVideo}
                  >
                    <FiX size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-zone" onClick={() => videoInputRef.current?.click()}>
                <div className="upload-zone-icon video"><FiVideo /></div>
                <h4>Click to upload video</h4>
                <p>MP4, WebM, OGG or MOV</p>
              </div>
            )}
            <input ref={videoInputRef} id="video-upload-input" type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleVideoChange} style={{ display: 'none' }} />
          </div>
        </div>
      </Section>

      {/* ── SECTION 2: Core content ── */}
      <Section icon={FiFileText} label="Article Content">
        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="editor-title">
            Title <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            id="editor-title"
            type="text"
            className="form-input"
            placeholder="Write a compelling headline…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
            style={{ fontSize: 17, fontWeight: 500 }}
          />
          <CharCounter value={title.length} max={200} />
        </div>

        {/* Summary */}
        <div className="form-group">
          <label className="form-label">
            Summary <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(SEO description)</span>
          </label>
          <textarea
            className="form-input"
            placeholder="A short description shown in search results and article cards…"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            maxLength={300}
            rows={2}
          />
          <CharCounter value={summary.length} max={300} />
        </div>

        {/* Body */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Article Body <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiAlignLeft size={13} /> {wordCount} Words
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiClock size={13} /> ~{readTime} Min Read
              </span>
            </div>
          </div>
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            modules={modules}
            placeholder="Write your article content here…"
          />
        </div>
      </Section>

      {/* ── SECTION 3: Settings ── */}
      <Section icon={FiList} label="Settings &amp; Tags">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="editor-category">
              Category <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <Select
              inputId="editor-category"
              placeholder="Select a category…"
              value={categories.map(c => ({ value: c._id, label: c.name })).find(c => c.value === categoryId) || null}
              onChange={(selected) => setCategoryId(selected ? selected.value : '')}
              options={categories.map(c => ({ value: c._id, label: c.name }))}
              isClearable
              menuPortalTarget={document.body}
              styles={{
                control: (base, state) => ({
                  ...base,
                  padding: '4px 6px',
                  border: `2px solid ${state.isFocused ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  boxShadow: state.isFocused ? '0 0 0 3px rgba(46, 134, 171, 0.15)' : 'none',
                  '&:hover': {
                    borderColor: state.isFocused ? 'var(--accent)' : 'var(--border)',
                  },
                  backgroundColor: 'var(--surface)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  transition: 'all var(--transition-fast)',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-sans)',
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? 'var(--primary)'
                    : state.isFocused
                    ? 'var(--surface-hover)'
                    : 'var(--surface)',
                  color: state.isSelected ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  fontSize: '15px',
                  '&:active': {
                    backgroundColor: 'var(--primary-light)',
                    color: 'white',
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: 'var(--text-light)',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'var(--text-primary)',
                }),
              }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <FiTag size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Tags
              <span style={{ color: 'var(--text-light)', fontWeight: 400, marginLeft: 4 }}>(comma separated)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. tech, ai, machine-learning"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* ── Sticky action bar ── */}
      <div className="editor-action-bar">
        <div className="editor-action-bar-inner">
          <div className="editor-action-bar-left">
            {lastSaved ? (
              <span className="animate-slide" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--success)' }}>
                <FiCheckCircle size={14} />
                <span style={{ color: 'var(--text-secondary)' }}>Saved at {lastSaved.toLocaleTimeString()}</span>
              </span>
            ) : (
              <span className="unsaved-indicator" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="pulsing-dot" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="editor-action-bar-right">
            <button 
              className="btn btn-ghost" 
              onClick={() => navigate(window.location.pathname.startsWith('/admin') ? '/admin/posts' : '/dashboard')} 
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              <FiSave size={14} className={saving ? "spin-icon" : ""} /> {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              className="btn btn-primary btn-glow"
              onClick={() => handleSave(true)}
              disabled={saving}
              style={{ minWidth: 170 }}
            >
              <FiSend size={14} className={saving ? "spin-icon" : ""} /> 
              {saving ? 'Processing…' : (isAdmin ? 'Publish Article' : 'Submit for Review')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ArticleEditor;
