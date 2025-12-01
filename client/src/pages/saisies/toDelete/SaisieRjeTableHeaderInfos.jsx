import React, { useEffect } from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { CBadge } from '@coreui/react'

const SaisieRjeTableHeaderInfos = () => {
  const { saisieRjeQueryStore, setHrm } = useSaisieRjeStore()

  // HRM
  useEffect(() => {
    setHrm(saisieRjeQueryStore?.data?.[0]?.hrm || '')
  }, [])

  return (
    <div className="d-flex justify-content-center gap-4">
      <div>
        <CBadge color="danger" shape="rounded-pill">
          {saisieRjeQueryStore?.data?.[0]?.Saisiehim?.length || 0}
        </CBadge>
        <span className="ms-2">Pannes</span>
      </div>

      <div className="d-flex align-items-center gap-1">
        <span className="text-primary">
          {!saisieRjeQueryStore?.data?.[0]?.hrm && 'Aucun HRM saisie'}
        </span>
        <i className="bi bi-clock text-info"></i>{' '}
        <span>HRM : {saisieRjeQueryStore?.data?.[0]?.hrm || ' '}</span>
        <i className="bi bi-geo-alt text-success"></i>{' '}
        <span>Site : {saisieRjeQueryStore?.data?.[0]?.Site?.name || ' '}</span>
      </div>
    </div>
  )
}

export default SaisieRjeTableHeaderInfos
