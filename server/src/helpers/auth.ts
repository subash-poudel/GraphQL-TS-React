import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import "dotenv/config";
import { accessTokenSecret, refreshTokenSecret } from "../config/app";

/**
 *  Generate the access token for the provided user.
 * @param user
 */
export const generateAccessToken = (user: User) => {
  return sign({ userId: user.id }, accessTokenSecret!, {
    expiresIn: "15m"
  });
};

/**
 *
 * Generate the refresh token.
 * @param user
 */
export const generateRefreshToken = (user: User) => {
  return sign({ userId: user.id }, refreshTokenSecret!, {
    expiresIn: "24h"
  });
};
