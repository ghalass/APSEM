import { CProgress, CProgressBar, CSpinner } from '@coreui/react'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { useInjectHRM } from '../../hooks/useSaisieRje'
import { apiRequest } from '../../utils/apiRequest'
import { API_PATHS } from '../../utils/apiPaths'

const ImportSaisieRje = () => {
  const [sheetNames, setSheetNames] = useState([])
  const [workbook, setWorkbook] = useState(null)
  const [selectedSheet, setSelectedSheet] = useState('')
  const [data, setData] = useState([])
  const [processing, setProcessing] = useState(false)
  const [percent, setPercent] = useState(0)
  const [txtSuccess, setTxtSuccess] = useState([])
  const [txtError, setTxtError] = useState([])
  const [selectedSaisie, setSelectedSaisie] = useState('')

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (evt) => {
      const arrayBuffer = evt.target.result
      const wb = XLSX.read(arrayBuffer, { type: 'array' })

      setWorkbook(wb)
      setSheetNames(wb.SheetNames)
      setSelectedSheet('') // reset selection
      setData([])

      setProcessing(false)
      setPercent(0)
    }

    reader.readAsArrayBuffer(file)

    setTxtSuccess([])
    setTxtError([])
  }

  const handleSheetChange = (e) => {
    const sheetName = e.target.value
    setSelectedSheet(sheetName)

    if (workbook) {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false, // active la conversion des dates
      })
      setData(jsonData)
    }

    setProcessing(false)
    setPercent(0)
    setTxtSuccess([])
    setTxtError([])
  }

  const handleProcess = async () => {
    setTxtSuccess([])
    setTxtError([])

    if (data.length > 0) {
      data.forEach((element, index) => {
        setTimeout(
          async () => {
            setProcessing(true)
            setPercent(((100 * (index + 1)) / data.length).toFixed(0))
            //
            let api = null
            if (selectedSaisie === 'S_HRM') api = API_PATHS.SAISIE_RJE.INJECT_SAISIE_RJE_HRM
            if (selectedSaisie === 'S_HIM') api = API_PATHS.SAISIE_RJE.INJECT_SAISIE_RJE_HIM

            const res = await apiRequest(api, 'POST', element)

            // console.log(res)
            if (res?.message?.includes('NOK')) {
              setTxtError((prev) => [
                ...prev,
                <div key={prev.length}>
                  <span className="text-danger">{res?.message}</span>
                </div>,
              ])
            } else {
              setTxtSuccess((prev) => [
                ...prev,
                <div key={prev.length}>
                  <span className="text-success">{res?.message}</span>
                </div>,
              ])
            }
            if (index + 1 === data.length) setProcessing(false)
          },
          (index + 1) * 200,
        ) // 200ms entre chaque élément
      })
    } else {
      console.log('Pas de données.')
    }
  }

  return (
    <div className="my-4">
      <h2>Importer un fichier Excel</h2>

      <div className="mx-auto w-50 mt-4">
        <select
          disabled={processing}
          value={selectedSaisie}
          onChange={(e) => setSelectedSaisie(e.target.value)}
          className="form-control form-control-sm"
        >
          <option value="">-- Sélectionner --</option>
          <option key="shrm" value="S_HRM">
            Saisie HRM
          </option>
          <option key="shim" value="S_HIM">
            Saisie HIM
          </option>
        </select>

        {selectedSaisie !== '' && (
          <>
            <input
              type="file"
              className="form-control form-control-sm mb-2"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={processing}
            />

            {sheetNames.length > 0 && (
              <div>
                <div className="d-flex align-items-center gap-1">
                  <select
                    disabled={processing}
                    onChange={handleSheetChange}
                    value={selectedSheet}
                    className="form-control form-control-sm"
                  >
                    <option value="">-- Sélectionner --</option>
                    {sheetNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={processing}
                    onClick={handleProcess}
                    className="btn btn-sm btn-outline-info"
                  >
                    {processing ? <CSpinner size="sm" /> : 'Process'}
                  </button>
                </div>
                <div className="">
                  <p className="mb-0">Total : {data?.length} lignes</p>
                </div>

                <CProgress color="info" value={percent}>
                  <CProgressBar className="text-dark">{percent} %</CProgressBar>
                </CProgress>
              </div>
            )}
          </>
        )}
      </div>

      {selectedSaisie !== '' && (
        <div className="row mt-2">
          <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="col-sm border">
            <p className="text-uppercase text-success mb-0">Réussi</p>
            {txtSuccess}
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="col-sm border">
            <p className="text-uppercase text-danger mb-0">échoué</p>
            {txtError}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImportSaisieRje
