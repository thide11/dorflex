import Auth from "../../../auth/auth";
import { wrapRoutesErrorHandler } from "../utils/wrap-routes-error-handler";

export default function generateAuthMiddleware(auth : Auth) {
  return async (req : any, res : any, next : any) => {
    wrapRoutesErrorHandler(res, async () => {
      const token = searchForToken(req);
      if(token) {
        const data = await auth.exchangeJwtToUser(token);
        res.locals.context = data;
        req.context = data;
      }
      next();
    })
  }
}

function searchForToken(req : any) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}