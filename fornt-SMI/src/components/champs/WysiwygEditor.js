import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CFormFeedback } from '@coreui/react';

const WysiwygEditor = ({ value, onChange, invalid, error }) => {
  return (
    <div className="position-relative">
      <div className={invalid ? 'wysiwyg-invalid' : ''}>
        <CKEditor
          editor={ClassicEditor}
          data={value}
          config={{
            toolbar: [
              'heading', '|',
              'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
              'link', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo', '|',
              'numberedList', 'bulletedList', 'outdent', 'indent', '|',
              'alignment', 'horizontalLine', 'removeFormat', '|',
              'fontColor', 'fontBackgroundColor', 'fontSize', 'fontFamily', '|',
              'code', 'codeBlock', 'specialCharacters', '|',
              'imageUpload', 'imageStyle:full', 'imageStyle:side', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight', 'imageTextAlternative'
            ],
            image: {
              toolbar: [
                'imageTextAlternative', 'imageStyle:full', 'imageStyle:side', 
                'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'
              ]
            },
            table: {
              contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
            }
          }}
          onChange={(event, editor) => onChange(editor.getData())}
        />
      </div>
      {invalid && error && (
        <div style={{marginTop: '0.25rem'}}>
          <CFormFeedback invalid>{error}</CFormFeedback>
        </div>
      )}
    </div>
  );
};

export default WysiwygEditor;
