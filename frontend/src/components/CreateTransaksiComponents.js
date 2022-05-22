import React,{useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const CreateTransaksiComponents = () => {
    let params=useParams();
    var date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() +1);
    var tanggal = new Date(today).toISOString().split('T')[0];
    const [id, setId] = useState(params.id);
    const [tgl, setTgl]=useState(tanggal);
    const [nama_customer, setCustomer]=useState('');
    const [produk, setProduk]=useState('');
    const [harga, setHarga]=useState('');
    const [qty, setQty]=useState('');
    const [customers, setCustomers]=useState([]);
    const [produks, setProduks]=useState([]);
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [msg, setMsg]=useState('');

    const history = useNavigate();
    const axiosJwt = axios.create();

    useEffect(() => {
        refreshToken();
        getTransaksiId();  
        getProduk();
        getCustomer();
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
    const getTransaksiId=async()=>{
        console.log(id);
        if (id === '_add') {
            return
        } else {
            const response=await axiosJwt.get('http://localhost:5000/transaksi'+'/'+id,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            });
            setTgl(tgl);
            setCustomer(response.data.nama_customer);
            setProduk(response.data.produk);
            setHarga(response.data.harga);
            setQty(response.data.qty);
        }
    }
    const getProduk=async()=>{
        try { //untuk try cath error
                const response=await axiosJwt.get('http://localhost:5000/produk',{
                    headers:{
                        Authorization:`Bearer ${token}`
                    } 
                });
                setProduks(response.data);
                
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
            }        
        }
    }
    const cekValueProduk = ()=>{
        produks.map((value)=>{
            if (produk === value.nama) {
                setHarga(value.harga)
              }
        });
        
    } 
    const getCustomer=async()=>{
        try { //untuk try cath error
                const response=await axiosJwt.get('http://localhost:5000/customer',{
                    headers:{
                        Authorization:`Bearer ${token}`
                    } 
                });
                setCustomers(response.data);
                
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
            }        
        }
    }
    const Create=async(e)=>{
        e.preventDefault();
        let Transaksidata = {
            tgl:tgl,
            nama_customer:nama_customer, //body request, ambil dari state
            produk:produk,
            harga:harga,
            qty:qty
        }
        if (id === '_add') {
            try { //untuk try cath error
                await axiosJwt.post('http://localhost:5000/transaksi',Transaksidata,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    } 
                }); //parameter yang akan dilempar
                history('/transaksi'); //jika berhasil login redirect home
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
                }        
            }
        } else {
            try { //untuk try cath error
                await axiosJwt.put('http://localhost:5000/transaksi'+'/'+id,Transaksidata,{
                headers:{
                    Authorization:`Bearer ${token}`
                } 
            }); //parameter yang akan dilempar
                history('/transaksi'); //jika berhasil login redirect home
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg); //.msg karena pesan error di insom msg
                }        
            }
        }
    }
    const Cancel=()=>{
        history('/transaksi');
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
                                    <label className="label">Tanggal</label>
                                    <div className="controls">
                                        <input type="date" className="input" placeholder='Tanggal'
                                            value={tgl} onChange={(e) => setTgl(e.target.value)} />
                                    </div>
                                </div>
                                <div className="control">
                                        <div className="select">
                                        <select value={nama_customer} onChange={(e) => setCustomer(e.target.value)}>
                                        <option value='0'>Pilih Customer</option>
                                            {
                                                customers.map((c)=>(
                                                    <option key={c.id} value={c.nama_customer}>{c.nama_customer}</option>
                                                ))
                                            }
                                        </select>
                                        </div>
                                    </div>
                                <div className="field mt-5">
                                    <label className="label">Nama Produk</label>
                                    <div className="control">
                                        <div className="select">
                                        <select value={produk} onChange={(e) => setProduk(e.target.value)} onClick={() => cekValueProduk()}>
                                        <option value='0'>Pilih Produk</option>
                                            {
                                                produks.map((p)=>(
                                                    <option key={p.id} value={p.nama}>{p.nama}</option>
                                                ))
                                            }
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Harga Produk</label>
                                    <div className="controls">
                                        <input 
                                            type="text" 
                                            className="input" 
                                            placeholder='Harga'
                                            value={harga}
                                            onChange={e => setQty(e.target.value)}
                                            disabled
                                        />
                                            
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Qty Produk</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Qty'
                                            value={qty} onChange={(e) => setQty(e.target.value)} />
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
                                    <label className="label">Tanggal</label>
                                    <div className="controls">
                                        <input type="date" className="input" placeholder='Tanggal'
                                            value={tgl} onChange={(e) => setTgl(e.target.value)} />
                                    </div>
                                </div>
                                <div className="control">
                                        <div className="select">
                                        <select value={nama_customer} onChange={(e) => setCustomer(e.target.value)}>
                                        <option value='0'>Pilih Customer</option>
                                            {
                                                customers.map((c)=>(
                                                    <option key={c.id} value={c.nama_customer}>{c.nama_customer}</option>
                                                ))
                                            }
                                        </select>
                                        </div>
                                    </div>
                                <div className="field mt-5">
                                    <label className="label">Nama Produk</label>
                                    <div className="control">
                                        <div className="select">
                                        <select value={produk} onChange={(e) => setProduk(e.target.value)} onClick={() => cekValueProduk()}>
                                        <option value='0'>Pilih Produk</option>
                                            {
                                                produks.map((p)=>(
                                                    <option key={p.id} value={p.nama}>{p.nama}</option>
                                                ))
                                            }
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Harga Produk</label>
                                    <div className="controls">
                                        <input 
                                            type="text" 
                                            className="input" 
                                            placeholder='Harga'
                                            value={harga}
                                            onChange={e => setQty(e.target.value)}
                                            disabled
                                        />
                                            
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Qty Produk</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Qty'
                                            value={qty} onChange={(e) => setQty(e.target.value)} />
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

export default CreateTransaksiComponents