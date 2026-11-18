import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getPhotos, uploadPhotos, deleteMine, mine, shrink } from '../lib/api'

export default function MemoryWall({ memory = {}, onOpenPhoto }) {
  const [items, setItems] = useState([])
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [brokenImages, setBrokenImages] = useState({})

  const fileInputRef = useRef(null)
  const nameInputRef = useRef(null)

  // Hide entire section if memory feature is disabled
  if (memory.enabled === false) {
    return null
  }

  const maxPerUpload = memory.maxPerUpload || 6

  // Fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      const data = await getPhotos({ limit: 60 })
      if (data && Array.isArray(data.items)) {
        setItems(data.items)
      }
    } catch (e) {
      // offline or server not ready
    }
  }, [])

  useEffect(() => {
    try {
      const pn = localStorage.getItem('gf-pname')
      if (pn) setName(pn)
    } catch (e) {}

    fetchPhotos()

    // Poll every 60s while document is visible
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchPhotos()
      }
    }, 60000)

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        fetchPhotos()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchPhotos])

  function handleFiles(fileList) {
    const valid = Array.from(fileList)
      .filter(
        (f) =>
          /^image\//.test(f.type) ||
          /\.(jpe?g|png|webp|gif|heic)$/i.test(f.name)
      )
      .slice(0, maxPerUpload)

    previews.forEach((u) => URL.revokeObjectURL(u))
    const urls = valid.map((f) => URL.createObjectURL(f))

    setFiles(valid)
    setPreviews(urls)
    setNote(
      valid.length
        ? `${valid.length} ${valid.length === 1 ? 'photo' : 'photos'} ready.`
        : ''
    )
  }

  function handleFileChange(e) {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!files.length) return

    const trimmedName = name.trim()
    const trimmedCap = caption.trim()

    if (!trimmedName) {
      setNote('Please add your name so we can credit the photo.')
      nameInputRef.current?.focus()
      return
    }

    try {
      localStorage.setItem('gf-pname', trimmedName)
    } catch (x) {}

    setSubmitting(true)
    setNote('Processing photos…')

    try {
      const shrunkFiles = []
      for (const f of files) {
        try {
          const sf = await shrink(f, 1600, 0.82)
          shrunkFiles.push(sf)
        } catch (err) {
          // fallback to original if shrink fails
          shrunkFiles.push(f)
        }
      }

      setNote('Uploading…')
      const res = await uploadPhotos(shrunkFiles, {
        name: trimmedName,
        caption: trimmedCap
      })

      if (res && res.saved && res.saved.length) {
        res.saved.forEach((s) => {
          if (s.id && s.token) {
            mine.add(s.id, s.token)
          }
        })
        setNote(
          `${res.saved.length} ${
            res.saved.length === 1 ? 'photo' : 'photos'
          } added to the wall.`
        )
      } else {
        setNote('Photos uploaded successfully.')
      }

      // Cleanup form
      previews.forEach((u) => URL.revokeObjectURL(u))
      setFiles([])
      setPreviews([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      setCaption('')
      fetchPhotos()
    } catch (err) {
      setNote('Could not upload photos. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(id) {
    const tokens = mine.all()
    const token = tokens[id]
    if (!token) return

    try {
      await deleteMine(id, token)
      mine.drop(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
    } catch (err) {
      // Failed to delete
    }
  }

  function handleImageError(id) {
    setBrokenImages((prev) => ({ ...prev, [id]: true }))
  }

  const myTokens = mine.all()

  return (
    <section className="sec memo" id="memories" aria-labelledby="me-h">
      <img
        className="deco l"
        src="/assets/deco-flowers.jpg"
        alt=""
        loading="lazy"
      />
      <img
        className="deco r"
        src="/assets/deco-flowers.jpg"
        alt=""
        loading="lazy"
      />
      <div className="in">
        <div className="sec-head rv">
          <p className="eyebrow">Memory wall</p>
          <h2 id="me-h">Share your photographs</h2>
          <p className="lead">
            Took a picture of the couple, the dance floor or the dessert table?
            Add it here and everyone can see it.
          </p>
          <div className="rule">
            <i></i>
          </div>
        </div>

        {memory.canUpload ? (
          <form
            className="drop rv"
            id="dropForm"
            noValidate
            onSubmit={handleSubmit}
          >
            <label
              className={`pick ${dragOver ? 'over' : ''}`}
              id="pick"
              htmlFor="photoIn"
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <strong>Choose photos</strong>
              <span>
                Tap to pick from your gallery or take a new one. Up to{' '}
                {maxPerUpload} at a time.
              </span>
              <input
                id="photoIn"
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
            <div className="prev" id="prev">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </div>
            <div className="two">
              <div className="fld">
                <label htmlFor="p-name">Your name</label>
                <input
                  id="p-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Shown under your photo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  ref={nameInputRef}
                />
              </div>
              <div className="fld">
                <label htmlFor="p-cap">Caption (optional)</label>
                <input
                  id="p-cap"
                  type="text"
                  placeholder="The first dance"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </div>
            <p className="note-s" id="p-note" role="status">
              {note}
            </p>
            <button
              className="btn"
              id="p-go"
              type="submit"
              disabled={!files.length || submitting}
            >
              {submitting ? 'Adding…' : 'Add to the wall'}
            </button>
            <p
              className="secure"
              style={{ textAlign: 'center', marginTop: '.6rem' }}
            >
              Photos you add become visible to everyone with this page.
            </p>
          </form>
        ) : memory.folderUrl ? (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <a
              className="btn"
              href={memory.folderUrl}
              target="_blank"
              rel="noopener"
            >
              Add photos to the shared Drive folder
            </a>
          </div>
        ) : null}

        <div className="wall" id="wall">
          {items.map((it) => {
            const isMine = Boolean(myTokens[it.id])
            const capText = (it.caption ? it.caption + ' · ' : '') + (it.by || '')
            const isBroken = brokenImages[it.id]

            return (
              <figure key={it.id} className="pol">
                <button
                  className="open"
                  type="button"
                  aria-label="Open photo"
                  onClick={() =>
                    onOpenPhoto(it.full || it.thumb || it.url, capText)
                  }
                >
                  {isBroken ? (
                    <div
                      style={{
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        background: 'var(--blush)',
                        color: 'var(--ink)'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '.9rem' }}>
                        Photo in Drive
                      </p>
                      {memory.folderUrl && (
                        <a
                          href={memory.folderUrl}
                          target="_blank"
                          rel="noopener"
                          style={{
                            fontSize: '.8rem',
                            color: 'var(--wine-600)',
                            textDecoration: 'underline'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open in Drive
                        </a>
                      )}
                    </div>
                  ) : (
                    <img
                      src={it.thumb || it.url}
                      alt={it.caption || 'Photo shared by ' + (it.by || 'a guest')}
                      loading="lazy"
                      onError={() => handleImageError(it.id)}
                    />
                  )}
                </button>
                <figcaption>
                  {it.caption && <span>{it.caption}</span>}
                  <small>{it.by || 'A guest'}</small>
                </figcaption>
                {isMine && (
                  <button
                    className="rm"
                    type="button"
                    onClick={() => handleRemove(it.id)}
                  >
                    Remove
                  </button>
                )}
              </figure>
            )
          })}
        </div>

        {items.length === 0 && (
          <div className="empty" id="wallEmpty">
            <div>Be the first to share a memory.</div>
            <div>Wedding photographs from guests will appear on this wall.</div>
            <div>Add one above and it shows up for everyone.</div>
          </div>
        )}
      </div>
    </section>
  )
}
