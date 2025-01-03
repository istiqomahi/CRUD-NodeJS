import User from "../models/userModels.js";

export const  verifyUser = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({msg:"Mohon login ke akun anda"});
    }
    const user = await User.findOne({
        where:{
            uuid: req.session.userId
        }
    });
    if(!user){
        return res.status(404).json({msg:"User Tidak diTemukan"});
    }else{
        //res.status(200).json(user);
        req.userId = user.id;
        req.role   = user.role;
        next();
    }
}

export const adminOnly = async(req,res,next) =>{
    /** if(!req.session.userId){
        return res.status(401).json({msg:"Mohon login ke akun anda"});
    }*/

    const user = await User.findOne({
        where:{
            uuid: req.session.userId
        }
    });

    if(!user){
        return res.status(404).json({msg:"User Tidak diTemukan"});
    }else{
        if(user.role !== "admin"){
            return res.status(403).json({msg:"Akses Terlarang"});
        }else{
            next();
        }
    }
}