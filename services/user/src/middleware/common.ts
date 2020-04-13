import parser from "body-parser";
import compression from "compression";
import cookieparser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";
import { NextFunction, Request, Response, Router } from "express";

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCookieParsing = (router: Router) => {
  router.use(cookieparser());
};
export const handleCsurf = (router: Router) => {
  router.use(csurf({ cookie: true }));
};
export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const handleCsurfPrevention = (router: Router) => {
  router.use("/", (req: Request, res: Response, next: NextFunction) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token);
    next();
  });
};
