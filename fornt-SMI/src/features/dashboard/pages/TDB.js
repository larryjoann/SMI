import React, { useState, useMemo } from 'react'
import {
    CCard, CCardBody, CCardHeader, CCol, CRow,
  CForm,
  CFormInput,
    CFormSelect,
    CButton,
  CWidgetStatsB , CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilChartPie, 
  cilFilterX,
  cilFilter,
  cilChartLine,
  cilAvTimer,
  cilBellExclamation
 } from '@coreui/icons'
import { CChartLine } from '@coreui/react-chartjs'
import ProcessusMultiSelectFloating from 'src/components/champs/ProcessusMultiSelectFloating'
const Tableau_indicateur = () => {
  const [processus, setProcessus] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Base months (YYYY-MM) for 2025 and their display labels
  const baseMonths = [
    '2025-01','2025-02','2025-03','2025-04','2025-05','2025-06',
    '2025-07','2025-08','2025-09','2025-10','2025-11','2025-12',
  ]
  const monthLabels = [
    'January','February','March','April','May','June',
    'July','August','Septembre','Octobre','Novembre','Décembre',
  ]

  // Datasets must match baseMonths length (12 values)
  const dataset1 = [65, 59, 80, 81, 56, 55, 40, 72, 68, 74, 88, 75]
  const dataset2 = [28, 48, 40, 19, 86, 27, 90, 50, 33, 60, 45, 50]
  const dataset3 = [45, 69, 60, 91, 66, 75, 50, 62, 78, 84, 78, 82]

  // Compute filtered labels and datasets based on startDate & endDate
  const { labelsFiltered, datasetsFiltered } = useMemo(() => {
    const start = startDate && baseMonths.includes(startDate) ? startDate : baseMonths[0]
    const end = endDate && baseMonths.includes(endDate) ? endDate : baseMonths[baseMonths.length - 1]
    const realStart = start <= end ? start : end
    const realEnd = start <= end ? end : start

    const indices = baseMonths
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m >= realStart && m <= realEnd)
      .map(({ i }) => i)

    const labelsFiltered = indices.map((i) => monthLabels[i])

    const datasetsFiltered = [
      {
        label: 'Taux de cloture NC',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(153, 201, 171, 1)',
        pointBackgroundColor: 'rgba(151, 205, 171, 1)',
        pointBorderColor: '#fff',
        data: indices.map((i) => dataset1[i]),
      },
      {
        label: 'Taux de cloture PA',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: indices.map((i) => dataset2[i]),
      },
      {
        label: 'Taux de realisation des actions',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        borderDash: [6, 4],
        borderWidth: 2,
        data: indices.map((i) => dataset3[i]),
      },
    ]

    return { labelsFiltered, datasetsFiltered }
  }, [startDate, endDate])

  const resetFilters = () => {
    setProcessus([])
    setStartDate('')
    setEndDate('')
  }

  return (
        <>
            <CCard>
                <CCardHeader>
                    <span className='h6'>Filtre</span>
                </CCardHeader>
                <CCardBody>
                  <CForm className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <CCol sm={4}>
                        <ProcessusMultiSelectFloating
                            floatingClassName="mb-0"
                            floatingLabel="Processus"
                            placeholder="Sélectionner des processus"
                            value={processus}
                            onChange={(val) => setProcessus(val)}
                        />
                        </CCol>
                        <CCol sm={3}>
                        <div className="form-floating">
                            <CFormInput
                            id="startDate"
                            type="month"
                            placeholder=" "
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            />
                            <label htmlFor="startDate">Du</label>
                        </div>
                        </CCol>
                        <CCol sm={3}>
                        <div className="form-floating">
                            <CFormInput
                            id="endDate"
                            type="month"
                            placeholder=" "
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            />
                            <label htmlFor="endDate">Au</label>
                        </div>
                        </CCol>
                        <CCol sm={2} className="d-flex justify-content-center align-items-center">
                          <CButton color="danger" className="me-2" type="button" onClick={resetFilters}>
                            <CIcon icon={cilFilterX} />
                          </CButton>
                          <CButton color='primary' key='1' type='button' onClick={() => { /* filter is reactive via state */ }}>
                            <CIcon icon={cilFilter} className="me-2" />
                            Filtrer
                          </CButton>
                        </CCol>
                    </CForm>
                </CCardBody>
            </CCard>
            <CRow className="mt-3">
                <CCol xs={12} md={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilChartLine} height={30} />}
            title="Avancement moyenne des actions"
            value={<span style={{ fontSize: '1.6rem', fontWeight: 700 }}>47.42%</span>}
          />  
                </CCol>
                <CCol xs={12} md={4}>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            icon={<CIcon icon={cilAvTimer} height={30} />}
            title="taux de respect des delais des actions"
            value={<span style={{ fontSize: '1.6rem', fontWeight: 700 }}>100%</span>}
          />  
                </CCol>
                <CCol xs={12} md={4}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilBellExclamation} height={30} />}
            title="Actions en retard"
            value={<span style={{ fontSize: '1.6rem', fontWeight: 700 }}>0</span>}
          />        
                </CCol>
            </CRow>
            <CCard className="mb-4">
          <CCardHeader>
            <span className='h6'>Graphique des taux de clôture</span>
          </CCardHeader>
          <CCardBody>
                    <CChartLine
                      height={90}
                      options={{
                        scales: {
                          x: {
                            title: { display: true, text: `Periode : ${baseMonths[0]} - ${baseMonths[baseMonths.length - 1]}` },
                          },
                          y: {
                            title: { display: true, text: 'Taux en (%)' },
                            beginAtZero: true,
                            suggestedMax: 100,
                          },
                        },
                      }}
                      data={{
                        labels: labelsFiltered,
                        datasets: datasetsFiltered,
                      }}
                    />
          </CCardBody>
        </CCard>
        </>
    
  )
}

export default Tableau_indicateur
