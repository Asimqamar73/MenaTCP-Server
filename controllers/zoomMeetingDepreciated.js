import axios from "axios";
import Zoomtoken from "../models/zoomtoken.js";
import jwt from "jsonwebtoken";
import zoomMeeting from "../models/zoomMeeting.js";
import { errorHandler } from "../utils/errorHandler.js";
import { ZOOM_API_BASE_URL } from "../utils/constants.js";
import qs from "query-string";
////-------STS-------////
export const fetchAllMeetingBySTS = async (req, res) => {
  const { headerConfig } = req;
  const { status, next_page_token } = req.query;
  console.log(req.query, "req.query ");
  console.log(ZOOM_API_BASE_URL, "ZOOM_API_BASE_URL ");
  console.log(
    qs.stringify({ status, next_page_token }),
    "qs.stringify({ status, next_page_token }) "
  );

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/users?${qs.stringify({ status, next_page_token })}`,
      headerConfig
    );
    console.log(request, "LLLLLLLLLLLLLLLLLL");
    res.status(200).json(request.data);
  } catch (err) {
    res.status(500).json(err);
    // return errorHandler(err, res, "Error fetching users");
  }
};

/**
 * List users
 * https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users
 */
// router.get("/", async (req, res) => {
//   const { headerConfig } = req;
//   const { status, next_page_token } = req.query;

//   try {
//     const request = await axios.get(
//       `${ZOOM_API_BASE_URL}/users?${qs.stringify({ status, next_page_token })}`,
//       headerConfig
//     );
//     return res.json(request.data);
//   } catch (err) {
//     return errorHandler(err, res, "Error fetching users");
//   }
// });
////-------STS-------////
export const getToken = async (req, res) => {
  const { code, state } = req.query;
  const authorizationCode = code;
  const redirectUrl = "http://localhost:8080/zoom/exchange-token";
  const clientId = "5lftAfaRmSqQR7qUCDdeQ";
  const clientSecret = "4b6G5it7j27D93YNSE7H4zkbgCDiAXHh";

  try {
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: redirectUrl,
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    const s = await Zoomtoken.create({
      zoomAccessToken: accessToken,
      zoomRefreshToken: refreshToken,
    });

    res.status(200).json(s).redirect(`${state}`);
  } catch (error) {
    console.log("Error exchanging code for access token:", error);
    res.status(500).json({
      error: "Failed to exchange authorization code for access token",
    });
  }
};

export const createZoomMeeting = async (req, res) => {
  try {
    console.log("CREATING MEETING");
    const { formData, groupId } = req.body;
    const { currentZoomAccessToken, currentZoomRefreshToken } =
      await zoomAuth();
    let meetingData = {};
    if (formData.type == 1) {
      meetingData = {
        topic: formData.title,
        type: 1, // Instant meeting
        start_time: formData.startTime, // Set the desired start time
        duration: formData.duration, // Meeting duration in minutes
        timezone: formData.timezone,
        password: formData.password,
      };
    } else if (formData.type == 2) {
      meetingData = {
        topic: formData.title,
        type: 2, // Scheduled meeting
        start_time: formData.startTime, // Scheduled start time in UTC format
        duration: formData.duration, // Duration of the meeting in minutes
        timezone: formData.timezone, // Timezone of the meeting
        password: formData.password, // Meeting password (optional)
      };
    } else if (formData.type == 8) {
      meetingData = {
        topic: formData.title,
        type: 8, // Recurring meeting
        start_time: formData.startTime, // Start time of the first occurrence
        duration: formData.duration, // Duration of each occurrence in minutes
        timezone: formData.timezone, // Timezone of the meeting
        password: formData.password, // Meeting password (optional)
        recurrence: {
          type: formData.recurrenceType, // Daily recurrence
          repeat_interval: formData.repeatInterval, // Repeat every 1 day
          end_date_time: formData.endTime, // End date and time of the recurring meetings
        },
      };
    }

    const zoomResponseMeetingCreation = await reqZoomToCreateMeeting(
      meetingData,
      currentZoomAccessToken,
      res
    ).then((data) => {
      try {
        const s = zoomMeeting.create({
          group_id: groupId,
          meeting_id: data.id,
        });
        res.status(200).json(s);
      } catch (error) {
        console.log("zoomMeetingerror", error.message);
      }
    });
  } catch (error) {
    console.error("Failed to create meeting:", error);
  }
};

export const fetchMeetingById = async (req, res) => {
  try {
    const { groupId } = req.params;
    // const activeMeetingType = req.query;
    const activeMeetingType = req.query.activeMeetingType;
    console.log("firstQuery", activeMeetingType, "QQQ");
    console.log("firstParam", groupId, "PPP");
    const { currentZoomAccessToken, currentZoomRefreshToken } =
      await zoomAuth();
    const fetchAllMeetingsWithOccurrencesresult =
      await fetchAllMeetingsWithOccurrences(
        currentZoomAccessToken,
        groupId,
        activeMeetingType
      );

    res.status(200).json(fetchAllMeetingsWithOccurrencesresult);
  } catch (error) {
    console.log("error", error);
  }
};

function isAccessTokenExpired(existingAccessToken) {
  // Decode the access token
  const decodedToken = jwt.decode(existingAccessToken);
  // Extract the expiration time from the decoded token
  const expirationTime = decodedToken?.exp;

  // Convert the expiration time to a Date object
  const expirationDate = new Date(expirationTime * 1000); // Multiply by 1000 to convert from seconds to milliseconds

  const time = new Date(expirationDate);

  let hours = time.getUTCHours();
  const minutes = time.getUTCMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${amPm}`;

  const currentTime = Math.floor(Date.now() / 1000); // Get the current time (UNIX timestamp)
  return currentTime > expirationTime; // Compare current time with expiration time
}

