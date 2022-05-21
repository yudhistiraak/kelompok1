import React, {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component'

const Home = () => {
    const [name, setName]=useState('');
    const [role, setRole]=useState('');
    const [token, setToken]=useState('');
    const [expired, setExpired]=useState('');
    const [users, setUsers]=useState([]);

    const history = useNavigate();
    const axiosJwt = axios.create();


    useEffect(()=>{
        refreshToken();   
        getUsers(); 
        // eslint-disable-next-line
    },[]);

    const refreshToken=async() => {
        try {
            const response=await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            setName(decode.name);
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
            setName(decode.name);
            setRole(decode.role);
            setExpired(decode.exp);
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    });
    const getUsers=async()=>{
        const response = await axiosJwt.get('http://localhost:5000/users',{
            headers:{
                Authorization:`Bearer ${token}`
            } 
        });
        setUsers(response.data);   
    }
    const addUser=()=>{
        history('/create/_add');
        
    }
    const editUser=(id)=>{
        history(`/create/${id}`);
    }
    const viewUser=(id)=>{
        history(`/view-user/${id}`);
    }
    const deleteUser= async(id)=>{
        var proceed = window.confirm('Apakah anda yakin akan hapus?');
        if(proceed){
            const response = await axiosJwt.delete('http://localhost:5000/users/'+id,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            swal(response.data.msg);
            const NewUsers = users.filter(user => user.id !== id);
            setUsers(NewUsers);
        } 
    }
    function gantiPassword(id) {
        history(`/gantiPassword/${id}`)
    }
    const data = users;
    const columns = [
        {
            name: 'ID',
            width: '50px',
            cell: (row)=>{
                return <div>{row.id}</div>;
            },
            shortable: true
        },
        {
            name: 'Name',
            width: '200px',
            selector: row => row.name,
            shortable: true
        },
        {
            name: 'Email',
            width: '200px',
            selector: row => row.email,
            shortable: true
        },
        {
            name: 'Role',
            width: '200px',
            selector: row => row.role,
            shortable: true
        },
        {
            name: 'Action',
            width: '400px',
            cell: (row)=>{
                return (
                    <div>
                        <button onClick={()=>editUser(row.id)}
                          className='button is-default'>Edit</button>
                        <button onClick={()=>deleteUser(row.id)}
                          className='button is-danger'>Delete</button>
                        <button onClick={()=>viewUser(row.id)}
                          className='button is-success'>View</button>
                        <button onClick={() => gantiPassword(row.id)}
                          className='button is-warning'>Ganti Password</button>
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    function MyComponent() {
        if (role === 'admin') {
            return(
                <div>
                    <button onClick={addUser} className='button is-info'>Add User</button>
                    <DataTable  
                        columns={columns}
                        data={data}
                        pagination
                    />
                </div>
            )
        }
    }
  return (
      <div className='container mt-5'>
          <h1>Selamat datang {name}</h1>
          <h1>Anda login sebagai {role}</h1>
          <hr />
          {MyComponent()}
          {/* <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-fullwidth'>
              <thead>
                  <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {users.map((user, index)=>(
                      <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                              <button onClick={()=>editUser(user.id)}
                                    className='button is-default'>Edit</button>
                              <button style={mystyle }
                                    onClick={()=>deleteUser(user.id)}
                                    className='button is-danger'>Delete</button>
                              <button style={mystyle}
                                    onClick={()=>viewUser(user.id)}
                                    className='button is-success'>View</button>
                              <button style={mystyle}
                                    onClick={() => gantiPassword(user.id)}
                                    className='button is-warning'>Ganti Password</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table> */}
      </div>
  )
}

export default Home