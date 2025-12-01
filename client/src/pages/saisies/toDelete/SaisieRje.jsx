import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import fecthSaisieRjeQueryOptions from '../../hooks/useSaisieRje'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import SaisieRjeSelects from './SaisieRjeSelects'
import SaisieRjeTableHeaderInfos from './SaisieRjeTableHeaderInfos'
import SaisieRjeTableHeaderButtons from './SaisieRjeTableHeaderButtons'
import SaisieRjeTable from './SaisieRjeTable'
import SaisieRjeCreateHrmModal from './SaisieRjeCreateHrmModal'
import SaisieRjeCreatePanneModal from './SaisieRjeCreatePanneModal'
import SaisieRjeEditPanneModal from './SaisieRjeEditPanneModal'
import SaisieRjeDeletePanneModal from './SaisieRjeDeletePanneModal'
import SaisieRjeCreateLubrifiantModal from './SaisieRjeCreateLubrifiantModal'

const SaisieRje = () => {
  const { selectedFields, setSaisieRjeQueryStore } = useSaisieRjeStore()

  const saisieRjeQuery = useQuery(
    fecthSaisieRjeQueryOptions(selectedFields?.du, selectedFields?.enginId),
  )

  useEffect(() => {
    setSaisieRjeQueryStore(saisieRjeQuery)
  }, [saisieRjeQuery.isSuccess, saisieRjeQuery.isRefetching])

  return (
    <div>
      {/* SELECTION FIELDS */}
      <SaisieRjeSelects />

      {/* INFOS : PANNES NUMBER + HRM + SITE *************/}
      <SaisieRjeTableHeaderInfos />

      <hr className="my-2 w-25 mx-auto" />

      {/* OPTIONS BUTTONS *************/}
      <SaisieRjeTableHeaderButtons />

      {/* LISTE *************/}
      <SaisieRjeTable />

      {/* ADD HRM MODAL *************/}
      <SaisieRjeCreateHrmModal />

      {/* ADD PANNE MODAL *************/}
      <SaisieRjeCreatePanneModal />

      {/* UPDATE PANNE MODAL *************/}
      <SaisieRjeEditPanneModal />

      {/* DELETE PANNE */}
      <SaisieRjeDeletePanneModal />

      {/* ADD LUB MODAL *************/}
      <SaisieRjeCreateLubrifiantModal />
    </div>
  )
}

export default SaisieRje
