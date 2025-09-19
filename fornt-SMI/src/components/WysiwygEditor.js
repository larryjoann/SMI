import React, { useState, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const WysiwygEditor = () => {
  const [data, setData] = useState('')
  const editorRef = useRef(null)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (editorRef.current && files.length > 0) {
      const editor = editorRef.current.editor
      files.forEach(file => {
        const url = URL.createObjectURL(file)
        const linkHtml = `<a href="${url}" download="${file.name}">${file.name}</a><br/>`
        editor.model.change(writer => {
          const viewFragment = editor.data.processor.toView(linkHtml)
          const modelFragment = editor.data.toModel(viewFragment)
          editor.model.insertContent(modelFragment, editor.model.document.selection)
        })
      })
    }
    // Optionally reset input
    e.target.value = ''
  }

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        config={{
          toolbar: [
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'undo', 'redo', 'imageUpload'
          ],
          image: {
            toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
          }
        }}
        onReady={editor => {
          editorRef.current = { editor }
        }}
        onChange={(event, editor) => {
          setData(editor.getData())
        }}
      />
      <input
        type="file"
        multiple
        style={{ marginTop: '20px' }}
        onChange={handleFileUpload}
      />
    </div>
  )
}

export default WysiwygEditor
