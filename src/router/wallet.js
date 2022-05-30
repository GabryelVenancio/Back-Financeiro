const express = require("express");
const router = express.Router();
const wallet = require("../model/wallet");
const verify_token = require("../middleware/verifytoken");

router.post("/add",verify_token,(req,res)=>{
    const data = new wallet(req.body);
    data.save().then((result)=>{
        res.status(201)
        .send({output:`Card inserted`,payload:result})
    })
    .catch((error)=>res.status(500)
    .send({output:`Error at inserted new card -> ${error}`}))
});

router.get("/list/user/:iduser",verify_token,(req,res)=>{
    wallet.find({iduser:req.params.iduser},
        (error,result)=>{
            if(error)return res.status(500)
            .send({output:`Internal error -> ${error}`})

            if(!result)return res.status(404)
            .send({output:`User not found`})

            res.status(200).send({output:`Ok`,payload:result})
        })
})

router.get("/list/card/:idcard",verify_token,(req,res)=>{
    wallet.findById(req.params.idcard,
        (error,result)=>{
            if(error)return res.status(500)
            .send({output:`Internal error -> ${error}`})

            if(!result)return res.status(404)
            .send({output:`Card not found`})

            res.status(200).send({output:`Ok`,payload:result})
        })
})

module.exports = router;