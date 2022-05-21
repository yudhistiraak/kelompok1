import Role from "../models/RoleModel.js";
import { Op } from 'sequelize';

export const getRole = async (req, res) => {
    try {
        const dataRole = await Role.findAll({
            attributes: ['id', 'role']
        });
        res.json(dataRole);
    } catch (error) {
        console.log(error);
    }
}

export const getRolebyid = async (req, res) => {
    const id = req.params.id;
    try {
        const dataRole = await Role.findByPk(id);
        res.json(dataRole);
    } catch (error) {
        console.log(error);
    }
}

export const getRolebyname = async (req, res) => {
    const role = req.body.role;
    var condition = role ? { role: { [Op.like]: `%${role}%` } } : null;
    try {
        const dataRole = await Role.findAll({ where: condition });
        res.json(dataRole);
    } catch (error) {
        console.log(error);
    }
}


export const AddRole = async (req, res) => {
    const { role } = req.body
    try {
        await Role.create({
            role: role
        })
        res.json({ msg: "tambah role berhasil" })
    } catch (error) {
        console.log(error)
    }
}


export const UpdateRole = async (req, res) => {
    const id = req.params.id;
    const { role } = req.body;
    const data = {
        role: role,
        // password: hashPassword
    }
    try {
        await Role.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const DeleteRole = async (req, res) => {
    const id = req.params.id;
    try {
        await Role.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Berhasil Hapus Role" });
    } catch (error) {
        console.log(error);
    }
}
