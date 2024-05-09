import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import './index.css'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav>
            {
                userLoggedIn
                    ?
                    <>
                        <Link onClick={() => { doSignOut().then(() => { navigate('/login') }) }} >Logout</Link>
                    </>
                    :
                    <>
                        <Link to={'/login'}>Login</Link>
                        <Link to={'/register'}>Registre-se</Link>
                    </>
            }

        </nav>
    )
}

export default Header; 