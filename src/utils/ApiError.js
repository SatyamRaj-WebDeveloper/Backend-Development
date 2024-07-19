class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went Wrong",
        error = [],
        stack = ""

    ){ super(message)
        this.message = message
        this.statusCode = statusCode
        this.success = false
        this.data = null
        this.errors = error

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }

    }
}

export {ApiError}