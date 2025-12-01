import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTooltip,
} from '@coreui/react'
import { useAuth } from '../../context/Auth'
import CIcon from '@coreui/icons-react'
import { cilSend } from '@coreui/icons'

const Chat = () => {
  const auth = useAuth()

  return (
    <div className="container-fluid">
      <div className="text-center">
        <h3>
          Welcome{' '}
          {auth?.user
            ? auth.user.name.replace(/^./, (c) => c.toUpperCase())
            : 'in this application'}
        </h3>
      </div>

      <CCard className="p-2 mb-1">
        <div className="d-flex flex-row flex-wrap justify-content-center gap-2">
          <CAvatar src={'/images/avatars/1.jpg'} status="success" role="button" />
          <CAvatar src={'/images/avatars/2.jpg'} status="success" role="button" />
          <CAvatar src={'/images/avatars/3.jpg'} status="success" role="button" />
        </div>
      </CCard>

      <CCard>
        <CCardBody>
          <div className="mb-3">
            <CCardSubtitle className="mb-1 text-body-secondary">
              <div className="d-flex align-items-center gap-2">
                <CAvatar src={'/images/avatars/1.jpg'} status="success" role="button" />
                Ghalass
              </div>
            </CCardSubtitle>

            <CCard className="mb-1 w-50 border-success" textColor="success">
              <CCardBody className="py-1">
                <div>Bonjour</div>
              </CCardBody>
            </CCard>
          </div>
          <div className="mb-3">
            <CCardSubtitle className="mb-1 text-body-secondary">
              <div className="d-flex align-items-center justify-content-end gap-2">
                Sidi
                <CAvatar src={'/images/avatars/2.jpg'} status="success" role="button" />
              </div>
            </CCardSubtitle>

            <CCard className="mb-1 w-50 ms-auto ">
              <CCardBody className="py-1">
                <div>This is some text within a card body.</div>
              </CCardBody>
            </CCard>
          </div>

          {/* INPUT FIELD */}
          <div className="d-flex justify-content-center align-items-center gap-1 mt-1">
            <CCardSubtitle className="text-body-secondary">
              <div className="d-flex align-items-center gap-2">
                <CAvatar src={'/images/avatars/1.jpg'} status="success" role="button" />
                Ghalass
              </div>
            </CCardSubtitle>

            <CFormInput type="text" id="inputPassword3" placeholder="Message..." />

            <CButton color="primary" type="submit" variant="outline">
              <CIcon icon={cilSend} />
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Chat
