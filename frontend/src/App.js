import {BrowserRouter,Routes,Route} from 'react-router-dom';
import CreateProdukComponents from './components/CreateProdukComponents';
import CreateRoleComponents from './components/CreateRoleComponents';
import CreateUserComponents from './components/CreateUserComponents';
import Home from './components/Home';
import ListProdukComponents from './components/ListProdukComponents';
import ListRoleComponents from './components/ListRoleComponents';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import ViewProdukComponents from './components/ViewProdukComponents';
import ViewUserComponents from './components/ViewUserComponents';
import EditProfil from './components/EditProfil';
import ViewCustomerComponents from './components/Customer/ViewCustomerComponents';
import CreateCustomerComponents from './components/Customer/CreateCustomerComponents';
import ListCustomerComponents from './components/Customer/ListCustomerComponents';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact path = '/' element={<Login/>} />
        <Route path = '/register' element={<Register/>} />
        <Route path = '/home' element={<><Navbar /><Home /></>} />
        <Route path = '/create/:id' element={<CreateUserComponents/>} />
        <Route path = '/view-user/:id' element={<ViewUserComponents/>} />
        <Route path = "/gantiPassword/:id" element={<><Navbar /><ResetPassword /></>}></Route>
        <Route path = '/produk' element={<><Navbar /><ListProdukComponents /></>} />
        <Route path = '/createproduk/:id' element={<CreateProdukComponents/>} />
        <Route path = '/view-produk/:id' element={<ViewProdukComponents/>} />
        <Route path = '/role' element={<><Navbar /><ListRoleComponents /></>} />
        <Route path = '/createrole/:id' element={<CreateRoleComponents/>} />
        <Route path = '/edit-profil/:id' element={<EditProfil />} />

        <Route path = '/customer' element={<><Navbar /><ListCustomerComponents /></>} />
        <Route path = '/createcustomer/:id' element={<CreateCustomerComponents/>} />
        <Route path = '/view-customer/:id' element={<ViewCustomerComponents/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
