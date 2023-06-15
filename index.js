const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()
const port = 3002
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//schema
    const itemSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true           
      },
      price:{
        type: Number,
        required: true
      },
      info:{
        type: String,
        required: true
      },
    })
//create model
    const itemModel = mongoose.model("Items", itemSchema)

//connected db
const uri = ``;
   console.log(uri);
    const connectDB = async () => {
        try{
            await mongoose.connect(uri)
            console.log('db is connected');
        }
        catch(err){
            console.log('db is not connected')
            console.log(err.message);
            process.exit(1)
        }
      
    }

//server start
    app.get('/', (req,res)=>{
    res.send('Welcome to server')  
    })

//create data
    app.post('/items', async (req,res)=>{
        try{
            const newItem = new itemModel({
                title: req.body.title,
                price: req.body.price,
                info: req.body.info,
            })
            const savenewItem = await newItem.save()
            res.status(201).send(savenewItem)
        }
        catch(err){
            res.status(500).send({messege: err.message})
        }
    })
//read data
    app.get('/items', async(req,res)=>{
        try{
            const items = await itemModel.find()
            if(items){
                res.status(200).send(items)
            }else{
                res.status(400).send('Items not found')
            }
        }
        catch(err){
            res.status(500).send({messege: err.message})
        }
    })
//read single data    
    app.get('/items/:id', async(req,res)=>{
        try{
            const id = req.params.id
            const item = await itemModel.findOne({_id: id})
            res.status(200).send(item)           
        }
        catch(err){
            res.status(500).send({messege: err.message})
        }
    })
//delete single data
    app.delete('/items/:id', async (req,res)=>{
        try{
            const id = req.params.id
            const item = await itemModel.deleteOne({_id: id})
            if(item){
                res.status(200).send({
                    success: true,
                    message: "Deleted single item",
                    data: item
                }) 
            }else{
                res.status(404).send({
                    success: false,
                    message: "Item not found",
                }) 
            }                   
        }
        catch(err){
            res.status(500).send({messege: err.message})
        }
    })
//update data
app.put('/items/:id', async (req,res)=>{
    try{
        const id = req.params.id
        const item = await itemModel.updateOne({_id: id},{
            $set: {
                title: req.body.title,
                price: req.body.price,
                info: req.body.info
            }
        })
        if(item){
            res.status(200).send({
                success: true,
                message: "Update single item",
                
            }) 
        }else{
            res.status(404).send({
                success: false,
                message: "Item not found",
            }) 
        }                   
    }
    catch(err){
        res.status(500).send({messege: err.message})
    }
})


    app.listen(port, async () => {
    console.log(`Server is running ${port}`);
    await connectDB()
    })