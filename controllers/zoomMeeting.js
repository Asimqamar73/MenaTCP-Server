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

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/users?${qs.stringify({ status, next_page_token })}`,
      headerConfig
    );

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
// export const getToken = async (req, res) => {
//   const { code, state } = req.query;
//   const authorizationCode = code;
//   const redirectUrl = "http://localhost:8080/zoom/exchange-token";
//   const clientId = "5lftAfaRmSqQR7qUCDdeQ";
//   const clientSecret = "4b6G5it7j27D93YNSE7H4zkbgCDiAXHh";

//   try {
//     const response = await axios.post("https://zoom.us/oauth/token", null, {
//       params: {
//         grant_type: "authorization_code",
//         code: authorizationCode,
//         redirect_uri: redirectUrl,
//       },
//       auth: {
//         username: clientId,
//         password: clientSecret,
//       },
//     });

//     const accessToken = response.data.access_token;
//     const refreshToken = response.data.refresh_token;

//     const s = await Zoomtoken.create({
//       zoomAccessToken: accessToken,
//       zoomRefreshToken: refreshToken,
//     });

//     res.status(200).json(s).redirect(`${state}`);
//   } catch (error) {
//     console.log("Error exchanging code for access token:", error);
//     res.status(500).json({
//       error: "Failed to exchange authorization code for access token",
//     });
//   }
// };
export const createZoomMeeting = async (req, res) => {
  try {
    const { formData, groupId } = req.body;
    const { headerConfig } = req;

    // const { userId } = params;

    let meetingData = {};
    if (formData.type == 1) {
      meetingData = {
        topic: formData.title,
        type: 1, // Instant meeting
        start_time: formData.startTime, // Set the desired start time
        duration: formData.duration, // Meeting duration in minutes
        timezone: formData.timezone,
        password: formData.password,
        settings: {
          auto_recording: "local",
        },
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

    const request = await axios.post(
      `${ZOOM_API_BASE_URL}/users/me/meetings`,
      meetingData,
      headerConfig
    );
    if (request) {
      // console.log("MEETINGWFirst", request.data.res);
      try {
        const s = zoomMeeting.create({
          group_id: groupId,
          meeting_id: request.data.id,
        });
        if (s) console.log("response from DB", s);
        res.status(200).json(s);
      } catch (error) {
        console.log("Storing Meeting Id ", error.message);
      }
    }
    // res.status(200).json(request.data);
  } catch (error) {
    console.error("Failed to create meeting:", error);
  }
};

export const fetchMeetingById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { headerConfig } = req;

    const activeMeetingType = req.query;

    const fetchAllMeetingsWithOccurrencesresult =
      await fetchAllMeetingsWithOccurrences(
        headerConfig,
        groupId,
        activeMeetingType
      );

    res.status(200).json(fetchAllMeetingsWithOccurrencesresult);
  } catch (error) {
    console.log("error", error);
  }
};

async function fetchAllMeetingsWithOccurrences(
  headerConfig,
  groupId,
  activeMeetingType,
  recorded = false
) {
  const meetingsIdInDB = await zoomMeeting.find({ group_id: groupId });
  // console.log("meetingsIdInDB-meetingsIdInDB", meetingsIdInDB);
  let arr = [];
  console.log("meetingsIdInDB", meetingsIdInDB);
  for (let i = 0; i < meetingsIdInDB.length; i++) {
    // const { data } =
    await getMeeting(
      meetingsIdInDB[i].meeting_id,
      headerConfig,
      activeMeetingType,
      recorded
    ).then((dataR) => {
      console.log("dataaaaR", `: ${i} : `, dataR);
      if (dataR !== "3001") {
        const meeting = dataR.data;
        console.log("data-meeting", meeting);
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
      } else console.log("eRRRRRRRRR");
    });
    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
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

async function getMeeting(
  meetingId,
  headerConfig,
  activeMeetingType,
  recorded = false
) {
  // if (activeMeetingType == "upcoming") {
  let result;
  if (activeMeetingType.activeMeetingType === "recorded") {
    console.log("Recorded");
    try {
      const data = await axios.get(
        `${ZOOM_API_BASE_URL}/meetings/${meetingId}/recordings`,
        headerConfig
      );
      console.log("Recorded data: ", data);
    } catch (error) {
      console.log(error);
    }
    // result = await axios
    //   .get(
    //     // `${ZOOM_API_BASE_URL}/users/me/meetings/${meetingId}`,
    //     `${ZOOM_API_BASE_URL}/meetings/${meetingId}/recordings`,
    //     headerConfig
    //   )
    //   .catch(function (error) {
    //     console.log("errorrrrr",error?.response)
    //     if (error.response?.data.code == "3301") {
    //       return error.response?.data.code;
    //     }
    //     console.log("JOJOJOJOJOJO");
    //   });
  } else {
    console.log("others");

    result = await axios
      .get(
        // `${ZOOM_API_BASE_URL}/users/me/meetings/${meetingId}`,
        `${ZOOM_API_BASE_URL}/meetings/${meetingId}`,
        headerConfig
      )
      .catch(function (error) {
        if (error.response?.data.code == "3001") {
          return error.response?.data.code;
        }
        console.log("JOJOJOJOJOJO");
      });
  }

  // console.log("resultApple", result.data);
  return result;

  // } else if (activeMeetingType == "past") {
  // `https://api.zoom.us/v2/past_meetings/${meetingId}/instances`,
  // return axios.get(`https://api.zoom.us/v2/past_meetings/${meetingId}`, {
  //   headers: {
  //     Authorization: `Bearer ${zoomAccessToken}`,
  //   },
  // });
  // }
}

// export const fetchRecordedMeetingById = async (req, res) => {
//   try {
//     console.log("recorded-meeting");
//     const { groupId } = req.params;
//     const { headerConfig } = req;
//     const recorded = true;

//     const activeMeetingType = req.query;

//     const fetchAllMeetingsWithOccurRencesresult =
//       await fetchAllMeetingsWithOccurrences(
//         headerConfig,
//         groupId,
//         activeMeetingType,
//         recorded
//       );

//     res.status(200).json(fetchAllMeetingsWithOccurRencesresult);
//   } catch (error) {
//     console.log("error", error);
//   }
// };
