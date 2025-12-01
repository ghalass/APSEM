import React, { useState } from 'react'
import {
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CProgress,
  CAlert,
  CSpinner,
  CBadge,
} from '@coreui/react'
import * as XLSX from 'xlsx'
import { useMutation } from '@tanstack/react-query'
import AdminLayout from '../../layout/AdminLayout'
import { useImport } from '../../hooks/useImports'

const REQUIRED_HEADERS = {
  sites: ['name'],
  typeparcs: ['name'],
  parcs: ['name', 'typeparcName'],
  engins: ['name', 'parcName', 'siteName', 'active', 'initialHeureChassis'],
  typepannes: ['name'],
  pannes: ['name', 'typepanneName'],
  typelubrifiants: ['name'],
  lubrifiants: ['name', 'typelubrifiantName'],
  typeconsommationlub: ['name'],
  saisiehrm: ['du', 'enginName', 'siteName', 'hrm'],
  saisiehim: ['panneName', 'him', 'ni', 'saisiehrmDu', 'enginName', 'obs'],
  saisielubrifiant: ['lubrifiantName', 'qte', 'saisiehimId'],
  objectifs: [
    'annee',
    'parcName',
    'siteName',
    'dispo',
    'mtbf',
    'tdm',
    'spe_huile',
    'spe_go',
    'spe_graisse',
  ],
  roles: ['name'],
  users: ['name', 'email', 'password', 'active'],
}

const HEADER_MAPPINGS = {
  sites: {
    name: 'name',
    'Nom du Site': 'name',
    Site: 'name',
    Nom: 'name',
  },

  typeparcs: {
    name: 'name',
    'Type Parc': 'name',
    'Nom Type': 'name',
    Type: 'name',
  },

  parcs: {
    name: 'name',
    typeparcName: 'typeparcName',
    'Nom Parc': 'name',
    Parc: 'name',
    'Type Parc': 'typeparcName',
    Type: 'typeparcName',
  },

  engins: {
    name: 'name',
    parcName: 'parcName',
    siteName: 'siteName',
    active: 'active',
    initialHeureChassis: 'initialHeureChassis',
    'Nom Engin': 'name',
    Engin: 'name',
    Parc: 'parcName',
    Site: 'siteName',
    Actif: 'active',
    'Heures Chassis Initiales': 'initialHeureChassis',
    'H.Chassis Init': 'initialHeureChassis',
  },

  typepannes: {
    name: 'name',
    'Nom Type Panne': 'name',
    TypePanne: 'name',
  },

  pannes: {
    name: 'name',
    typepanneName: 'typepanneName',
    'Nom Panne': 'name',
    Panne: 'name',
    'Type Panne': 'typepanneName',
  },

  typelubrifiants: {
    name: 'name',
    'Type Lubrifiant': 'name',
    Nom: 'name',
  },

  lubrifiants: {
    name: 'name',
    typelubrifiantName: 'typelubrifiantName',
    'Nom Lubrifiant': 'name',
    Lubrifiant: 'name',
    'Type Lubrifiant': 'typelubrifiantName',
  },

  typeconsommationlub: {
    name: 'name',
    'Type Consommation': 'name',
  },

  saisiehrm: {
    du: 'du',
    enginName: 'enginName',
    siteName: 'siteName',
    hrm: 'hrm',
    Date: 'du',
    Du: 'du',
    Engin: 'enginName',
    'Nom Engin': 'enginName',
    Site: 'siteName',
    HRM: 'hrm',
  },

  saisiehim: {
    panneName: 'panneName',
    him: 'him',
    ni: 'ni',
    saisiehrmDu: 'saisiehrmDu',
    enginName: 'enginName',
    obs: 'obs',
    Panne: 'panneName',
    'Nom Panne': 'panneName',
    HIM: 'him',
    NI: 'ni',
    'Date HRM': 'saisiehrmDu',
    'Du HRM': 'saisiehrmDu',
    Engin: 'enginName',
    Observation: 'obs',
    Obs: 'obs',
  },

  saisielubrifiant: {
    lubrifiantName: 'lubrifiantName',
    qte: 'qte',
    saisiehimId: 'saisiehimId',
    'Nom Lubrifiant': 'lubrifiantName',
    Qte: 'qte',
    Observations: 'obs',
    TypeConsommation: 'typeconsommationlubName',
  },

  objectifs: {
    annee: 'annee',
    parcName: 'parcName',
    siteName: 'siteName',
    dispo: 'dispo',
    mtbf: 'mtbf',
    tdm: 'tdm',
    spe_huile: 'spe_huile',
    spe_go: 'spe_go',
    spe_graisse: 'spe_graisse',
    Année: 'annee',
    Annee: 'annee',
    Parc: 'parcName',
    Site: 'siteName',
    Dispo: 'dispo',
    MTBF: 'mtbf',
    TDM: 'tdm',
    'Spécifique Huile': 'spe_huile',
    'Spécifique GO': 'spe_go',
    'Spécifique Graisse': 'spe_graisse',
  },

  roles: {
    name: 'name',
    Role: 'name',
    'Nom Role': 'name',
  },

  users: {
    name: 'name',
    email: 'email',
    password: 'password',
    active: 'active',
    Nom: 'name',
    Email: 'email',
    MotDePasse: 'password',
    Actif: 'active',
  },
}

