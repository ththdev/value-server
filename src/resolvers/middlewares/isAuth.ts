import { MiddlewareFn } from "type-graphql";
import { verifyToken } from "../../lib/jwt";
import { Context } from '../types/Context'

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    const { authorization } = context.req.headers

    if(!authorization) throw new Error("Please login again")

    try {
        const token = authorization.split(" ")[1]
        const payload = verifyToken(token)
        context.payload = payload as any;
    } catch (err) {
        throw new Error("Please login again")
    }

    return next()
}