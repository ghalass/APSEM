import React from 'react'
import { useAuth } from '../../context/Auth'
import ImportSaisieRje from './ImportSaisieRje'

const Home = () => {
  const auth = useAuth()

  return (
    <div className="container-fluid">
      <div className="text-center">
        <h1>Page d'acceuil</h1>
        <h3>
          Welcome{' '}
          {auth?.user
            ? auth.user.name.replace(/^./, (c) => c.toUpperCase())
            : 'in this application'}
        </h3>

        {/* <ImportSaisieRje /> */}
      </div>
    </div>
  )
}

export default Home
