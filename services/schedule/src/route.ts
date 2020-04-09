import { Request, Response } from "express";

export default [
    {
        path : '/',
        method: 'get',
        handler: async (req:Request ,res:Response) => {
            res.send('Ready to dispose your waste? You\'re at the right place!')
        }
    }
]