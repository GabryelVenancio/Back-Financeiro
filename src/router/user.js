const express = require("express");
const users = require("../model/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const create_token = require("../utils/createtoken")

mongoose.connect("mongodb://127.0.1:27017/bancodedados",{
    useNewUrlParser:true,useUnifiedTopology:true
})

const cfg = require("../config/cfg");
const { token } = require("morgan");
const { route } = require("express/lib/application");
const verify_token = require("../middleware/verifytoken");

//router defined to create user
router.post("/add",(req,res)=>{
    bcrypt.hash(req.body.password,cfg.salt_bc,(error, hash)=>{
        if(error)return res.status(500).send({output:`Internal Error ate generated password -> ${error}`});
        //insert hash password at body password request
        req.body.password = hash;
        const data = new users(req.body);
        data.save().then((result)=>{
            res.status(201).send({output:`Inserted Success`,payload:result})
        }).catch((err)=>console.error({output:`Error at insert -> ${err}`}))
    })
})

//router login defined
router.post("/login",(req,res)=>{
    users.findOne({user:req.body.user},(error,result)=>{
        if(error)return res.status(500).send({output:`Internal Error -> ${error}`})
        if(!result)return res.status(404).send({output:`User not found`})
        
        bcrypt.compare(req.body.password,result.password,(err,same)=>{
            if(err)return res.status(500).send({output:`Internal Error -> ${err}`})
            if(!same)return res.status(400).send({output:`Invalid password`});

            const token = create_token(result._id,result.user,result.email);

            res.status(200).send({output:`Authenticated`,token:token})
        })
    })

})

router.put("/update/email/:id", verify_token ,(req,res)=>{
    users.findByIdAndUpdate(
        req.params.id,
        {email:req.body.email},
        {new:true},
        (error,result)=>{
            if(error)return res.status(500).send({output:`Internal Error -> ${error}`});
            if(!result)return res.status(404).send({output:`User not found`});
            res.status(202).send({output:`User email updated`})
        })
})

router.put("/update/password/:id", verify_token ,(req,res)=>{

    bcrypt.hash(req.body.password,cfg.salt_bc,(error, hash)=>{
        if(error)return res.status(500).send({output:`Internal Error ate generated password -> ${error}`});
        req.body.password = hash;

    users.findByIdAndUpdate(
        req.params.id,
        {password:req.body.password},
        {new:true},
        (error,result)=>{
            if(error)return res.status(500).send({output:`Internal Error -> ${error}`});
            if(!result)return res.status(404).send({output:`User not found`});
            res.status(202).send({output:`User password updated`})
        })
    })    
})

router.get("/list",(req,res)=>{
    users.find((error, result)=>{
        if(error)return res.status(500).send({output:`Internal Error -> ${error}`});
        res.status(200).send({output:"Ok",payload:result})
    }).select("-password")
})

module.exports = router;