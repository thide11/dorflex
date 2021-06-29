import Auth from "../../auth/auth";
import { wrapRoutesErrorHandler } from "../utils/wrap-routes-error-handler";

export default function generateAuthMiddleware(auth : Auth) {
  return async (req : any, res : any, next : any) => {
    wrapRoutesErrorHandler(res, async () => {
      const token = req.body.token || req.query.token;
      if(token) {
        const data = await auth.exchangeJwtToUser(token);
        res.locals.context = data;
        req.context = data;
      }
      next();
    })
  }
}