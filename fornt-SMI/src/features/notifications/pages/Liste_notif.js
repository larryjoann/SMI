import React from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CFormInput,
    CInputGroupText,
    CInputGroup,
    CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilInfo, cilCheckCircle, cilWarning } from '@coreui/icons';
import API_URL from '../../../api/API_URL';
import axiosInstance from '../../../api/axiosInstance'
import { useEffect, useState } from 'react';
import NotificationAlert from '../../../components/notification/Notifications';
import { useNavigate } from 'react-router-dom'

// We'll fetch notifications from the backend and split into unread/read sections


const Liste_notif = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [marking, setMarking] = useState(false)

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true)
            setError(null)
            try {
                const url = '/Notification/by-collaborator'
                const res = await axiosInstance.get(url)
                if (!res || (res.status && res.status >= 400)) {
                    const body = (res && res.data) ? JSON.stringify(res.data) : ''
                    throw new Error(body || `Erreur serveur (${res?.status})`)
                }
                const json = res.data
                // Log notifications list as formatted JSON to the browser console
                try {
                    console.log('Notifications JSON:', JSON.stringify(json, null, 2))
                } catch (e) {
                    console.log('Notifications (raw):', json)
                }
                // Display fetched notifications immediately
                setNotifications(Array.isArray(json) ? json : [])
            } catch (err) {
                console.error('fetchNotifications error', err)
                setError(err?.message || 'Erreur lors du chargement des notifications')
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [])
    const displayItems = Array.isArray(notifications) ? notifications : []

    const navigate = useNavigate()

    const handleMarkAllAsRead = async () => {
        setMarking(true)
        try {
            const markUrl = '/Notification/mark-all-read'
            const markRes = await axiosInstance.get(markUrl)
            if (markRes && markRes.status >= 200 && markRes.status < 300) {
                // update local list to reflect read state
                setNotifications(prev => prev.map(n => ({ ...n, lue: 1 })))
                console.log('All notifications marked as read')
            } else {
                console.warn('mark-all-read returned non-2xx status', markRes && markRes.status)
            }
        } catch (err) {
            console.error('Error calling mark-all-read:', err)
        } finally {
            setMarking(false)
        }
    }

    const handleClick = (n) => {
        try {
            if (!n || !n.entite) return
            const entId = n.entite.id
            const objId = n.idObject || n.idObjet || n.idObject
            if (!objId) return
            if (entId === 2 || (n.entite.nom && /non[- ]?conformi/i.test(n.entite.nom))) {
                navigate(`/nc/list/fiche/${objId}`)
                return
            }
            if (entId === 3 || (n.entite.nom && /plan d'?action|plan[- ]?action/i.test(n.entite.nom))) {
                navigate(`/pa/list/fiche/${objId}`)
                return
            }
            if (entId === 4 || (n.entite.nom && /action/i.test(n.entite.nom))) {
                navigate(`/action/fiche/${objId}`)
                return
            }
        } catch (err) {
            console.error('handleClick notification', err)
        }
    }

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader className="text-center d-flex justify-content-between align-items-center">
                            <strong>Mes Notifications</strong>
                            <CButton 
                                color="secondary" 
                                size="sm" 
                                onClick={handleMarkAllAsRead}
                                disabled={marking || notifications.length === 0}
                            >
                                {marking ? 'Marquage...' : 'Marquer tout comme lu'}
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row gx-3 gy-2 align-items-center mb-4">
                                <CCol sm={12}>
                                    <CInputGroup>
                                        <CFormInput id="specificSizeInputGroupUsername" placeholder="Rechercher ..." />
                                        <CInputGroupText>
                                            <CIcon icon={cilSearch} />
                                        </CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                            </CForm>

                            {loading && <div>Chargement...</div>}
                            {error && <div className="text-danger">{error}</div>}

                            {!loading && !error && (
                                <>
                                    {displayItems.length === 0 && <div className="text-muted mb-3">Aucune notification</div>}
                                    {displayItems.map((n, index) => {
                                        const clickable = n && n.entite && ([2,3,4].includes(n.entite.id) || (n.entite.nom && (/non[- ]?conformi/i.test(n.entite.nom) || /plan d'?action|plan[- ]?action/i.test(n.entite.nom) || /action/i.test(n.entite.nom))))
                                        return (
                                            <div
                                                key={n.id}
                                                onClick={() => clickable ? handleClick(n) : null}
                                                style={{ cursor: clickable ? 'pointer' : 'default' }}
                                            >
                                                <NotificationAlert
                                                    color={n.lue === false ? 'dark' : 'light'}
                                                    icon={n.entite && n.entite.id === 2 ? cilWarning : cilInfo}
                                                    title={n.titre}
                                                    message={n.contenu}
                                                    date={new Date(n.datetimeNotification).toLocaleString()}
                                                />
                                            </div>
                                        )
                                    })}
                                </>
                            )}

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CRow className="mt-0 justify-content-center">
                <CCol xs="auto">
                    <CButton color="secondary">Voir les notifications précédentes</CButton>
                </CCol>
            </CRow>
        </>
    )
};

export default Liste_notif;