const {ROLES} = require("../utils/constants");
const Product = require("../models/Products");
const cloudinary= require("../utils/cloudinary");

const createProduct = async(req,res) =>{
    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access Denied"});
    }

    try {
        const {name, description, price, stock, category, colors}= req.body;
        const uploadedImages = [];

        for(const file in req.files){
            const result = await cloudinary.uploader.upload(req.files[file].path,{folder:"products"});
            // console.log(result)
            uploadedImages.push({
                url:result.secure_url,
                id: result.public_id,
            });
        }
        const product = new Product({
            name,
            price,
            description,
            stock,
            colors,
            category,
            images: uploadedImages,
        })
        await product.save();

        return res.status(200).json({success:true, message:"Product added successfully.",data:product})
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

const updateProduct = async(req,res) =>{
    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access denied"});
    }

    try {
        const {...data} =req.body;
        const {id} = req.params;

        const product = await Product.findByIdAndUpdate(id, data, {new:true});

        if(!product){
            return res.status(404).json({success:false, message: "Product not found"})
        }

        return res.status(200).json({success:true, message:"Product updated successfully."});
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

const deleteProduct = async(req,res) =>{
    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access denied"});
    }

    try{
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if(!product){
            return res.status(404).json({success:false, message:"Product not found"});
        }

        return res.status(200).json({success:true, message:"Product deleted successfully."});

    }catch(error){
        return res.status(500).json({success:false, message:error.message});
    }
}

const getProducts = async(req,res) =>{
    try{
        // Destructure using let to allow reassignment
        let {limit, page, category, price, search} = req.query;

        // Parse values into the same variables
        page = parseInt(page) || 1; // Use 1 as default to avoid page=0 issues
        limit = parseInt(limit) || 10;

        let query = {}

        if(category){
            query.category = category.charAt(0).toUpperCase() + category.slice(1);
        }

        // Fix: Use === instead of = for comparison
        if(category === 'all') delete query.category;

        if(search) query.name = {$regex: search, $options: "i"};

        if(price > 0) query.price = {$lte: price};

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Fixed page calculation (page-1 becomes page)
        const products = await Product.find(query)
            .select("name price images rating description blackListed")
            .skip((page - 1) * limit)
            .limit(limit);

        let newProductArray = products.map((product) => {
            const productObj = product.toObject();
            productObj.image = productObj.images[0] || "";
            delete productObj.images;
            return productObj;
        });


        
        console.log(newProductArray)
        if(!products.length){
            return res.status(404).json({success:false, message:"Products not found"});
        }

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: newProductArray,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                pageSize: limit,
            }
        });

    } catch(error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

const getProductByName = async(req,res) =>{
    const {name} = req.params;


    try{
        const product = await Product.findOne({name:{
            $regex: new RegExp(name,'i'),
        }});
        if(!product) return res.status(404).json({success:false, message:"Product not found"});

        return res.status(200).json({success:true, message:"Product found", data:product});

    }catch(error){
        return res.status(500).json({success:false, message:error.message});
    }
}

const blackListProduct = async(req, res) =>{
    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access denied"});
    }
    try{
        const id= req.params.id;
        // console.log(id);
        const product = await Product.findByIdAndUpdate(id,{blackListed:true},{new:true});

        if(!product) return res.status(404).json({success:false, message:"Product not found"});

        return res.status(200).json({success:true, message:`The product ${product.name} has been blacklisted`, data:product});

    }catch(error){
        return res.status(500).json({success:false, message:error.message});
    }
}

const removeFromBlackList = async(req, res) =>{
    if(req.role !== ROLES.admin){
        return res.status(401).json({success:false, message:"Access denied"});
    }
    try{
        const id= req.params.id;

        const product = await Product.findByIdAndUpdate(id,{blackListed:false},{new:true});

        if(!product) return res.status(404).json({success:false, message:"Product not found"});

        return res.status(200).json({success:true, message:`The product ${product.name} has been removed from blacklist`, data:product});

    }catch(error){
        return res.status(500).json({success:false, message:error.message});
    }
}

module.exports = {createProduct, updateProduct, deleteProduct, getProducts, getProductByName, blackListProduct, removeFromBlackList};