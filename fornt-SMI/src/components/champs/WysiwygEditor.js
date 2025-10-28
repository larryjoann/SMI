import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { CFormFeedback } from '@coreui/react'

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['clean'],
]

const WysiwygEditor = ({ value, onChange, invalid, error }) => {
  const containerRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    // instantiate Quill directly
    quillRef.current = new Quill(containerRef.current, {
      theme: 'snow',
      modules: { toolbar: toolbarOptions },
    })
    // set initial content
    quillRef.current.root.innerHTML = value || ''

    const handleChange = () => {
      if (onChange) onChange(quillRef.current.root.innerHTML)
    }

    quillRef.current.on('text-change', handleChange)

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change', handleChange)
        quillRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // sync external value changes (if parent updates value)
  useEffect(() => {
    const editor = quillRef.current
    if (!editor) return
    const current = editor.root.innerHTML
    if ((value || '') !== current) {
      const sel = editor.getSelection()
      editor.root.innerHTML = value || ''
      if (sel) editor.setSelection(sel)
    }
  }, [value])

  return (
    <div className="position-relative">
      <div className={invalid ? 'wysiwyg-invalid' : ''}>
        <div ref={containerRef} />
      </div>
      {invalid && error && (
        <div style={{ marginTop: '0.25rem' }}>
          <CFormFeedback invalid>{error}</CFormFeedback>
        </div>
      )}
    </div>
  )
}

export default WysiwygEditor
