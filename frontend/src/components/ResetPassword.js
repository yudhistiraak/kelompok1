import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';


const ResetPassword = () => {
    let params = useParams();
    const [id, setId] = useState(params.id);
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState('');
    const history = useNavigate();
    const axiosJwt = axios.create();

    useEffect(() => {
        refreshToken()
    }, []);
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token/');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);

            setExpired(decode.exp);

        } catch (error) {
            if (error.response) {
                history('/');
            }
        }
    }
    axiosJwt.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setExpired(decode.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });


    const UpdatePassword = async (e) => {
        e.preventDefault()
        let data = {
            password: password
        }
        await axios.put('http://localhost:5000/resetpassword/' + id, data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                swal(res.data.msg)
                history('/home')
            })
    }

    function cancel() {
        history('/home');
    }

    return (
        <section className="hero  is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                        <h1>Ganti Password User id :{id}</h1>
                            <form onSubmit={UpdatePassword} >
                                {/* <p className='has-text-centered'>{msg}</p> */}
                                <div className="field mt-5">
                                    <label className="label">Password Baru</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='*****'
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>

                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth" >Add Data</button>

                                </div>
                            <button className="button is-danger" onClick={cancel}>Batal</button>
                            </form>
                            

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword