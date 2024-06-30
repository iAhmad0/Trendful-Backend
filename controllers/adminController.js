const Admin = require('../models/admin') 
const Seller = require('../models/seller') 
const Buyer = require('../models/buyer') 
const Product = require('../models/product') 
const { StatusCodes } = require('http-status-codes') 
const { BadRequestError , NotFoundError } = require('../errors') 
 
const getAllSellers = async (req,res) =>{ 
    const sellers = await Seller.find().sort('createdAt') 
    res.status(StatusCodes.OK).json({ sellers}) 
} 
 
const getAllBuyers = async (req,res) =>{ 
    const buyers = await Buyer.find().sort('createdAt') 
    res.status(StatusCodes.OK).json({ buyers }) 
} 
 
const updateSeller = async (req, res) => { 
    if(!req.body) 
    { 
        throw new BadRequestError(' Data to update can not be empty.') 
    } 
 
    const seller = await Seller.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators: true}) 
 
        if(!seller) {  
            throw new NotFoundError(`no seller with ${req.params.id} `) 
           } 
           res.status(StatusCodes.OK).json({seller}) 
    } 
 
 
const updateBuyer = async (req, res) => { 
    if(!req.body) 
    { 
        throw new BadRequestError(' Data to update can not be empty.') 
    } 
 
    const buyer = await Buyer.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators: true}) 
 
        if(!buyer) {  
            throw new NotFoundError(`no buyer with ${req.params.id} `) 
           } 
           res.status(StatusCodes.OK).json({buyer}) 
} 
 
const deleteSeller = async (req, res) => { 
    const seller = await Seller.findByIdAndRemove(req.params.id) 
    if(!seller) {  
        throw new NotFoundError(`no seller with ${req.params.id} `) 
       } 
       res.status(StatusCodes.OK).send('seller deleted successfully') 
} 
 
const deleteBuyer = async (req, res) => { 
    const buyer = await Buyer.findByIdAndRemove(req.params.id) 
    if(!buyer) {  
        throw new NotFoundError(`no buyer with ${req.params.id} `) 
       } 
       res.status(StatusCodes.OK).send('buyer deleted successfully') 
} 
 
   
  // get admin  
  const getAdmin = async (req, res)  =>{ 
    const admin = await Admin.findById(req.params.id) 
    if(!admin) {  
     throw new NotFoundError(`no admin with ${req.params.id} `) 
    } 
    res.status(StatusCodes.OK).json({admin}) 
 } 
 
// get all admins 
const getAllAdmins = async (req,res) =>{ 
    const admins = await Admin.find().sort('createdAt') 
    res.status(StatusCodes.OK).json({ admins}) 
} 
 
// update admin 
const updateAdmin = async (req, res) => { 
    if(!req.body) 
    { 
        throw new BadRequestError(' Data to update can not be empty.') 
    } 
 
    const admin = await Admin.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators: true}) 
 
        if(!admin) {  
            throw new NotFoundError(`no admin with ${req.params.id} `) 
           } 
           res.status(StatusCodes.OK).json({admin}) 
} 
 
// delete admin 
const deleteAdmin = async (req, res) => { 
    const admin = await Admin.findByIdAndRemove(req.params.id) 
    if(!admin) {  
        throw new NotFoundError(`no admin with ${req.params.id} `) 
       } 
       res.status(StatusCodes.OK).send('admin deleted successfully') 
} 
 
// create product  
 const createProduct = async (req, res) => { 
    const newProduct = await Product.create(req.body); 
    res.status(StatusCodes.CREATED).json({ 
        status : 'success', 
        data : { 
            product : newProduct 
        } 
    }); 
 } 
 
 // read products 
 const getAllProducts = async (req,res) =>{ 
    const products = await Product.find().sort('createdAt') 
    res.status(StatusCodes.OK).json({ products}) 
} 
 
// update product 
const updateProduct = async (req, res) => { 
    if(!req.body) 
    { 
        throw new BadRequestError(' Data to update can not be empty.') 
    } 
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators: true}) 
        if(!product) {  
            throw new NotFoundError(`no product with id ${req.params.id} `) 
           }res.status(StatusCodes.OK).json({product}) 
        } 
     
    // delete product 
    const deleteProduct = async (req, res) => { 
        const product = await Product.findByIdAndRemove(req.params.id) 
        if(!product) {  
            throw new NotFoundError(`no product with id ${req.params.id} `) 
           } 
           res.status(StatusCodes.OK).send('product deleted successfully') 
    } 
     
    module.exports = { 
        getAllBuyers, 
        getAllSellers, 
        updateBuyer, 
        updateSeller, 
        deleteBuyer, 
        deleteSeller, 
        getAdmin, 
        getAllAdmins, 
        updateAdmin, 
        deleteAdmin, 
        createProduct, 
        getAllProducts, 
        updateProduct, 
        deleteProduct 
     
    }