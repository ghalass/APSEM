import { CAvatar, CCard, CCardBody, CCardHeader, CCardText, CCardTitle } from '@coreui/react'
import React from 'react'

import avatar8 from './../../assets/images/avatars/ghalass.jpg'

const About = () => {
  return (
    <div className="d-flex text-center ">
      <CCard textColor="secondary" className={`mb-3 border-secondary mx-auto`}>
        <CCardHeader>ENG. GHALASS MOHAMED SALEM</CCardHeader>
        <CCardBody>
          <CAvatar
            src={avatar8}
            className="border border-secondary col-sm"
            style={{ height: '200px', width: '200px' }}
          />
          <CCardTitle>
            Electromechanical engineer <br />
            Freelancer & Hobby Developer
          </CCardTitle>
          <CCardText>
            <strong>Bio: </strong>
            <br />
            Passionate <strong>Electromechanical Engineer</strong> with a knack for innovation and
            problem-solving.
            <br />
            As a <strong>Freelancer</strong>, I bring technical expertise to diverse projects,
            blending mechanical and electrical engineering to deliver efficient, cutting-edge
            solutions.
            <br />
            When I'm not engineering, I'm a <strong>Hobby Developer</strong>, tinkering with code,
            automation, and embedded systems—always exploring new ways to merge hardware and
            software.
            <br />
            Whether it's robotics, IoT, or custom DIY projects, I love turning ideas into reality.
            <br />
            Driven by curiosity and a hands-on approach, I thrive on challenges that push the
            boundaries of technology.
            <br />
            Let’s build something amazing together!
            <br />
            🔧 <strong>Skills:</strong> <br />
            Electromechanical Systems · Automation · Embedded Systems · CAD · Python/C++, JavaScript
            (& his frameworks) · IoT · Robotics
            <br />
            💡 Always learning, always creating.
            <br />
            <hr className="w-25 mx-auto my-1" />
            Email: msghalas@gmail.com
            <br />
            <a target="_blank" href="https://www.ghalass.com">
              https://www.ghalass.com
            </a>
          </CCardText>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default About
