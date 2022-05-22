import React, {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
const ListTransaksiComponents = () => {
    const [tgl, setTgl]=useState('');
    const [produk, setProduk]=useState('');
    const [nama_customer, setCustomer]=useState('');
    const [harga, setHarga]=useState('');
    const [qty, setQty]=useState('');
    const [transaksi, setTransaksi]=useState('');
    const [transaksis, setTransaksis]=useState([]);
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [produks, setProduks]=useState([]);

    const history = useNavigate();
    const axiosJwt = axios.create();

    const mystyle = {
        marginLeft: "30px"
    };

    useEffect(()=>{
        refreshToken();   
        getTransaksi(); 
        // eslint-disable-next-line
    },[]);

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
            setExpired(decode.exp);
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const getTransaksi=async()=>{
        const response = await axiosJwt.get('http://localhost:5000/transaksi',{
            headers:{
                Authorization:`Bearer ${token}`
            } 
        });
        setTransaksis(response.data);
    }
    const addTransaksi=()=>{
        history('/createtransaksi/_add');
        
    }
    const editTransaksi=(id)=>{
        history(`/createtransaksi/${id}`);
    }
    const viewTransaksi=(id)=>{
        history(`/view-transaksi/${id}`);
    }
    const deleteTransaksi = async (id) => {
        var proceed = window.confirm("Apakah anda yakin akan hapus?");
        if(proceed){
            const response = await axiosJwt.delete('http://localhost:5000/transaksi/'+id,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            swal(response.data.msg);
            const NewTransaksi = transaksis.filter(transaksi => transaksi.id !== id);
            setTransaksis(NewTransaksi);
        } 
    }

  return (
      <div className='container mt-5'>Selamat datang {nama_customer} tanggal transaksi {tgl}
          <hr />
          <button onClick={addTransaksi} className='button is-info'>Add Transaksi</button>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-fullwidth'>
              <thead>
                  <tr>
                      <th>No</th>
                      <th>Tanggal Transaksi</th>
                      <th>Nama Customer</th>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Quantity</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {transaksis.map((transaksi, index)=>(
                      <tr key={transaksi.id}>
                          <td>{index + 1}</td>
                          <td>{transaksi.tgl}</td>
                          <td>{transaksi.nama_customer}</td>
                          <td>{transaksi.produk}</td>
                          <td>{transaksi.harga}</td>
                          <td>{transaksi.qty}</td>
                          <td>
                              <button onClick={()=>editTransaksi(transaksi.id)}
                                    className='button is-default'>Edit</button>
                              <button style={mystyle}
                                    onClick={()=>deleteTransaksi(transaksi.id)}
                                    className='button is-danger'>Delete</button>
                              <button style={mystyle}
                                    onClick={()=>viewTransaksi(transaksi.id)}
                                    className='button is-success'>View</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  )
}

export default ListTransaksiComponents