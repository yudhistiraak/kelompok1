import React, {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
const ListRoleComponents = () => {
    const [role, setRole]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [roles, setRoles]=useState([]);

    const history = useNavigate();
    const axiosJwt = axios.create();

    const mystyle = {
        marginLeft: "30px"
    };

    useEffect(()=>{
        refreshToken();   
        getRole(); 
        // eslint-disable-next-line
    },[]);

    const refreshToken=async() => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setRole(decode.role);
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
            setRole(decode.role);
            setExpired(decode.exp);
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const getRole=async()=>{
        const response = await axiosJwt.get('http://localhost:5000/role',{
            headers:{
                Authorization:`Bearer ${token}`
            } 
        });
        setRoles(response.data);   
    }
    const addRole=()=>{
        history('/createrole/_add');
        
    }
    const editRole=(id)=>{
        history(`/createrole/${id}`);
    }
    const viewRole=(id)=>{
        history(`/view-role/${id}`);
    }
    const deleteRole = async (id) => {
        var proceed = window.confirm("Apakah anda yakin akan hapus?");
        if(proceed){
            const response = await axiosJwt.delete('http://localhost:5000/role/'+id,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            swal(response.data.msg);
            const NewRole = roles.filter(role => role.id !== id);
            setRoles(NewRole);
        } 
    }

  return (
      <div className='container mt-5'>
          <hr />
          <button onClick={addRole} className='button is-info'>Add Role</button>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-fullwidth'>
              <thead>
                  <tr>
                      <th>No</th>
                      <th>Role</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {roles.map((role, index)=>(
                      <tr key={role.id}>
                          <td>{index + 1}</td>
                          <td>{role.role}</td>
                          <td>
                              <button onClick={()=>editRole(role.id)}
                                    className='button is-default'>Edit</button>
                              <button style={mystyle}
                                    onClick={()=>deleteRole(role.id)}
                                    className='button is-danger'>Delete</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  )
}

export default ListRoleComponents