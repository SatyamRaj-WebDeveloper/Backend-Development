
//Utility Function for calling connectdb() function when and where we want 
// here--> requesthandler will refer to connectdb() function which will allow us to connect to Database 
const asynchandler =(requesthandler)=>{
    (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((err)=>next(err))
    }
}



export {asynchandler}










//This is the other way of making a wrapper for the connectdb function
//Wraper function to used again in future
/*const asynchandler = (Func)=>async(req,res,next)=>{
    try {
        await Func ( req, res, next)
    } catch (error) {
        res.status(error.code || 400).json({
            success : false ,
            meassage : error.meassage,
        })
    }
}*/