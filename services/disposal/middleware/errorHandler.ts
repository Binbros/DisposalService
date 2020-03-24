import {Request , Response , NextFunction , Router} from 'express';
import  * as ErrorHandler from '../utils/errors/errorHandler'

const handle404Error = (router : Router) => {
    router.use((req:Request , res:Response) => {
        ErrorHandler.notFoundError()
    })
}
const handle400Error = (router : Router) => {
    router.use((req:Request , res:Response) => {
        ErrorHandler.badRequestError()
    })
}

const handleClientErrors = (router:Router) => {
    router.use((err: Error , req:Request , res:Response , next:NextFunction) => {
    ErrorHandler.clientError(err, res, next)
    })
}
const handleServerErrors =(router:Router) => {
    router.use((err: Error, req:Request, res:Response, next:NextFunction) =>{
        ErrorHandler.serverError(err, res, next)
    })
}

export default [handle404Error, handleClientErrors , handleServerErrors, handle400Error ]