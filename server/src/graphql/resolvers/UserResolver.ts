import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx
} from "type-graphql";
import { User } from "../../entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "../context/MyContext";
import { generateAccessToken, generateRefreshToken } from "../../helpers/auth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hasehdPassword = await hash(password, 12);

    try {
      await User.insert({
        name,
        email,
        password: hasehdPassword
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid login.");
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new Error("Invalid login.");
    }

    let refreshToken = generateRefreshToken(user);
    let accessToken = generateAccessToken(user);

    res.cookie("jid", refreshToken, { httpOnly: true });

    return {
      accessToken
    };
  }
}
