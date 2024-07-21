
//Utility Function for calling any asynchronous function when and where we want 
//Here requesthandler can be any asynchronous function , asynchandler is a higher-order-function since it accepts another function as a parameter

const asynchandler =(requesthandler)=>{
   return (req,res,next)=>{
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