import { ZOOM_OAUTH_ENDPOINT } from "../utils/constants.js";
import axios from "axios";
// const qs = require("query-string");
import qs from "query-string";

import zoomTokenSTS from "../models/zoomTokenSTS.js";

/**
 * Retrieve token from Zoom API
 *
 * @returns {Object} { access_token, expires_in, error }
 */
export const getToken = async () => {
  try {
    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
    console.log(
      " ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET",
      ZOOM_ACCOUNT_ID,
      "----",
      ZOOM_CLIENT_ID,
      "----",
      ZOOM_CLIENT_SECRET,
      "----"
    );
    const request = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    console.log("request", request.data);
    const { access_token, expires_in } = await request.data;

    return { access_token, expires_in, error: null };
  } catch (error) {
    return { access_token: null, expires_in: null, error };
  }
};

/**
 * Set zoom access token with expiration in redis
 *
 * @param {Object} auth_object
 * @param {String} access_token
 * @param {int} expires_in
 */

export const setToken = async ({ access_token, expires_in }) => {
  console.log("now we are in set token", expires_in, "expiry date");
  const token = new zoomTokenSTS({
    access_token,
    expires_in: new Date(Date.now() + expires_in * 1000), // Calculate the expiration time
  });

  console.log("token", token, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTt");
  await token.save();
};
