import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CButton,
} from '@coreui/react'
import myLogo from 'src/assets/images/logo.png'
import { CAlert } from '@coreui/react'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
  const [matricule, setMatricule] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login, error, loading } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(matricule, password, () => navigate('/notifications'))
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5} sm={12} xs={12}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="d-flex flex-column align-items-center text-center mb-3">
                    <img src={myLogo} alt="Logo" height={130} className="sidebar-brand-full mb-2"/>
                    <h1>S.M.I</h1>
                  </div>
                  {error && (
                    <CAlert color="danger" className='text-center'>{error}</CAlert>
                  )}
                  <CForm onSubmit={handleSubmit}>
                    <CFormInput
                      placeholder="Matricule"
                      autoComplete="Matricule"
                      label="Matricule"
                      className='mb-4'
                      value={matricule}
                      onChange={e => setMatricule(e.target.value)}
                    />
                    <CFormInput
                      type="password"
                      placeholder="******"
                      autoComplete="current-password"
                      label="Mot de passe"
                      className='mb-4'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <CRow>
                      <CCol md={12} sm={12} xs={12} className='d-grid'>
                        <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                          {loading ? 'Connexion...' : 'Se connecter'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login