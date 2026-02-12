import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CRow, CCol, CContainer, CProgress
} from '@coreui/react'
import tcBg from '../../../assets/images/TC_bg.jpg'

const Tableau_indicateur = () => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const navigate = useNavigate()

  const features = [
    {
      id: 1,
      icon: '🧩',
      title: 'Pilotage des Processus',
      description: 'Visualisez et optimisez l\'exécution de vos processus',
      color: '#FFE66D',
      light: '#FFFEF0',
      link: '/cartographie'
    },
    {
      id: 2,
      icon: '📊',
      title: 'Indicateurs de Performance',
      description: 'Suivez vos KPIs en temps réel avec des dashboards intuitifs',
      color: '#4ECDC4',
      light: '#E8F8F7',
      link: '/indicateur/tdb'
    },
    {
      id: 3,
      icon: '🚫',
      title: 'Gestion des Non-Conformités',
      description: 'Identifiez et résolvez les anomalies rapidement',
      color: '#FF6B6B',
      light: '#FFE5E5',
      link: '/nc/list'
    },
    {
      id: 4,
      icon: '✅',
      title: 'Suivi des Actions',
      description: 'Orchestrez les plans d\'actions et leurs résultats',
      color: '#95E1D3',
      light: '#F0FBF9',
      link: '/action'
    }
  ]

  const stats = [
    { value: '--%', label: 'Couverture Processus' },
    { value: '24/7', label: 'Disponibilité' },
    { value: '+300', label: 'Utilisateurs' }
  ]

  return (
    <CContainer fluid className="px-4 py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section Améliorée */}
      <div className="mb-5">
        <CCard 
          style={{ 
            background: `linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%), url(${tcBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff', 
            border: 'none',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)',
            overflow: 'hidden',
            position: 'relative'
          }}
          className="border-0"
        >
          {/* Décoration SVG */}
          {/* <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            opacity: 0.1,
            fontSize: '150px'
          }}>
            📊
          </div> */}

          <CCardBody className="p-5 position-relative z-1">
            <div className="mb-3">
              <h1 style={{ 
                fontSize: '3.5rem', 
                fontWeight: 900, 
                marginBottom: '1rem',
                letterSpacing: '-1px'
              }}>
                Bienvenue
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                opacity: 0.95, 
                marginBottom: 0,
                fontWeight: 300
              }}>
                Système de Management Intégré
              </p>
            </div>
            
            <div className="mt-5" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              {stats.map((stat, idx) => (
                <div key={idx} style={{ 
                  borderRight: idx < stats.length - 1 ? '2px solid rgba(255,255,255,0.2)' : 'none',
                  paddingRight: '2rem'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CCardBody>
        </CCard>
      </div>

      {/* Section des Fonctionnalités */}
      <div className="mb-5">
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          color: '#2c3e50'
        }}>
          Nos Services Clés
        </h2>
        
        <CRow className="g-4">
          {features.map((feature) => (
            <CCol xs={12} md={6} lg={3} key={feature.id}>
              <div
                onClick={() => navigate(feature.link)}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '2rem',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === feature.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCard === feature.id 
                    ? `0 20px 40px rgba(0, 0, 0, 0.1)` 
                    : '0 4px 15px rgba(0, 0, 0, 0.05)',
                  borderLeft: `5px solid ${feature.color}`
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  background: feature.light,
                  width: '70px',
                  height: '70px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#2c3e50',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  fontSize: '0.95rem',
                  color: '#7f8c8d',
                  marginBottom: 0,
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>

                <div style={{
                  marginTop: '1.5rem',
                  height: '3px',
                  background: feature.light,
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: feature.color,
                    width: hoveredCard === feature.id ? '100%' : '0%',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            </CCol>
          ))}
        </CRow>
      </div>

      {/* Section Rappel des Avantages */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#2c3e50',
          marginBottom: '1.5rem'
        }}>
          Transformez votre Management
        </h2>
        <p style={{
          fontSize: '1.05rem',
          color: '#7f8c8d',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.8
        }}>
          Le SMI vous permet de centraliser vos données, d'automatiser vos processus et de prendre des décisions éclairées basées sur des données en temps réel.
        </p>
      </div>

    </CContainer>
  )
}

export default Tableau_indicateur
