import React, {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
const ListProdukComponents = () => {
    const [nama, setNama]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [produks, setProduk]=useState([]);

    const history = useNavigate();
    const axiosJwt = axios.create();

    const mystyle = {
        marginLeft: "30px"
    };

    useEffect(()=>{
        refreshToken();   
        getProduk(); 
        // eslint-disable-next-line
    },[]);

    const refreshToken=async() => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setNama(decode.nama);
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
            setNama(decode.nama);
            setExpired(decode.exp);
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const getProduk=async()=>{
        const response = await axiosJwt.get('http://localhost:5000/produk',{
            headers:{
                Authorization:`Bearer ${token}`
            } 
        });
        setProduk(response.data);   
    }
    const addProduk=()=>{
        history('/createproduk/_add');
        
    }
    const editProduk=(id)=>{
        history(`/createproduk/${id}`);
    }
    const viewProduk=(id)=>{
        history(`/view-produk/${id}`);
    }
    const deleteProduk = async (id) => {
        var proceed = window.confirm("Apakah anda yakin akan hapus?");
        if(proceed){
            const response = await axiosJwt.delete('http://localhost:5000/produk/'+id,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            swal(response.data.msg);
            const NewProduk = produks.filter(produk => produk.id !== id);
            setProduk(NewProduk);
        } 
    }

  return (
      <div className='container mt-5'>Selamat datang {nama} di Bootcamp
          <hr />
          <button onClick={addProduk} className='button is-info'>Add Produk</button>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-fullwidth'>
              <thead>
                  <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Harga</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {produks.map((produk, index)=>(
                      <tr key={produk.id}>
                          <td>{index + 1}</td>
                          <td>{produk.nama}</td>
                          <td>{produk.harga}</td>
                          <td>
                              <button onClick={()=>editProduk(produk.id)}
                                    className='button is-default'>Edit</button>
                              <button style={mystyle}
                                    onClick={()=>deleteProduk(produk.id)}
                                    className='button is-danger'>Delete</button>
                              <button style={mystyle}
                                    onClick={()=>viewProduk(produk.id)}
                                    className='button is-success'>View</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  )
}

export default ListProdukComponents