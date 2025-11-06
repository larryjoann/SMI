import React, { useEffect, useState } from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormTextarea, CFormInput, CAlert } from '@coreui/react'

const VerifierEfficaciteModal = ({ visible, onClose, onSubmitSuccess }) => {
  const [efficacite, setEfficacite] = useState('')
  const [files, setFiles] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (visible) {
      setEfficacite('')
      setFiles(null)
      setError(null)
    }
  }, [visible])

  const handleFileChange = (e) => {
    setFiles(e.target.files)
  }

  const handleSubmit = () => {
    // Demo-only: no API call. Just return the collected data.
    if (!efficacite || !efficacite.trim()) {
      setError('Veuillez saisir une description de l\'efficacité')
      return
    }
    const payload = { efficacite: efficacite.trim(), files }
    console.log('VerifierEfficacite submit (demo):', payload)
    if (typeof onSubmitSuccess === 'function') onSubmitSuccess(payload)
    if (typeof onClose === 'function') onClose()
  }

  return (
    <CModal alignment="center" visible={!!visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Vérifier l'efficacité</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <div className="mb-3">
          <CFormTextarea
            rows={6}
            placeholder="Décrivez l'évaluation de l'efficacité..."
            value={efficacite}
            onChange={(e) => setEfficacite(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Pièces jointes (démo)</label>
          <CFormInput type="file" multiple onChange={handleFileChange} />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Annuler</CButton>
        <CButton color="primary" onClick={handleSubmit}>Enregistrer (demo)</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default VerifierEfficaciteModal
