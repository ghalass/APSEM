import avatar8 from '../../assets/images/avatars/icons8-user-80.png'
import { useAuth } from '../../context/Auth'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const Profile = () => {
  const auth = useAuth()
  return (
    <CContainer>
      {/* {JSON.stringify(auth?.user)} */}
      <CRow xs={{ gutter: 2 }} md={{ gutter: 2 }}>
        <CCol sm={12} md={6} lg={4}>
          <CCard className="text-center">
            <CCardBody>
              <div className="d-flex justify-content-end">
                <button
                  // onClick={() => openModal("userProfileChangePassword")}
                  className="btn btn-sm btn-outline-danger rounded rounded-circle"
                >
                  <i className="bi bi-key"></i>
                </button>
              </div>
              <CCardTitle className="d-flex  align-items-center justify-content-center">
                <div className=" text-primary">
                  <img
                    className="border border-2 rounded-circle border-secondary-subtle "
                    src={avatar8}
                    alt="user img"
                  />
                  <h6>Welcome</h6>
                  <strong>{auth?.user?.name}</strong>
                </div>
              </CCardTitle>
              <CCardSubtitle className="mb-2 text-body-secondary">Rôles</CCardSubtitle>
              <CCardSubtitle className="mb-2 text-body-secondary">{auth.user.email}</CCardSubtitle>
              <div className="d-flex gap-1 justify-content-center">
                {auth.user?.roles?.length > 0 &&
                  auth.user?.roles.map((role) => (
                    <CBadge key={role.id} color="primary">
                      {' '}
                      {role.name}
                    </CBadge>
                  ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={12} md={6} lg={8}>
          <CCard className="text-center">
            <CCardBody>
              <CCardTitle>Permissions</CCardTitle>
              {auth.user?.roles?.length > 0 &&
                auth.user?.roles?.map((r) => (
                  <div className="mb-2" key={r.id}>
                    <CCardSubtitle key={r.id} className="mb-2">
                      <CBadge color="primary"> {r.name}</CBadge>
                    </CCardSubtitle>
                    {/* {JSON.stringify(r)} */}
                    {r?.permissions?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1 justify-content-center align-items-center">
                        {r?.permissions?.map((p) => (
                          <span
                            className="border border-light-subtle rounded-pill px-2 bg-light-subtle"
                            key={p.id}
                          >
                            {p.resource} {p.action}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="fst-italic">Aucune permission</span>
                    )}
                  </div>
                ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* <ProfileChangePasswordModal /> */}
    </CContainer>
  )
}

export default Profile
