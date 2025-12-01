import {
  CAlert,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getAnalyseSpcPeriodParcTypeConsommOptions } from '../../../hooks/useRapports'
import { useParcs } from '../../../hooks/useParcs'
import { useTypelubrifiants } from '../../../hooks/useTypelubrifiants'
import ChartCustom from '../../../components/ChartCustom'
import { toast } from 'react-toastify'
import { exportExcel } from '../../../helpers/func'
import CIcon from '@coreui/icons-react'
import { cilChart, cilCloudDownload } from '@coreui/icons'

const SpeByParcByLubByTypeConsomm = () => {
  const [dateDu, setDateDu] = useState(new Date().toISOString().split('T')[0])
  const [dateAu, setDateAu] = useState(new Date().toISOString().split('T')[0])
  const [selectedParc, setSelectedParc] = useState('')
  const [selectedTypelubrifiant, setSelectedTypelubrifiant] = useState('')
  const [error, setError] = useState(null)

  // CORRECTION : Syntaxe correcte pour useQuery
  const getAllParcsQuery = useQuery({
    queryKey: ['parcs'],
    queryFn: useParcs().queryFn,
  })

  const getAllTypelubrifiantsQuery = useQuery({
    queryKey: ['typelubrifiants'],
    queryFn: useTypelubrifiants().queryFn,
  })

  // CORRECTION : Syntaxe correcte pour useQuery
  const getAnalyse = useQuery({
    ...getAnalyseSpcPeriodParcTypeConsommOptions(
      selectedParc,
      dateDu,
      dateAu,
      selectedTypelubrifiant,
    ),
    enabled: false,
  })

  const handleClick = () => {
    setError(null)

    if (dateDu > dateAu) {
      setError('Attention la date Du doit être >= dateAu')
      toast.warn('Attention la date Du doit être >= dateAu')
      getAnalyse.remove() // Reset the query
      return
    }

    getAnalyse.refetch()
  }

  const hasData =
    !getAnalyse.isFetching &&
    !error &&
    selectedParc !== '' &&
    selectedTypelubrifiant !== '' &&
    getAnalyse?.data?.length > 0

  const selectedParcName = selectedParc
    ? getAllParcsQuery.data?.find((p) => p.id === selectedParc)?.name
    : ''

  const selectedTypeLubName = selectedTypelubrifiant
    ? getAllTypelubrifiantsQuery.data?.find((t) => t.id === selectedTypelubrifiant)?.name
    : ''

  return (
    <CCard className="custom-card">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <CIcon icon={cilChart} className="me-2" />
          Analyse des Causes de Consommation
        </h5>
        <CButton
          disabled={getAnalyse.isFetching || !getAnalyse?.data}
          onClick={() =>
            exportExcel('tbl_analyse_consommation', 'Analyse des causes de consommation')
          }
          size="sm"
          color="success"
          variant="outline"
          className="rounded-pill"
        >
          <CIcon icon={cilCloudDownload} className="me-1" />
          Excel
        </CButton>
      </CCardHeader>

      <CCardBody>
        {/* Contrôles de filtre */}
        <CRow className="g-3 mb-4">
          <CCol md={3}>
            <CFormSelect
              floatingLabel="Choisir un parc"
              value={selectedParc}
              onChange={(e) => setSelectedParc(e.target.value)}
              disabled={getAllParcsQuery.isLoading}
            >
              <option value="">Liste des parcs</option>
              {getAllParcsQuery.data?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={3}>
            <CFormSelect
              floatingLabel="Choisir un lubrifiant"
              value={selectedTypelubrifiant}
              onChange={(e) => setSelectedTypelubrifiant(e.target.value)}
              disabled={getAllTypelubrifiantsQuery.isLoading}
            >
              <option value="">Liste des typelubrifiants</option>
              {getAllTypelubrifiantsQuery.data?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={2}>
            <CFormInput
              type="date"
              floatingLabel="Du"
              value={dateDu}
              onChange={(e) => setDateDu(e.target.value)}
              disabled={getAnalyse.isFetching}
            />
          </CCol>

          <CCol md={2}>
            <CFormInput
              type="date"
              floatingLabel="Au"
              value={dateAu}
              onChange={(e) => setDateAu(e.target.value)}
              disabled={getAnalyse.isFetching}
            />
          </CCol>

          <CCol md={2} className="d-flex align-items-end">
            <CButton
              disabled={
                getAnalyse.isFetching ||
                !selectedParc ||
                !dateDu ||
                !dateAu ||
                !selectedTypelubrifiant
              }
              onClick={handleClick}
              color="primary"
              className="w-100"
            >
              <div className="d-flex gap-1 align-items-center justify-content-center">
                {getAnalyse.isFetching && <CSpinner size="sm" />}
                <div>Générer</div>
              </div>
            </CButton>
          </CCol>
        </CRow>

        {/* Message d'erreur */}
        {error && (
          <CAlert color="danger" className="text-center mb-3">
            {error}
          </CAlert>
        )}

        {/* Résultats */}
        {hasData && (
          <CRow>
            <CCol md={6}>
              <div className="table-responsive">
                <CTable
                  responsive
                  striped
                  hover
                  size="sm"
                  className="text-center align-middle"
                  id="tbl_analyse_consommation"
                  color=""
                >
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell colSpan={3} className="text-center">
                        <strong>
                          Analyse pour {selectedTypeLubName} - {selectedParcName}
                        </strong>
                        <br />
                        <small className="text-body-secondary">
                          Du {dateDu.split('-').reverse().join('/')} au{' '}
                          {dateAu.split('-').reverse().join('/')}
                        </small>
                      </CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>Code</CTableHeaderCell>
                      <CTableHeaderCell>Quantité</CTableHeaderCell>
                      <CTableHeaderCell>Pourcentage</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {getAnalyse.data.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="fw-medium">
                          <CBadge color="primary">{item?.name || 'N/A'}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="fw-bold text-success-emphasis">
                          {item?.sum || '0'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={parseFloat(item?.percentage) > 50 ? 'success' : 'info'}>
                            {item?.percentage || '0'}%
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="chart-container">
                <ChartCustom
                  data={getAnalyse.data}
                  xDataKey="name"
                  barDataKeys={['percentage']}
                  type="bar"
                  title={`Répartition des causes - ${selectedTypeLubName}`}
                  height={400}
                  // Passer des couleurs adaptatives pour ChartCustom
                  colors={['#321fdb']} // ou utiliser des couleurs dynamiques
                />
              </div>
            </CCol>
          </CRow>
        )}

        {/* États vides */}
        {!getAnalyse.isFetching &&
          getAnalyse?.data?.length === 0 &&
          !error &&
          selectedParc !== '' &&
          selectedTypelubrifiant !== '' && (
            <div className="text-center py-5">
              <CIcon icon={cilChart} size="xl" className="mb-3 text-body-secondary" />
              <h5 className="text-body">Aucune donnée disponible</h5>
              <p className="text-body-secondary">
                Aucune consommation n'est enregistrée pour les critères sélectionnés.
              </p>
            </div>
          )}

        {/* Chargement */}
        {getAnalyse.isFetching && (
          <div className="text-center py-5">
            <CSpinner color="primary" size="lg" />
            <div className="mt-3 text-body">Analyse des données en cours...</div>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default SpeByParcByLubByTypeConsomm
