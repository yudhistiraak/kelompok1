import React, {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
const ListCustomerComponents = () => {
    const [nama_customer, setNamaCustomer]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [customers, setCustomers]=useState([]);

    const history = useNavigate();
    const axiosJwt = axios.create();

    const mystyle = {
        marginLeft: "30px"
    };

    useEffect(()=>{
        refreshToken();   
        getCustomer(); 
        // eslint-disable-next-line
    },[]);

    const refreshToken=async() => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setNamaCustomer(decode.nama_customer);
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
            setNamaCustomer(decode.nama_customer);
            setExpired(decode.exp);
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const getCustomer=async()=>{
        const response = await axiosJwt.get('http://localhost:5000/customer',{
            headers:{
                Authorization:`Bearer ${token}`
            } 
        });
        setCustomers(response.data);   
    }
    const addCustomer=()=>{
        history('/createcustomer/_add');
        
    }
    const editCustomer=(id)=>{
        history(`/createcustomer/${id}`);
    }
    const viewCustomer=(id)=>{
        history(`/view-customer/${id}`);
    }
    const deleteCustomer = async (id) => {
        var proceed = window.confirm("Apakah anda yakin akan hapus?");
        if(proceed){
            const response = await axiosJwt.delete('http://localhost:5000/customer/'+id,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            swal(response.data.msg);
            const NewCustomer = customers.filter(customer => customer.id !== id);
            setCustomers(NewCustomer);
        } 
    }

  return (
      <div className='container mt-5'>Selamat datang {nama_customer}
          <hr />
          <button onClick={addCustomer} className='button is-info'>Add Customer</button>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-fullwidth'>
              <thead>
                  <tr>
                      <th>No</th>
                      <th>Nama Customer</th>
                      <th>Email</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {customers.map((customer, index)=>(
                      <tr key={customer.id}>
                          <td>{index + 1}</td>
                          <td>{customer.nama_customer}</td>
                          <td>{customer.email}</td>
                          <td>
                              <button onClick={()=>editCustomer(customer.id)}
                                    className='button is-default'>Edit</button>
                              <button style={mystyle}
                                    onClick={()=>deleteCustomer(customer.id)}
                                    className='button is-danger'>Delete</button>
                              <button style={mystyle}
                                    onClick={()=>viewCustomer(customer.id)}
                                    className='button is-success'>View</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  )
}

export default ListCustomerComponents