import React, { useEffect, useState } from 'react'
import {
  CCol,
  CRow,
  CCard, CCardBody, CCardHeader, 
  CForm, CFormInput, CFormSelect, CButton,  
  CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilWarning, cilFilter } from '@coreui/icons'
import CategorieProcessusSection from '../components/CategorieProcessusSection'
import API_URL from '../../../api/API_URL'
import CategorieProcessusSelect from '../../../components/champs/CategorieProcessusSelect'
import { Pop_up } from '../../../components/notification/Pop_up' // Ajoute l'import

const Cartographie = () => {
  const [processus, setProcessus] = useState([])
  const [categories, setCategories] = useState([])
  // Etats pour le filtre
  const [inputNom, setInputNom] = useState('')
  const [inputCategorie, setInputCategorie] = useState('')
  const [filterNom, setFilterNom] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')
  // Pour le modal de suppression
  const [modalVisible, setModalVisible] = useState(false)
  const [processusToDelete, setProcessusToDelete] = useState(null)

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

  // Demande la confirmation avant suppression
  const askDeleteProcessus = (id) => {
    setProcessusToDelete(id)
    setModalVisible(true)
  }

  // Supprime le processus après confirmation
  const confirmDeleteProcessus = async () => {
    if (!processusToDelete) return
    try {
      const res = await fetch(`${API_URL}/Processus/${processusToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProcessus(prev => prev.filter(p => p.id !== processusToDelete))
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
    setModalVisible(false)
    setProcessusToDelete(null)
  }

  // Filtrage des processus
  const processusFiltres = processus.filter(p => {
    // Filtre par nom
    const nomMatch = filterNom.trim() === '' || p.nom.toLowerCase().includes(filterNom.trim().toLowerCase());
    // Filtre par catégorie
    const catMatch = filterCategorie === '' || p.idCategorieProcessus === Number(filterCategorie);
    return nomMatch && catMatch;
  });

  const processusParCategorie = categories.map(cat => ({
    categorie: cat.nom,
    id: cat.id,
    color: categorieColors[cat.id] || 'light',
    processusList: processusFiltres
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
        onDelete: () => askDeleteProcessus(p.id),
        onEdit: () => navigate(`/pilotage/formprocessus/${p.id}`),
        onClick: () => navigate(`/pilotage/ficheprocessus/${p.id}`),
      })),
  }));

  return (
    <>
      <Pop_up
        show={showToast}
        setShow={setShowToast}
        type={popType}
        message={popMessage}
      />
      {/* Modal de confirmation suppression */}
      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="deleteProcessusModal"
      >
        <CModalHeader>
          <CModalTitle id="deleteProcessusModal" className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-4 text-danger" size='lg' />
            <span className="text-danger">Confirmation</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Voulez-vous vraiment supprimer ce processus ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Non
          </CButton>
          <CButton color="danger" onClick={confirmDeleteProcessus}>
            Oui
          </CButton>
        </CModalFooter>
      </CModal>
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
              <CForm className="row g-3" onSubmit={e => {
                e.preventDefault();
                setFilterNom(inputNom);
                setFilterCategorie(inputCategorie);
              }}>
                <CCol xs={5}>
                  <CFormInput
                    type="text"
                    id="floatingInput"
                    floatingClassName="mb-0"
                    floatingLabel="Processus"
                    placeholder="Nom du processus"
                    value={inputNom}
                    onChange={e => setInputNom(e.target.value)}
                  />
                </CCol>
                <CCol xs={5}>
                  <CategorieProcessusSelect 
                    id="floatingInput"
                    floatingClassName="mb-0"
                    floatingLabel="Catégorie Processus"
                    value={inputCategorie}
                    onChange={e => setInputCategorie(e.target.value)}
                    allowEmpty={true}
                  />
                </CCol>
                <CCol xs={2} className="d-flex justify-content-center align-items-center">
                  <CButton
                    color='primary'
                    key='1'
                    type='submit'
                  >
                    <CIcon icon={cilFilter} className="me-2" />
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