async function refreshAccessTokenFTN(refreshAccessToken) {
  const clientId = "QTXyx1poSPmlXR2kx1lag";
  const clientSecret = "KSTeVC4fnx6yj23u6JwdOFS2dYSkkSFt";
  const refreshToken = refreshAccessToken;

  try {
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    const newaccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token;

    const r = await Zoomtoken.deleteMany({});
    console.log("All old Tokens deleted successfully.");

    const s = await Zoomtoken.create({
      zoomAccessToken: newaccessToken,
      zoomRefreshToken: newRefreshToken,
    });
    console.log("newaccessToken & newRefreshToken added successfully.");
    return { newaccessToken, newRefreshToken };
  } catch (error) {
    console.error("Error deleting recordsPP:", error);
  }
}

async function reqZoomToCreateMeeting(meetingData, zoomAccessToken, res) {
  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${zoomAccessToken}`,
        },
      }
    );
    return response.data;
    // if(response)    res.status(200).json(response.data);
  } catch (error) {
    console.log("error", error);
  }
}

async function zoomAuth() {
  try {
    const ZoomTokenResult = await Zoomtoken.find();
    if (ZoomTokenResult.length <= 0) {
      res.status(200).json({ isAvailable: false, ZoomTokenResult });
    } else {
      let currentZoomAccessToken = ZoomTokenResult[0]?.zoomAccessToken;
      let currentZoomRefreshToken = ZoomTokenResult[0]?.zoomRefreshToken;

      const isAccessTokenExpiredValue = isAccessTokenExpired(
        currentZoomAccessToken
      );
      if (isAccessTokenExpiredValue) {
        console.log("Token is expired.");
        const { newaccessToken, newRefreshToken } = await refreshAccessTokenFTN(
          currentZoomRefreshToken
        );
        currentZoomAccessToken = newaccessToken;
        currentZoomRefreshToken = newRefreshToken;
        console.log("New token is generated using refresh token");
      }
      return { currentZoomAccessToken, currentZoomRefreshToken };
    }
  } catch (error) {
    console.log("error", error);
  }
}

// async function generateMeetingOccurrences(meetingId, zoomAccessToken) {
//   try {
//     const response = await axios.get(
//       // `https://api.zoom.us/v2/past_meetings/${meetingId}/instances`,
//       `https://api.zoom.us/v2/meetings/${meetingId}/instances`,
//       {
//         headers: {
//           Authorization: `Bearer ${zoomAccessToken}`,
//         },
//       }
//     );
//   } catch (error) {
//     console.log("Errorrr:", error.response.data);
//   }
// }

async function fetchAllMeetingsWithOccurrences(
  zoomAccessToken,
  groupId,
  activeMeetingType
) {
  const meetingsIdInDB = await zoomMeeting.find({ group_id: groupId });
  let arr = [];

  for (let i = 0; i < meetingsIdInDB.length; i++) {
    const { data } = await getMeeting(
      meetingsIdInDB[i].meeting_id,
      zoomAccessToken,
      activeMeetingType
    );
    const meeting = data;
    if (meeting?.occurrences && meeting?.occurrences.length > 0) {
      for (let j = 0; j < meeting.occurrences.length; j++) {
        arr.push({
          ...meeting,
          duration: meeting.occurrences[j].duration,
          occurrence_id: meeting.occurrences[j].occurrence_id,
          start_time: meeting.occurrences[j].start_time,
          status: meeting.occurrences[j].status,
        });
      }
    } else {
      arr.push(meeting);
    }
  }
  return arr;

  // meetingsIdInDB.map((meetingDataInDB)=>{
  //   if(meetingDataInDB.group_id===groupId){
  //     meetingsDataFromZoom.map((singleMeetingsDataFromZoom)=>{
  //       if(meetingDataInDB.meeting_id==singleMeetingsDataFromZoom.id){
  //         arr.push(singleMeetingsDataFromZoom);
  //       }
  //     })
  //   }

  // });//group ky against meeting show karwani hy .
  // const meetingsWithOccurrences = await Promise.all(
  // meetings.map(async (meeting) => {
  //   if(meeting.id === s){

  //     const occurrences = await getMeetingOccurrences(meeting.id, zoomAccessToken);
  //   }
  //   return { ...meeting, occurrences };
  // })
  // );
}

async function getMeeting(meetingId, zoomAccessToken, activeMeetingType) {
  console.log("LET CHECK activeMeetingType", activeMeetingType);
  // if (activeMeetingType == "upcoming") {
  return axios.get(`https://api.zoom.us/v2/meetings/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${zoomAccessToken}`,
    },
  });
  // } else if (activeMeetingType == "past") {
  // `https://api.zoom.us/v2/past_meetings/${meetingId}/instances`,
  // return axios.get(`https://api.zoom.us/v2/past_meetings/${meetingId}`, {
  //   headers: {
  //     Authorization: `Bearer ${zoomAccessToken}`,
  //   },
  // });
  // }
}
// async function getMeetingREPEAT(meetingId, zoomAccessToken) {

//   try {
//     const s = await axios.get(
//       `https://api.zoom.us/v2/meetings/${meetingId}/occurrences`,
//       {
//         headers: {
//           Authorization: `Bearer ${zoomAccessToken}`,
//         },
//       }
//     );

//   } catch (error) {
//     console.log("error", error);
//   }
// }
// async function getAllMeetings(zoomAccessToken) {
//   try {
//     const response = await axios.get(
//       "https://api.zoom.us/v2/users/me/meetings",
//       {
//         headers: {
//           Authorization: `Bearer ${zoomAccessToken}`,
//         },
//       }
//     );

//     const meetings = response.data.meetings;
//     return meetings;
//   } catch (error) {
//     console.log("Error fetching meetings:", error);
//     return [];
//   }
// }
