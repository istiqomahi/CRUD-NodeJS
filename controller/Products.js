import Product from "../models/produkModels.js";
import User from "../models/userModels.js";
import Op from "sequelize";

export const getProduct = async(req, res) => {
    try{
        let response;
        if(req.role === "user"){
            response = await Product.findAll({
                attributes:['name','price'],
                include:[{
                    model: User,
                    attributes:['name']
                }]
            });
        }else{
            response = await Product.findAll({
                attributes:['uuid','name','price'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async (req, res) => {
    try{
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });

        if(!product){
            return res.status(404).json({msg: "Data tidak di temukan"});
        }else{
            let response;
            if(req.role === "admin"){
                response = await Product.findOne({
                    attributes:['uuid','name','price','userId'],
                    where:{
                        id: product.id
                    },
                    include:[{
                        model: User,
                        attributes:['name']
                    }]
                });
            }else{
                response = await Product.findOne({
                    attributes:['name','price'],
                    where:{
                        id: product.id
                    },
                    include:[{
                        model: User,
                        attributes:['name']
                    }]
                });
            }
            res.status(200).json(response);
        }
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const createProduct = async (req, res) => {
    if(req.role === "admin"){
            const {name, price} = req.body;
        try{
            await Product.create({
                name: name,
                price: price,
                userId: req.userId
            });
            res.status(201).json({msg:"Data Product Berhasil Tersimpan"});
        }catch(error){
            res.status(500).json({msg: error.message});
        }
    }else{
        res.status(201).json({msg:"Maaf anda tidak bisa memasukan data product"});
    }
}

export const updateProduct = async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });

        if(!product){
            return res.status(404).json({msg: "Data tidak di temukan"});
        }else{
            //let response;
            const {name, price} = req.body;
            if(req.role === "admin"){
                await Product.update({name, price},{
                    where:{
                        id: product.id
                    }
                })
            }else{
                if(req.userId !== product.userId) return res.status(403).json({msg:"akses terlarang"});
                await Product.update({name, price},{
                    where:{
                        [Op.and]:[{id: product.id},{userId: req.userId}]
                    }
                });
            }
            res.status(200).json({msg:"Data Product Berhasil Terupdatte"});
        }
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const deleteProduct = async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });

        if(!product){
            return res.status(404).json({msg: "Data tidak di temukan"});
        }else{
            //let response;
            const {name, price} = req.body;
            if(req.role === "admin"){
                await Product.destroy({
                    where:{
                        id: product.id
                    }
                })
            }else{
                if(req.userId !== product.userId) return res.status(403).json({msg:"akses terlarang"});
                await Product.destroy({
                    where:{
                        [Op.and]:[{id: product.id},{userId: req.userId}]
                    }
                });
            }
            res.status(200).json({msg:"Data Product Berhasil Terhapus"});
        }
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}