export default function ImportPage() {
  const [workbook, setWorkbook] = useState(null)
  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, setSelectedSheet] = useState('')
  const [tableData, setTableData] = useState([])
  const [headers, setHeaders] = useState([])
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [currentProcessingRow, setCurrentProcessingRow] = useState(-1)
  const [processingResults, setProcessingResults] = useState({})
  const [headerValidation, setHeaderValidation] = useState({ isValid: true, errors: [] })

  // Utilisation du hook useImport
  const importMutation = useImport()

  // Vérification des en-têtes - CORRIGÉE
  const validateHeaders = (headers, sheetName) => {
    const requiredHeaders = REQUIRED_HEADERS[sheetName.toLowerCase()]

    if (!requiredHeaders) {
      return {
        isValid: true,
        errors: [],
        warnings: [`Aucune validation configurée pour l'onglet "${sheetName}"`],
      }
    }

    const errors = []
    const warnings = []
    const normalizedHeaders = headers.map((h) => (h ? h.toLowerCase().trim() : ''))

    // Obtenir les noms d'affichage attendus pour cet onglet
    const headerMapping = HEADER_MAPPINGS[sheetName] || {}
    const expectedDisplayNames = requiredHeaders.map((requiredHeader) => {
      // Trouver le nom d'affichage correspondant au champ requis
      for (const [displayName, fieldName] of Object.entries(headerMapping)) {
        if (fieldName === requiredHeader) {
          return displayName.toLowerCase()
        }
      }
      // Si pas de mapping, utiliser le nom du champ formaté
      return requiredHeader.toLowerCase()
    })

    // Vérifier les en-têtes manquants
    expectedDisplayNames.forEach((expectedHeader) => {
      if (!normalizedHeaders.includes(expectedHeader)) {
        // Trouver le nom d'affichage original pour le message d'erreur
        const originalDisplayName =
          Object.keys(headerMapping).find(
            (displayName) => displayName.toLowerCase() === expectedHeader,
          ) || expectedHeader

        errors.push(`En-tête manquant: "${originalDisplayName}"`)
      }
    })

    // Vérifier les en-têtes supplémentaires
    normalizedHeaders.forEach((header, index) => {
      if (header && !expectedDisplayNames.includes(header)) {
        warnings.push(`En-tête non reconnu: "${headers[index]}"`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Gérer l'upload du fichier Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Reset states
    setWorkbook(null)
    setSheetNames([])
    setSelectedSheet('')
    setTableData([])
    setHeaders([])
    setProgress(0)
    setMessage({ type: '', text: '' })
    setCurrentProcessingRow(-1)
    setProcessingResults({})
    setHeaderValidation({ isValid: true, errors: [] })

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        setWorkbook(workbook)
        setSheetNames(workbook.SheetNames)

        setMessage({
          type: 'success',
          text: `Fichier chargé avec succès. ${workbook.SheetNames.length} onglet(s) détecté(s).`,
        })
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error)
        setMessage({ type: 'danger', text: 'Erreur lors de la lecture du fichier Excel' })
      }
    }

    reader.onerror = () => {
      setMessage({ type: 'danger', text: 'Erreur lors de la lecture du fichier' })
    }

    reader.readAsArrayBuffer(file)
  }

  // Gérer la sélection d'un onglet - AMÉLIORÉ
  const handleSheetSelect = (event) => {
    const sheetName = event.target.value
    setSelectedSheet(sheetName)
    setTableData([])
    setHeaders([])
    setProcessingResults({})
    setCurrentProcessingRow(-1)

    if (workbook && sheetName) {
      try {
        const worksheet = workbook.Sheets[sheetName]
        if (!worksheet) {
          setMessage({ type: 'warning', text: `L'onglet "${sheetName}" est vide ou n'existe pas` })
          return
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length > 0) {
          // La première ligne contient les en-têtes
          const headers = jsonData[0].map((header) => header || '')
          // Les lignes suivantes contiennent les données (filtrer les lignes vides)
          const dataRows = jsonData
            .slice(1)
            .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ''))

          // Valider les en-têtes
          const validation = validateHeaders(headers, sheetName)
          setHeaderValidation(validation)

          setHeaders(headers)
          setTableData(dataRows)

          if (!validation.isValid || validation.warnings.length > 0) {
            setMessage({
              type: validation.isValid ? 'warning' : 'danger',
              text: `Problèmes détectés dans l'onglet "${sheetName}"`,
            })
          } else {
            setMessage({
              type: 'success',
              text: `Onglet "${sheetName}" chargé: ${dataRows.length} ligne(s) de données`,
            })
          }
        } else {
          setHeaders([])
          setTableData([])
          setHeaderValidation({ isValid: true, errors: [], warnings: [] })
          setMessage({ type: 'warning', text: `L'onglet "${sheetName}" ne contient aucune donnée` })
        }
      } catch (error) {
        console.error("Erreur lors de la lecture de l'onglet:", error)
        setMessage({ type: 'danger', text: "Erreur lors de la lecture de l'onglet sélectionné" })
      }
    }
  }

  // Fonction de formatage des données - CORRIGÉE
  const formatRowData = (row, headers, sheetName) => {
    const formatted = {}
    headers.forEach((header, index) => {
      if (header && row[index] !== undefined && row[index] !== null && row[index] !== '') {
        const mappedHeader = HEADER_MAPPINGS[sheetName]?.[header] || header
        formatted[mappedHeader] = row[index]
      }
    })
    return formatted
  }

  // Fonction pour traiter une ligne individuelle avec useImport
  const processRowWithImport = async (rowData, index) => {
    try {
      // Utilisation de la mutation useImport avec promesse
      const result = await new Promise((resolve, reject) => {
        importMutation.mutate(
          {
            sheetName: selectedSheet,
            data: rowData,
          },
          {
            onSuccess: (data) => {
              // Vérifier si la réponse contient un message d'erreur détaillé
              if (data && data.data && data.data.length > 0) {
                const rowResult = data.data[0]
                resolve({
                  success: rowResult.success,
                  message: rowResult.message,
                  data: rowResult.data,
                })
              } else {
                resolve({
                  success: true,
                  message: data.message || `Ligne ${index + 1} importée avec succès`,
                  data: data,
                })
              }
            },
            onError: (error) => {
              resolve({
                success: false,
                message: `Erreur ligne ${index + 1}: ${error.message}`,
                data: null,
              })
            },
          },
        )
      })

      return result
    } catch (error) {
      return {
        success: false,
        message: `Erreur ligne ${index + 1}: ${error.message}`,
        data: null,
      }
    }
  }

  // Fonction principale d'import - CORRIGÉE avec useImport
  const submit = async () => {
    if (!selectedSheet || tableData.length === 0) {
      setMessage({ type: 'warning', text: 'Veuillez sélectionner un onglet avec des données' })
      return
    }

    if (!headerValidation.isValid) {
      setMessage({
        type: 'danger',
        text: 'Veuillez corriger les erreurs dans les en-têtes avant de continuer',
      })
      return
    }

    setIsLoading(true)
    setProgress(0)
    setCurrentProcessingRow(-1)
    setProcessingResults({})
    setMessage({ type: 'info', text: 'Début du traitement des données...' })

    try {
      const totalRows = tableData.length
      let successfulRows = 0
      let failedRows = 0
      const detailedResults = []

      for (let index = 0; index < totalRows; index++) {
        // Mettre à jour la ligne en cours de traitement
        setCurrentProcessingRow(index)

        const rowData = tableData[index]
        const formattedData = formatRowData(rowData, headers, selectedSheet)

        // Vérifier si la ligne contient des données
        if (Object.keys(formattedData).length === 0) {
          const result = {
            success: false,
            message: `Ligne ${index + 1} ignorée (données vides)`,
            data: null,
          }
          setProcessingResults((prev) => ({
            ...prev,
            [index]: result,
          }))
          detailedResults.push(result)
          failedRows++
          continue
        }

        // Traitement avec useImport hook
        const result = await processRowWithImport(formattedData, index)

        setProcessingResults((prev) => ({
          ...prev,
          [index]: result,
        }))
        detailedResults.push(result)

        if (result.success) {
          successfulRows++
        } else {
          failedRows++
        }

        // Mise à jour de la progression
        const newProgress = Math.round(((index + 1) / totalRows) * 100)
        setProgress(newProgress)

        // Mise à jour du message avec détails en temps réel
        const errorMessages = detailedResults
          .filter((r) => !r.success)
          .map((r) => r.message)
          .join(' | ')

        setMessage({
          type: 'info',
          text: `Traitement en cours... ${index + 1}/${totalRows} lignes traitées (${successfulRows} ✓, ${failedRows} ✗)${errorMessages ? ` | Erreurs: ${errorMessages}` : ''}`,
        })
      }

      // Réinitialiser la ligne en cours de traitement
      setCurrentProcessingRow(-1)

      // Résultat final avec détails des erreurs
      const errorDetails = detailedResults
        .filter((r) => !r.success)
        .map((r) => r.message)
        .join(' | ')

      setIsLoading(false)

      if (successfulRows === totalRows) {
        setMessage({
          type: 'success',
          text: `Traitement terminé avec succès ! ${successfulRows} ligne(s) importée(s)`,
        })
      } else if (successfulRows > 0) {
        setMessage({
          type: 'warning',
          text: `Traitement partiellement réussi : ${successfulRows} succès, ${failedRows} échecs. ${errorDetails}`,
        })
      } else {
        setMessage({
          type: 'danger',
          text: `Échec du traitement : ${failedRows} échecs. ${errorDetails}`,
        })
      }

      // Affichage des résultats dans la console
      console.log('=== RÉSULTATS DU TRAITEMENT ===')
      console.log(`Onglet: ${selectedSheet}`)
      console.log(`En-têtes:`, headers)
      console.log(`Résultats détaillés:`, detailedResults)
      console.log(`Total: ${totalRows} lignes`)
      console.log(`Succès: ${successfulRows}`)
      console.log(`Échecs: ${failedRows}`)
    } catch (error) {
      console.error('Erreur lors du traitement:', error)
      setIsLoading(false)
      setCurrentProcessingRow(-1)
      setMessage({
        type: 'danger',
        text: `Une erreur est survenue lors du traitement des données: ${error.message}`,
      })
    }
  }

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (rowIndex) => {
    if (currentProcessingRow === rowIndex) return 'info'
    if (processingResults[rowIndex]) {
      return processingResults[rowIndex].success ? 'success' : 'danger'
    }
    return 'secondary'
  }

  // Fonction pour obtenir le texte du badge selon le statut
  const getStatusText = (rowIndex) => {
    if (currentProcessingRow === rowIndex) return 'En traitement...'
    if (processingResults[rowIndex]) {
      return processingResults[rowIndex].success ? 'Succès' : 'Échec'
    }
    return 'En attente'
  }

  return (
    <AdminLayout>
      <div className="d-flex flex-column justify-content-center align-content-center gap-2 p-3">
        {/* Upload du fichier */}
        <CFormInput
          type="file"
          id="formFile"
          className="w-50 mx-auto"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />

        {/* Messages d'alerte - AMÉLIORÉ */}
        {/* {message.text && (
          <div className="w-50 mx-auto">
            <CAlert color={message.type} className="mb-3">
              {message.text}
              {(headerValidation.errors.length > 0 || headerValidation.warnings?.length > 0) && (
                <div className="mt-2">
                  {headerValidation.errors.length > 0 && (
                    <>
                      <strong>Erreurs d'en-têtes :</strong>
                      <ul className="mb-0 mt-1">
                        {headerValidation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {headerValidation.warnings?.length > 0 && (
                    <>
                      <strong>Avertissements :</strong>
                      <ul className="mb-0 mt-1">
                        {headerValidation.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </CAlert>
          </div>
        )} */}

        {/* Sélection de l'onglet */}
        <div className="d-flex mx-auto gap-2 w-50">
          <CFormSelect
            id="sheetSelect"
            aria-label="Sélectionner un onglet"
            className="flex-grow-1"
            value={selectedSheet}
            onChange={handleSheetSelect}
            disabled={!sheetNames.length || isLoading}
          >
            <option value="">Sélectionnez un onglet</option>
            {sheetNames.map((sheetName, index) => (
              <option key={index} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </CFormSelect>
          <CButton
            onClick={submit}
            color="info"
            variant="outline"
            disabled={
              !selectedSheet || tableData.length === 0 || isLoading || !headerValidation.isValid
            }
          >
            {isLoading ? 'Traitement...' : 'Injecter'}
          </CButton>
        </div>

        {/* Barre de progression */}
        {(isLoading || progress > 0) && (
          <div className="w-50 mx-auto">
            <CProgress
              color={progress === 100 ? 'success' : 'info'}
              variant="striped"
              animated
              value={progress}
              className="mb-2"
            >
              {progress}%
            </CProgress>
            <small className="text-muted">
              {isLoading ? 'Traitement en cours...' : 'Traitement terminé'}
            </small>
          </div>
        )}

        {/* Affichage du tableau - AMÉLIORÉ */}
        {tableData.length > 0 && (
          <div className="w-100 mx-auto mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Contenu de l'onglet: {selectedSheet}</h5>
              <div className="d-flex gap-2">
                {!headerValidation.isValid && <CBadge color="danger">Erreurs d'en-têtes</CBadge>}
                {headerValidation.warnings?.length > 0 && headerValidation.isValid && (
                  <CBadge color="warning">Avertissements</CBadge>
                )}
                <CBadge color="primary">{tableData.length} ligne(s)</CBadge>
              </div>
            </div>
            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <CTable striped bordered responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell width="120px">Statut</CTableHeaderCell>
                    {headers.map((header, index) => (
                      <CTableHeaderCell
                        key={index}
                        className={
                          headerValidation.errors.some(
                            (error) => error.includes(header) || error.includes(`"${header}"`),
                          )
                            ? 'table-danger'
                            : headerValidation.warnings?.some(
                                  (warning) =>
                                    warning.includes(header) || warning.includes(`"${header}"`),
                                )
                              ? 'table-warning'
                              : ''
                        }
                      >
                        {header || `Colonne ${index + 1}`}
                      </CTableHeaderCell>
                    ))}
                    <CTableHeaderCell width="300px">Résultat</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableData.map((row, rowIndex) => (
                    <CTableRow
                      key={rowIndex}
                      className={currentProcessingRow === rowIndex ? 'table-info' : ''}
                    >
                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          {currentProcessingRow === rowIndex && <CSpinner size="sm" />}
                          <CBadge color={getStatusColor(rowIndex)}>
                            {getStatusText(rowIndex)}
                          </CBadge>
                        </div>
                      </CTableDataCell>
                      {headers.map((header, cellIndex) => (
                        <CTableDataCell
                          key={cellIndex}
                          className={
                            headerValidation.errors.some(
                              (error) => error.includes(header) || error.includes(`"${header}"`),
                            )
                              ? 'table-danger'
                              : headerValidation.warnings?.some(
                                    (warning) =>
                                      warning.includes(header) || warning.includes(`"${header}"`),
                                  )
                                ? 'table-warning'
                                : ''
                          }
                        >
                          {row[cellIndex] !== undefined &&
                          row[cellIndex] !== null &&
                          row[cellIndex] !== '' ? (
                            row[cellIndex]
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </CTableDataCell>
                      ))}
                      <CTableDataCell>
                        {processingResults[rowIndex] && (
                          <div
                            className={
                              processingResults[rowIndex].success ? 'text-success' : 'text-danger'
                            }
                          >
                            <small>{processingResults[rowIndex].message}</small>
                            {!processingResults[rowIndex].success && (
                              <div className="mt-1">
                                <CBadge color="danger" className="fs-6">
                                  ÉCHEC
                                </CBadge>
                              </div>
                            )}
                          </div>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </div>
        )}

        {/* Message si aucune donnée */}
        {selectedSheet && tableData.length === 0 && (
          <div className="w-75 mx-auto mt-4 text-center">
            <p className="text-muted">Aucune donnée trouvée dans l'onglet "{selectedSheet}"</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
