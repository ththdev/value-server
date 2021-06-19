import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entities/User";
import bcrypt, { compare } from 'bcryptjs'
import { generateToken } from "../lib/jwt";
import { isAuth } from "./middlewares/isAuth";
import { Context } from "vm";

@Resolver()
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "hello world";
  }

  @Mutation(() => String)
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
  ){
      const checkEmail = await User.findOne({ email })
      if (checkEmail) throw new Error("Email already is use.")

      const hashedPassword = await bcrypt.hash(password, 8);
      
      const user = await User.create({
          username,
          email,
          password: hashedPassword
      }).save()

      const token = generateToken(user.id)

      return token
  }

  @Mutation(() => String)
  async login(@Arg("email") email: string, @Arg("password") password: string) {
      const user = await User.findOne({ email })
      if (!user) throw new Error("Email not found.")

      const valid = await compare(password, user.password)
      if (!valid) throw new Error("Check your password.")

      const token = generateToken(user.id)

      return token
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async myInfo(@Ctx() { payload }: Context) {
    const user = await User.findOne(payload.id, { relations: ['transactions'] })
    
    return user
  }
}
