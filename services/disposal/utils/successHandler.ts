import {Response} from 'express';
export const successHandler = (res: Response, status: number, data: object |string) => {
    res.status(status).json({
      status,
      data,
    });
  };