import React,{useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const CreateUserComponents = () => {
    let params=useParams();
    const [id, setId] = useState(params.id);
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [msg, setMsg]=useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);

    const history = useNavigate();
    const axiosJwt = axios.create();

    useEffect(() => {
        refreshToken();
        cekId();
        getRole();  

    }, []);
    const refreshToken=async(e) => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setRole(decode.role);
            setExpired(decode.exp);
            if (decode.role !== 'admin') {
                if (id!=decode.userId) {
                    e.preventDefault();
                    history('/home');
                }
            }
        } catch (error) {
            if (error.response) {
                history('/');
            }
        }
    }
    axiosJwt.interceptors.request.use(async(config)=>{
        const currentDate=new Date();
        if (expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization=`Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setRole(decode.role);
            setExpired(decode.exp);
            if (decode.role !== 'admin') {
                if (id!=decode.userId) {
                    history('/home');
                }
            }
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const cekId=async()=>{
        console.log(id);
        if (id === '_add') {
            return
        } else {
            const response=await axiosJwt.get('http://localhost:5000/users'+'/'+id,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            });
            setName(response.data.name);
            setEmail(response.data.email);
            setRole(response.data.role);
        }

    }
    const getRole=async()=>{
        const response=await axiosJwt.get('http://localhost:5000/role',{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            });
            setRoles(response.data);
    }
    const Create=async(e)=>{
        e.preventDefault();
        let Userdata = {
            name:name, //body request, ambil dari state
            email:email,
            password:password,
            role:role
        }
        if (id === '_add') {
            try { //untuk try cath error
                await axiosJwt.post('http://localhost:5000/addusers',Userdata,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    } 
                }); //parameter yang akan dilempar
                history('/home'); //jika berhasil login redirect home
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
                }        
            }
        } else {
            try { //untuk try cath error
                await axiosJwt.put('http://localhost:5000/users'+'/'+id,Userdata,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            }); //parameter yang akan dilempar
                history('/home'); //jika berhasil login redirect home
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
                }        
            }
        }
    }
    const Cancel=()=>{
        history('/home');
    }
    function getButton() {
        if (id === "_add") {
            return <button className="button is-success" onClick={Create}>Tambah</button>
        } else {
            return <button className="button is-success" onClick={Create}>Edit</button>
        }       
    }
    function getForm() {
        if (id === "_add") {
            return (
                <form onSubmit={Create} className="box">
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
                                    <label className="label">Select Role</label>
                                    <div className="control">
                                        <div className="select">
                                        <select value={role} onChange={(e) => setRole(e.target.value)}>
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
                                    {getButton()}
                                </div>
                            </form>
            )
        } else {
            return (
                <form onSubmit={Create} className="box">
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
                                    <label className="label">Select Role</label>
                                    <div className="control">
                                        <div className="select">
                                        <select value={role} onChange={(e) => setRole(e.target.value)}>
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
                                    {getButton()}
                                </div>
                            </form>
            )
        }   
    }
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            {getForm()}
                            <button className="button is-danger" onClick={Cancel}>Batal</button>
                        </div>
                    </div>
                </div>
            </div>
    </section>
  )
}

export default CreateUserComponents