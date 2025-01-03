import User from "../models/userModels.js";
import argon2 from "argon2";
//import pool from "pool";
import { Sequelize } from "sequelize";
export const getUsers = async(req, res) => {
    try{
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email','role']
        });
        res.status(200).json(response);
    }catch(err){
        res.status(500).json({msg: err.message});
    }
}

export const getUserById = async(req, res) => {
    try{
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where:{
                uuid: req.params.id
            }
        });
            return res.status(200).json(response);
    }catch(err){
        res.status(500).json({msg: err.message});
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;

    // Check if password and confirm password match
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    try {
        // Check if the user already exists in the database
        const [rows] = await Sequelize.query('SELECT * FROM users WHERE name = :name',{
            replacements:{id: 'REPLACE_STUDENT_ID'},
            type: Sequelize.QueryTypes.SELECT
        });
        if (rows.length > 0) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hashPassword = await argon2.hash(password);

        // Create the user in the database
        await Users.create({
            name: name,
            email: email,
            password: password,
            role: role,
            userId: req.userId
        });

        res.status(201).json({ msg: "Register berhasil" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const updateUser = async(req, res) => {
    const user = await User.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!user){
        return res.status(404).json({msg: "User Tidak di Temukan"});
    }else{
        const {name, email, password, confPassword, role} = req.body;
        //cek password
        let hashPassword;
        if(password === "" || password === null){
            hashPassword = user.password
        }else{
            hashPassword = await argon2.hash(password);
        }
        if(password !== confPassword){
            return res.status(400).json({msg:"Password dan Confirm Password tidak cocok"});
        }else{
            try{
                await User.update({
                    name:name,
                    email:email,
                    password: hashPassword,
                    role:role
                },{
                    where:{
                        id: user.id
                    }
                });
                res.status(200).json({msg: "User Updated"});
            }catch(err){
                res.status(400).json({msg: err.message});
            }
        }
    }
}

export const deleteUser = async(req, res) => {
    const user = await User.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!user){
        return res.status(404).json({msg: "User Tidak di Temukan"});
    }else{
        try{
            await User.destroy({
                where:{
                    id: user.id
                }
            });
            res.status(200).json({msg: "User Deleted"});
        }catch(err){
            res.status(400).json({msg: err.message});
        }
    }
}

