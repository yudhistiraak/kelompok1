import React,{useState, useEffect} from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate} from 'react-router-dom';
const Navbar = () => {
    const history = useNavigate();
    const [role, setRole] = useState('');
    const Logout=async()=>{ //async untuk menunggu proses hingga dapat response dengan await
        try {
            await axios.delete('http://localhost:5000/logout');
            history('/');
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getRole()
    }, []);
    const gantiPassword = async () => {
        const res = await axios.get('http://localhost:5000/token')
        const decode = jwt_decode(res.data.accessToken)
        history('/gantiPassword/' + decode.userId)
    }
    const editProfil = async () => {
        const response = await axios.get('http://localhost:5000/token')
        const decode = jwt_decode(response.data.accessToken)
        history('/edit-profil/' + decode.userId)
        // setName(decode);
    }
    const getRole = async () => {
        const response = await axios.get('http://localhost:5000/token')
        const decode = jwt_decode(response.data.accessToken)
        setRole(decode.role);
    }
    function navbarRole() {
        if (role === "admin") {
            return (
                <div  className="navbar-start">
                    <a href='/home' className="navbar-item">
                        Home
                    </a>
                    <a href='/produk' className="navbar-item">
                        Produk
                    </a>
                    <a href='/role' className="navbar-item">
                        Role
                    </a>
                </div>

            )
        } else {
            return(
                <div className='navbar-start'>
                    <a href='/customer' className="navbar-item">
                        Customer
                    </a>
                    <a href='/produk' className="navbar-item">
                        Produk
                    </a>
                    <a href='/transaksi' className="navbar-item">
                            Transaksi
                    </a>
                </div>
            )
        }
    }
    
  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a className="navbar-item" href="https://bulma.io">
                        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt='logo' />
                    </a>

                    <a href='/' role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        {navbarRole()}
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                        <div className="buttons">
                                <button onClick={editProfil} className="button is-dark">
                                    Edit Profil
                                </button>
                                <button onClick={gantiPassword} className="button is-dark">
                                    Reset Password
                                </button>
                                <button onClick={Logout} className="button is-danger">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
  )
}

export default Navbar