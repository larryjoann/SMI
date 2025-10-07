import React, { useEffect, useState } from 'react'
import {
  CCol,
  CRow,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormSelect, CButton,  
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import CategorieProcessusSection from '../components/CategorieProcessusSection'
import API_URL from '../../../api/API_URL'
import CategorieProcessusSelect from '../../../components/champs/CategorieProcessusSelect'
import { Pop_up } from '../../../components/notification/Pop_up' // Ajoute l'import

const Cartographie = () => {
  const [processus, setProcessus] = useState([])
  const [categories, setCategories] = useState([])

  // Pour le Pop_up
  const [showToast, setShowToast] = useState(false)
  const [popType, setPopType] = useState('success')
  const [popMessage, setPopMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    // Récupérer les processus
    fetch(`${API_URL}/Processus`)
      .then(res => res.json())
      .then(data => setProcessus(data))
      .catch(() => setProcessus([]))

    // Récupérer les catégories
    fetch(`${API_URL}/CategorieProcessus`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  const categorieColors = {
    2: '#A8D5BA',
    3: '#7299c1ff',
    4: '#c7d3e7ff',
    5: '#E0E0E0',
  }

  const handleDeleteProcessus = async (id) => {
    try {
      const res = await fetch(`${API_URL}/Processus/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProcessus(prev => prev.filter(p => p.id !== id))
        setPopType('success')
        setPopMessage('Processus supprimé avec succès')
        setShowToast(true)
      } else {
        setPopType('danger')
        setPopMessage('Erreur lors de la suppression')
        setShowToast(true)
      }
    } catch {
      setPopType('danger')
      setPopMessage('Erreur réseau')
      setShowToast(true)
    }
  }

  const processusParCategorie = categories.map(cat => ({
    categorie: cat.nom,
    id: cat.id,
    color: categorieColors[cat.id] || 'light',
    processusList: processus
      .filter(p => p.idCategorieProcessus === cat.id)
      .map(p => ({
        id: p.id,
        title: `${p.nom} (${p.sigle})`,
        responsable: Array.isArray(p.pilotes)
          ? p.pilotes.map(pi => pi.collaborateur?.poste).filter(Boolean).join(', ')
          : "-",
        collaborateur: Array.isArray(p.copilotes)
          ? p.copilotes.map(co => co.collaborateur?.poste).filter(Boolean).join(', ')
          : "-",
        onDelete: () => handleDeleteProcessus(p.id),
        onEdit: () => navigate(`/pilotage/formprocessus/${p.id}`),
        onClick: () => navigate(`/pilotage/ficheprocessus/${p.id}`), // <-- Ajout
      })),
  }))

  return (
    <>
      <Pop_up
        show={showToast}
        setShow={setShowToast}
        type={popType}
        message={popMessage}
      />
      <CRow>
        <CCol xs={12} className="d-flex justify-content-end">
          <CButton
            color='primary'
            key='1'
            className="mb-3"
            href='#/pilotage/formprocessus'
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nouvelle processus
          </CButton>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Filtre</strong> 
            </CCardHeader>
            <CCardBody> 
              <CForm className="row g-3">
                <CCol sm={5}>
                  <CFormInput
                    type="text"
                    id="floatingInput"
                    floatingClassName="mb-0"
                    floatingLabel="Processus"
                    placeholder="name@example.com"
                  />
                </CCol>
                <CCol sm={4}>
                  <CategorieProcessusSelect 
                    id="floatingInput"
                    floatingClassName="mb-0"
                    floatingLabel="Catégorie Processus"
                  />
                </CCol>
                <CCol sm={2}>
                  <CFormSelect
                    id="floatingSelect"
                    floatingLabel="Année"
                    aria-label="Floating label select example"
                  >
                    <option value="">2025</option>
                    <option value="2">2024</option>
                    <option value="3">2023</option>
                  </CFormSelect>
                </CCol>
                <CCol sm={1} className="d-flex justify-content-center align-items-center">
                  <CButton color="primary" type="submit">
                    Filtrer
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard className="p-4 mb-4">
        {processusParCategorie.map(cat =>
          cat.processusList.length > 0 && (
            <CategorieProcessusSection
              key={cat.id}
              categorie={cat.categorie}
              processusList={cat.processusList}
              color={cat.color}
            />
          )
        )}
      </CCard>
    </>
  )
}

export default Cartographie
