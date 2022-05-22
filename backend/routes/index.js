import Express from "express";
import { getusers,Register,Login,Logout, getuserbyid, getuserbyname, UpdateUser, DeleteUser, AddUser, UpdatePassword } from "../controllers/Users.js";
import { verifyToken } from "../Middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { AddProduk, DeleteProduk, getProduk, getProdukbyid, getProdukbyname, UpdateProduk } from "../controllers/Produk.js";
import { AddRole, DeleteRole, getRole, getRolebyid, getRolebyname, UpdateRole } from "../controllers/Role.js";
import { AddCustomer, DeleteCustomer, getCustomer, getCustomerbyid, getCustomerbyname, UpdateCustomer } from "../controllers/Customer.js";
import { AddTransaksi, DeleteTransaksi, getTransaksi, getTransaksibyid, getTransaksibyname, UpdateTransaksi } from "../controllers/Transaksi.js";
const router= Express.Router();

router.get('/users',verifyToken,getusers);
router.get('/users/:id',verifyToken,getuserbyid);
router.get('/userbyname',verifyToken,getuserbyname);
router.post('/users',Register);
router.post('/addusers',verifyToken,AddUser);
router.put('/users/:id',verifyToken,UpdateUser);
router.put('/resetpassword/:id',verifyToken,UpdatePassword);
router.delete('/users/:id',verifyToken,DeleteUser);
router.post('/login',Login);
router.get('/token',refreshToken);
router.delete('/logout',Logout);

router.get('/produk',verifyToken,getProduk);
router.get('/produk/:id',verifyToken,getProdukbyid);
router.get('/produkbyname',verifyToken,getProdukbyname);
router.post('/produk',verifyToken,AddProduk);
router.put('/produk/:id',verifyToken,UpdateProduk);
router.delete('/produk/:id',verifyToken,DeleteProduk);

router.get('/role',getRole);
router.get('/role/:id',getRolebyid);
router.get('/rolebyname',getRolebyname);
router.post('/role',verifyToken,AddRole);
router.put('/role/:id',verifyToken,UpdateRole);
router.delete('/role/:id',verifyToken,DeleteRole);

router.get('/customer',verifyToken,getCustomer);
router.get('/customer/:id',verifyToken,getCustomerbyid);
router.get('/customerbyname',verifyToken,getCustomerbyname);
router.post('/customer',verifyToken,AddCustomer);
router.put('/customer/:id',verifyToken,UpdateCustomer);
router.delete('/customer/:id',verifyToken,DeleteCustomer);

router.get('/transaksi',verifyToken,getTransaksi);
router.get('/transaksi/:id',verifyToken,getTransaksibyid);
router.get('/transaksibyname',verifyToken,getTransaksibyname);
router.post('/transaksi',verifyToken,AddTransaksi);
router.put('/transaksi/:id',verifyToken,UpdateTransaksi);
router.delete('/transaksi/:id',verifyToken,DeleteTransaksi);
export default router;