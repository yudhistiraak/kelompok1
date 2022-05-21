import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const history = useNavigate();
    const axiosJwt = axios.create();
    useEffect(() => {
        getDataRole();  
    }, []);
    
    const Register=async(e)=>{
        e.preventDefault();
        try { //untuk try cath error
            await axios.post('http://localhost:5000/users',{
                name:name, //body request, ambil dari state
                email:email,
                password:password,
                confPassword:confPassword,
                role:role //body request, ambil dari state
            }); //parameter yang akan dilempar
            history('/'); //jika berhasil login redirect
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
            }        
        }
    }
    const getDataRole=async()=>{
        try { //untuk try cath error
                const response=await axiosJwt.get('http://localhost:5000/role');
                setRoles(response.data);
                
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
            }        
        }
    }
    const Login=()=>{
        history('/');
    }
    
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Register} className="box">
                                <p className='has-text-centered'>{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Name</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Name'
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
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
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='*****'
                                            value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Select Role</label>
                                    <div className="control">
                                        <div className="select">
                                        <select  value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value='0'>Pilih Role</option>
                                            {
                                                roles.map((r)=>(
                                                    <option key={r.id} value={r.role}>{r.role}</option>
                                                ))
                                            }
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Register</button>
                                </div>
                            </form>
                            <button className="button is-danger" onClick={Login}>Batal</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default Register