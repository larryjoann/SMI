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
    CInputGroup
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilInfo, cilCheckCircle, cilWarning } from '@coreui/icons';
import NotificationAlert from '../../../components/notification/Notifications';

const notifications = [
    {
        section: 'Non lu(s)',
        items: [
            {
                color: 'danger',
                icon: cilWarning,
                title: 'Non conformité rejeté',
                message: 'blaaaaaaaaaaa...............',
                date: '12/05/2025 11:05:00 AM',
            },
            {
                color: 'secondary',
                icon: cilInfo,
                title: 'Un non conformité a ete declare par Larry Joann RANDRIANIRINA(DQRSE)',
                message: 'blaaaaaaaaaaa...............',
                date: '12/05/2025 11:05:00 AM',
            },
        ],
    },
    {
        section: 'Hier',
        items: [
            {
                color: 'success',
                icon: cilCheckCircle,
                title: 'Votre non-conformité a ete cloturé',
                message: 'blaaaaaaaaaaa...............',
                date: '12/05/2025 11:05:00 AM',
            },
            {
                color: 'danger',
                icon: cilWarning,
                title: 'Non conformité rejeté',
                message: 'blaaaaaaaaaaa...............',
                date: '12/05/2025 11:05:00 AM',
            },
        ],
    },
];

const Liste_notif = () => (
    <CRow>
        <CCol xs={12}>
            <CCard className="mb-4">
                <CCardHeader className="text-center">
                    <strong>Mes Notifications</strong>
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
                    {notifications.map((section, idx) => (
                        <React.Fragment key={section.section}>
                            <h6>{section.section}</h6>
                            {section.items.map((notif, i) => (
                                <NotificationAlert
                                    key={i}
                                    color={notif.color}
                                    icon={notif.icon}
                                    title={notif.title}
                                    message={notif.message}
                                    date={notif.date}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
);

export default Liste_notif;