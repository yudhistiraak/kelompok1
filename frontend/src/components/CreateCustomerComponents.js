import React,{useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const CreateCustomerComponents = () => {
    let params=useParams();
    const [id, setId] = useState(params.id);
    const [nama_customer, setNamaCustomer]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [confPassword, setConfPassword]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [msg, setMsg]=useState('');

    const history = useNavigate();
    const axiosJwt = axios.create();

    useEffect(() => {
        refreshToken();
        cekId();  
    }, []);
    const refreshToken=async() => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setExpired(decode.exp);

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
            setExpired(decode.exp);
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
            const response=await axiosJwt.get('http://localhost:5000/customer'+'/'+id,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            });
            setNamaCustomer(response.data.nama_customer);
            setEmail(response.data.email);
        }

    }
    const Create=async(e)=>{
        e.preventDefault();
        let Customerdata = {
            nama_customer:nama_customer, //body request, ambil dari state
            email:email
        }
        if (id === '_add') {
            try { //untuk try cath error
                await axiosJwt.post('http://localhost:5000/customer',Customerdata,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    } 
                }); //parameter yang akan dilempar
                history('/customer'); //jika berhasil login redirect home
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
                }        
            }
        } else {
            try { //untuk try cath error
                await axiosJwt.put('http://localhost:5000/customer'+'/'+id,Customerdata,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            }); //parameter yang akan dilempar
                history('/customer'); //jika berhasil login redirect home
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
                }        
            }
        }
    }
    const Cancel=()=>{
        history('/customer');
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
                                    <label className="label">Nama Customer</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Nama Customer'
                                            value={nama_customer} onChange={(e) => setNamaCustomer(e.target.value)} />
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
                                    {getButton()}
                                </div>
                            </form>
            )
        } else {
            return (
                <form onSubmit={Create} className="box">
                                <p className='has-text-centered'>{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Nama Customer</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Nama Customer'
                                            value={nama_customer} onChange={(e) => setNamaCustomer(e.target.value)} />
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

export default CreateCustomerComponents