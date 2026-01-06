import React from 'react'
import { CButton, CCol, CContainer, CRow, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilWarning } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Page403 = () => {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: '#f0f0f0',
      }}>

      <style>{`
        .error-card {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={6} md={8} xs={12}>
            <div className="text-center mb-5">
              <div className="mb-4" style={{ fontSize: '100px' }}>
                <span className="error-icon">🔐</span>
              </div>
              <h2 className="h3 mb-4" style={{ fontWeight: '300', letterSpacing: '1px' }}>
                Accès Refusé
              </h2>
            </div>

            <CCard className="error-card mb-4">
              <CCardBody className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <CIcon icon={cilWarning} size="lg" className="text-warning me-3" />
                  <h5 className="mb-0">Permissions insuffisantes</h5>
                </div>
                <p className="text-muted mb-2">
                  Vous tentez d'accéder à une ressource protégée. Malheureusement, votre compte ne dispose pas des permissions nécessaires pour accéder à cette page.
                </p>
                <p className="text-muted small mb-0">
                  Si vous pensez que c'est une erreur, contactez votre administrateur système.
                </p>
              </CCardBody>
            </CCard>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {/* <CButton 
                color="secondary"
                onClick={() => navigate('/')}
                className="px-4 py-2 fw-semibold"
                style={{ transition: 'all 0.3s ease' }}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Retour à l'accueil
              </CButton> */}
              {/* <CButton 
                color="secondary"
                onClick={() => navigate(-1)}
                className="px-4 py-2 fw-semibold"
                style={{ transition: 'all 0.3s ease' }}
              >
                Page précédente
              </CButton> */}
            </div>

            <div className="mt-5 text-center">
              <p className="text-dark-50 small">
                Code d'erreur: <span className="badge bg-danger">403 Forbidden</span>
              </p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page403
