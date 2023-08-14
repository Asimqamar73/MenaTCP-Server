import group from "../models/group.js";
import groupMember from "../models/groupMember.js";
// import message from "../models/message";

export const createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;
    const id = req.userId;
    const existingGroupTitle = await group.findOne(
      { title: groupName },
      { creatorId: id }
    );

    if (existingGroupTitle)
      return res
        .status(400)
        .json({ message: "Group Already Exists with same title" });

    const result = await group.create({
      creatorId: id,
      title:groupName,
      thumbnail: req.uploadedFile,
    });

    res.status(200).json(result);
  } catch (err) {
    console.log("ERROR : ", err.message);
    res.status(500).json({ message: err });
  }
};

export const getAllGroupsById = async (req, res) => {
  try {
    const { adminId } = req.query;
    const groups = await group.find({ creatorId: adminId });
    res.status(200).json(groups);
  } catch (err) {
    console.log("ERROR :", err);
    res.status(500).json({ message: err });
  }
};
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await group.findById(id);
    console.log("first_result", result);
    res.status(200).json(result);
  } catch (err) {
    console.log("ERROR :", err);
    res.status(500).json({ message: err });
  }
};
export const deleteGroupById = async (req, res) => {
  try {
    const { id } = req.query;

    const response = await group.findByIdAndDelete(id);
    res.status(200).json(response);
  } catch (err) {
    console.log("ERROR :", err);
    res.status(500).json({ message: err });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await group.find();
    res.status(200).json(groups);
  } catch (err) {
    console.log("ERROR :", err);
    res.status(500).json({ message: err });
  }
};

export const getGroupsByName = async (req, res) => {
  try {
    const { query } = req.params;
    console.log(query, "queryy");
    const userId = req.userId;
    console.log("SearchGroup", userId);

    let groupsResult = [];

    const groupMembers = await groupMember.find({
      groupMemberId: userId,
      status: "accepted",
    });
    console.log("groupMembers",groupMembers, "GroupMember");
    const groupIds = groupMembers.map((info) => info.groupId);
    console.log("first", groupIds);

    for (let i = 0; i < groupIds.length; i++) {
      const gr = await group.findById(groupIds[i]);
      console.log("grrrr",gr);
      if (gr.title.toLowerCase().includes(query.toLowerCase())) {
        groupsResult.push(gr);
      }
    }

    console.log(groupsResult, "result");
    res.status(200).json(groupsResult);
  } catch (error) {
    console.log(error, "monday");
    res.status(500).json({ message: error });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await group.findByIdAndDelete(id);
    res.status(200).json({ del });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
