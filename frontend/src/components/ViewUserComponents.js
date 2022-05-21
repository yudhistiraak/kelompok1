import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
const ViewUserComponents = () => {
    let params=useParams();
    const [id, setId] = useState(params.id);
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [role, setRole]=useState('');
    const [password, setPassword]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');

    const history = useNavigate();
    const axiosJwt = axios.create();

    useEffect(() => {
        cekId();
        refreshToken();  
    }, []);
    const refreshToken=async(e) => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setName(decode.name);
            setEmail(decode.email);
            setPassword(decode.password);
            setExpired(decode.exp);
            setRole(decode.role);
            if (decode.role !== 'admin') {
                e.preventDefault();
                if (id!=decode.userId) {
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
            setName(decode.name);
            setEmail(decode.email);
            setPassword(decode.password);
            setExpired(decode.exp);
            setRole(decode.role);
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

            const response=await axiosJwt.get('http://localhost:5000/users'+'/'+id,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            });
            setName(response.data.name);
            setEmail(response.data.email);
            setRole(response.data.role);
            setToken(response.data.accessToken);
            setPassword(response.data.password);
        

    }
    const Cancel=()=>{
        history('/home');
    }
    function getTitle() {
        return <h3 className="text-center">View User</h3>
        
    }
    return (
        <div>
            <br></br>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        {getTitle()}
                    </div>
                    <div className="card-body">
                        <form className="box">
                            <div className="form-group">
                                <label>Nama User  : {name}</label>
                            </div>
                            <div className="form-group">
                                <label>Email User : {email}</label>
                            </div>
                            <div className="form-group">
                                <label>Role       : {role}</label>
                            </div>
                            <br></br>
                            <button className="button is-secondary" onClick={Cancel}>Kembali</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
}

export default ViewUserComponents