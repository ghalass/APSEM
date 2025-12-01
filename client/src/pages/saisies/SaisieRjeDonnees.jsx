import React, { useState, useMemo } from 'react'
import {
  CButton,
  CFormInput,
  CSpinner,
  CTable,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CBadge,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import { useGetSaisieHrmDay } from '../../hooks/useSaisieRje'
import { exportExcel } from '../../helpers/func'
import { cilSearch, cilCloudDownload, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const SaisieRjeDonnees = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [searchFilters, setSearchFilters] = useState({
    typeparc: '',
    parc: '',
    engin: '',
    site: '',
  })

  const { data, isFetching, isError, error, refetch } = useQuery(useGetSaisieHrmDay(date))

  // Filtrage des données avec useMemo pour optimiser les performances
  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter((item) =>
      Object.entries(searchFilters).every(([key, value]) => {
        const itemValue = item[key] || ''
        return itemValue.toString().toLowerCase().includes(value.toLowerCase())
      }),
    )
  }, [data, searchFilters])

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerateReport = () => {
    refetch()
  }

  const handleExportExcel = () => {
    if (filteredData.length > 0) {
      exportExcel('tbl_donnees_saisies', `Données_saisies_${date}`)
    }
  }

  const clearFilters = () => {
    setSearchFilters({
      typeparc: '',
      parc: '',
      engin: '',
      site: '',
    })
  }

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredData.length) return null

    return {
      totalEntries: filteredData.length,
      totalHRM: filteredData.reduce((sum, item) => sum + (item.hrm || 0), 0),
      totalHIM: filteredData.reduce((sum, item) => sum + (item.him || 0), 0),
      uniqueEngins: new Set(filteredData.map((item) => item.engin)).size,
    }
  }, [filteredData])

  const formatDate = (dateString) => {
    return dateString.split('-').reverse().join('-')
  }

  return (
    <CCard>
      <CCardHeader>
        <h5 className="mb-0">Données de Saisie RJE</h5>
        <small className="text-muted">Consultation et export des données HRM/HIM saisies</small>
      </CCardHeader>

      <CCardBody>
        {/* Contrôles principaux */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <CFormInput
              type="month"
              label="Période de saisie"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isFetching}
            />
          </div>

          <div className="col-md-9 d-flex align-items-end gap-2">
            <CButton
              color="primary"
              onClick={handleGenerateReport}
              disabled={isFetching}
              className="d-flex align-items-center"
            >
              {isFetching ? (
                <CSpinner size="sm" className="me-2" />
              ) : (
                <CIcon icon={cilReload} className="me-2" />
              )}
              Générer le rapport
            </CButton>

            <CButton
              color="success"
              onClick={handleExportExcel}
              disabled={isFetching || filteredData.length === 0}
              className="d-flex align-items-center"
            >
              <CIcon icon={cilCloudDownload} className="me-2" />
              Exporter Excel
            </CButton>

            {(searchFilters.typeparc ||
              searchFilters.parc ||
              searchFilters.engin ||
              searchFilters.site) && (
              <CButton color="secondary" variant="outline" onClick={clearFilters} size="sm">
                Effacer les filtres
              </CButton>
            )}
          </div>
        </div>

        {/* Filtres de recherche */}
        <div className="row g-3 mb-4">
          {['typeparc', 'parc', 'engin', 'site'].map((field) => (
            <div key={field} className="col-md-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder={`Rechercher par ${field === 'typeparc' ? 'type parc' : field}...`}
                  value={searchFilters[field]}
                  onChange={(e) => handleSearchChange(field, e.target.value)}
                  disabled={isFetching}
                />
              </CInputGroup>
            </div>
          ))}
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h6 className="text-muted mb-1">Total Entrées</h6>
                <h4 className="text-primary mb-0">{stats.totalEntries}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h6 className="text-muted mb-1">Total HRM</h6>
                <h4 className="text-success mb-0">{stats.totalHRM.toFixed(2)}h</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h6 className="text-muted mb-1">Total HIM</h6>
                <h4 className="text-danger mb-0">{stats.totalHIM.toFixed(2)}h</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 text-center">
                <h6 className="text-muted mb-1">Engins Uniques</h6>
                <h4 className="text-warning mb-0">{stats.uniqueEngins}</h4>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {isError && (
          <CAlert color="danger" className="mb-3">
            <strong>Erreur lors du chargement des données :</strong>{' '}
            {error?.message || 'Une erreur est survenue'}
          </CAlert>
        )}

        {/* Tableau des données */}
        <div className="table-responsive" style={{ maxHeight: '600px' }}>
          <CTable
            responsive
            striped
            hover
            size="sm"
            className="align-middle"
            id="tbl_donnees_saisies"
          >
            <thead className="bg-light sticky-top">
              <tr>
                <th colSpan={10} className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Données HRM/HIM saisies pour {formatDate(date)}</span>
                    {filteredData.length > 0 && (
                      <CBadge color="light" className="text-dark">
                        {filteredData.length} entrée(s)
                      </CBadge>
                    )}
                  </div>
                </th>
              </tr>
              <tr>
                <th>Date</th>
                <th>Type Parc</th>
                <th>Parc</th>
                <th>Engin</th>
                <th>Site</th>
                <th className="text-center">HRM</th>
                <th>Panne</th>
                <th className="text-center">HIM</th>
                <th className="text-center">NI</th>
                <th>Lubrifiants</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    <CSpinner size="sm" className="me-2" />
                    Chargement des données...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={`${item.date}-${item.engin}-${index}`}>
                    <td>{formatDate(item.date)}</td>
                    <td>
                      <CBadge color="secondary">{item.typeparc}</CBadge>
                    </td>
                    <td>
                      <CBadge color="info">{item.parc}</CBadge>
                    </td>
                    <td>
                      <strong>{item.engin}</strong>
                    </td>
                    <td>{item.site}</td>
                    <td className="text-center">
                      <span className="badge bg-success">{item.hrm}h</span>
                    </td>
                    <td className="text-start">
                      {item.panne ? (
                        <small className="text-danger">{item.panne}</small>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="text-center">
                      {item.him > 0 ? (
                        <span className="badge bg-warning text-dark">{item.him}h</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="text-center">
                      {item.ni > 0 ? (
                        <span className="badge bg-danger">{item.ni}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {item.lubrifiants?.length > 0 ? (
                        <div>
                          {item.lubrifiants.map((lub, idx) => (
                            <div key={idx} className="small">
                              <CBadge color="light" className="text-dark me-1">
                                {lub.name}
                              </CBadge>
                              <small className="text-muted">({lub.qte})</small>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-muted">
                    {data?.length === 0 ? (
                      <>Aucune donnée disponible pour la période sélectionnée</>
                    ) : (
                      <>Aucun résultat ne correspond aux critères de recherche</>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default SaisieRjeDonnees
