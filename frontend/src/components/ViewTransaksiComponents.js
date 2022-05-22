import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
const ViewTransaksiComponents = () => {
    let params=useParams();
    const [id, setId] = useState(params.id);
    const [tgl, setTgl]=useState('');
    const [nama_customer, setCustomer]=useState('');
    const [produk, setProduk]=useState('');
    const [harga, setHarga]=useState('');
    const [qty, setQty]=useState('');
    const [total, setTotal]=useState('');

    const [password, setPassword]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');

    const history = useNavigate();
    const axiosJwt = axios.create();

    useEffect(() => {
        cekId();
        refreshToken();  
    }, []);
    const refreshToken=async() => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setTgl(decode.tgl);
            setCustomer(decode.nama_customer);
            setProduk(decode.produk);
            setHarga(decode.harga);
            setQty(decode.qty);
            setPassword(decode.password);
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
            setTgl(decode.tgl);
            setCustomer(decode.nama_customer);
            setProduk(decode.produk);
            setHarga(decode.harga);
            setQty(decode.qty);
            setPassword(decode.password);
            setExpired(decode.exp);
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const cekId=async()=>{
        
        if (id === '_add') {
            return
        } else {
            const response=await axiosJwt.get('http://localhost:5000/transaksi'+'/'+id,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            });
            setTgl(response.data.tgl);
            setCustomer(response.data.nama_customer);
            setProduk(response.data.produk);
            setHarga(response.data.harga);
            setQty(response.data.qty);
            setToken(response.data.accessToken);
            setPassword(response.data.password);
            setTotal(response.data.harga*response.data.qty);
        }

    }
    const Cancel=()=>{
        history('/transaksi');
    }
    function getTitle() {
        return <h3 className="text-center">View Transaksi</h3>
        
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
                        <form>
                            <div className="form-group">
                                <label>Tanggal transaksi : {tgl}</label>
                            </div>
                            <div className="form-group">
                                <label>Nama Customer : {nama_customer}</label>
                            </div>
                            <div className="form-group">
                                <label>Nama Produk : {produk}</label>
                            </div>
                            <div className="form-group">
                                <label>Harga Produk : Rp. {harga}</label>
                            </div>
                            <div className="form-group">
                                <label>Jumlah : {qty}</label>
                            </div>
                            <div className="form-group">
                                <label>Total Belanja : Rp. {total}</label>
                            </div>
                            <br></br>
                            <button className="button is-secondary" onClick={Cancel}>Kembali</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
}

export default ViewTransaksiComponents