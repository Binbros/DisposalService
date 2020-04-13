import { Request, Response } from "express";
import models from "../models";

interface IContextParameters {
    req: Request;
    res: Response;
}
export default function({req, res}: IContextParameters) {
    return {
        models,
        req,
        res,
    };
}
