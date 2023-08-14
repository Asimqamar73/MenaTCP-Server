// const redis = require("../configs/redis");
// const { getToken, setToken } = require("../utils/token");

import { setToken, getToken } from "../utils/zoomToken.js";
import zoomTokenSTS from "../models/zoomTokenSTS.js";

import jwt from "jsonwebtoken";
/**
 * Middleware that checks if a valid (not expired) token exists in redis
 * If invalid or expired, generate a new token, set in mongo zoomTokenSTS, and append to http request
 */

export const tokenCheck = async (req, res, next) => {
  console.log("I AM MIDDLE MANGO");
  try {
    const token = await zoomTokenSTS.findOne().lean();

    if (!token || isTokenExpired(token.access_token)) {
      console.log("TOKEN NI EXIST KARTA");
      const { access_token, expires_in, error } = await getToken();

      if (error) {
        const { response, message } = error;
        return res
          .status(response?.status || 401)
          .json({ message: `Authentication Unsuccessful: ${message}` });
      }

      await setToken({ access_token, expires_in });
      req.headerConfig = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
    } else {
      console.log("token exist karta hy");
      req.headerConfig = {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      };
    }

    return next();
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to check if a token is expired
const isTokenExpired = (token) => {
  const decodedToken = jwt.decode(token);
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }
  const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
  const currentTime = Date.now();
  return currentTime >= expirationTime;
};
