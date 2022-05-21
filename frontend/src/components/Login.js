import React,{ useState } from 'react';
import axios from 'axios'; //handling api
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const history = useNavigate();

    const Auth=async(e)=>{ // async untuk menunggu proses hingga dapat response dengan await
        e.preventDefault(); //agar tidak reload
        try {
             await axios.post('http://localhost:5000/login',{
                 email:email,
                 password:password
             });
             history('/home'); //jika berhasil redirect ke home
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        } // untuk capture error
    }

    const Register=()=>{ //waktu klik register
        history('/register'); //redirect ke halaman register
    }
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Auth} className="box">
                                <p className='has-text-centered'>{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Email'
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='*****'
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Login</button>
                                </div>
                            </form>
                            <button className="button is-danger" onClick={Register}>Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default Login