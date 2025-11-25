import { CFormInput, CFormSelect } from '@coreui/react'
import React from 'react'
import useSaisieRjeStore from '../../stores/useSaisieRjeStore'
import { useQuery } from '@tanstack/react-query'
import { useTypeparcs } from '../../hooks/useTypeparcs'
import { useParcsByTypeParc } from '../../hooks/useParcs'
import { fecthSitesQuery } from '../../hooks/useSites'
import fecthEnginsQueryByParcBySite from '../../hooks/useEngins'

const SaisieRjeSelects = () => {
  const { selectedFields, setSelectedFields } = useSaisieRjeStore()

  const typeparcsQuery = useQuery(useTypeparcs())

  const parcsByTypeparcQuery = useQuery(useParcsByTypeParc(selectedFields?.typeparcId))

  const sitesQuery = useQuery(fecthSitesQuery())
  const enginsQuery = useQuery(
    fecthEnginsQueryByParcBySite(selectedFields?.parcId, selectedFields?.siteId),
  )

  const isLoading =
    typeparcsQuery.isLoading ||
    enginsQuery.isLoading ||
    sitesQuery.isLoading ||
    parcsByTypeparcQuery.isLoading

  return (
    <div className="d-flex gap-1 justify-content-center align-items-center">
      <div className="row">
        <div className="col-sm-6 col-md-6 col-lg-2">
          <CFormInput
            type="date"
            id="floatingInputDate"
            floatingClassName="mb-3"
            floatingLabel="Date de saisie"
            placeholder="Date de saisie"
            value={selectedFields?.du}
            onChange={(e) =>
              setSelectedFields({
                ...selectedFields,
                du: e.target.value,
              })
            }
            disabled={isLoading}
          />
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4">
          <CFormSelect
            id="floatingSelectTypeparcId"
            floatingClassName="mb-3"
            floatingLabel="Choisir un type de parc"
            aria-label="Floating label select example"
            value={selectedFields?.typeparcId}
            onChange={(e) =>
              setSelectedFields({
                ...selectedFields,
                typeparcId: e.target.value,
                parcId: '',
                enginId: '',
              })
            }
            disabled={isLoading}
          >
            <option></option>
            {typeparcsQuery.data &&
              typeparcsQuery.data?.length > 0 &&
              typeparcsQuery.data?.map((typeparc, indx) => (
                <option key={indx} value={typeparc?.id}>
                  {typeparc?.name}
                </option>
              ))}
          </CFormSelect>
        </div>

        <div className="col-sm-4 col-md-4 col-lg-2">
          <CFormSelect
            id="floatingSelectParcId"
            floatingClassName="mb-3"
            floatingLabel="Choisir un parc"
            aria-label="Floating label select example"
            value={selectedFields?.parcId}
            onChange={(e) =>
              setSelectedFields({
                ...selectedFields,
                parcId: e.target.value,
                enginId: '',
              })
            }
            disabled={isLoading}
          >
            <option></option>
            {parcsByTypeparcQuery.data &&
              parcsByTypeparcQuery.data?.length > 0 &&
              parcsByTypeparcQuery.data?.map((parc, indx) => (
                <option key={indx} value={parc?.id}>
                  {parc?.name}
                </option>
              ))}
          </CFormSelect>
        </div>

        <div className="col-sm-4 col-md-4 col-lg-2">
          <CFormSelect
            id="floatingSelectSiteId"
            floatingClassName="mb-3"
            floatingLabel="Choisir un site"
            aria-label="Floating label select example"
            value={selectedFields?.siteId}
            onChange={(e) =>
              setSelectedFields({
                ...selectedFields,
                siteId: e.target.value,
                enginId: '',
              })
            }
            disabled={isLoading}
          >
            <option></option>
            {sitesQuery.data &&
              sitesQuery.data?.length > 0 &&
              sitesQuery.data?.map((site, indx) => (
                <option key={indx} value={site?.id}>
                  {site?.name}
                </option>
              ))}
          </CFormSelect>
        </div>

        <div className="col-sm-4 col-md-4 col-lg-2">
          <CFormSelect
            id="floatingSelectEnginId"
            floatingClassName="mb-3"
            floatingLabel="Choisir un engin"
            aria-label="Floating label select example"
            value={selectedFields?.enginId}
            onChange={(e) =>
              setSelectedFields({
                ...selectedFields,
                enginId: e.target.value,
              })
            }
            disabled={isLoading}
          >
            <option></option>
            {enginsQuery.data &&
              enginsQuery.data?.length > 0 &&
              enginsQuery.data?.map(
                (engin, indx) =>
                  // NOT DISPLAY ENGIN IF NOT ACTIVE
                  engin?.active && (
                    <option key={indx} value={engin?.id}>
                      {engin?.name}
                    </option>
                  ),
              )}
          </CFormSelect>
        </div>
      </div>
    </div>
  )
}

export default SaisieRjeSelects
