import groupMember from "../models/groupMember.js";
import Group from "../models/group.js";
import User from "../models/user.js";

export const Invite = async (req, res) => {
  const { groupId, groupMemberId } = req.body;
  // console.log("groupId, groupMemberId", groupId, groupMemberId);
  try {
    const existingMember = await groupMember.findOne({
      groupId,
      groupMemberId,
    });
    if (existingMember)
      return res.status(400).json({ message: "User Already Exists" });
    const respp = await groupMember.create({
      groupId,
      groupMemberId,
    });

    res.status(200).json(respp);
  } catch (e) {
    console.log("ERR :", e.message);
    res.status(500).json(e);
  }
};

export const AcceptInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await groupMember.findOneAndUpdate(
      { groupId: id, groupMemberId: req.userId },
      { status: "accepted" },
      { new: true }
    );
    let groups = [];
    for (let i = 0; i < response.length; i++) {
      let group = await Group.findById(response[i].groupId);
      groups.push(group);
    }

    res.status(200).json(response);
  } catch (e) {
    console.log("ERR :", e.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const pendingInvites = async (req, res) => {
  try {
    const response = await groupMember.find({
      groupMemberId: req.userId,
      status: "pending",
    });
    let groups = [];
    for (let i = 0; i < response.length; i++) {
      let group = await Group.findById(response[i].groupId);
      groups.push(group);
    }

    res.status(200).json(groups);
  } catch (e) {
    console.log("ERR :", e.message);
  }
};

export const joinedGroups = async (req, res) => {
  try {
    const response = await groupMember.find({
      groupMemberId: req.userId,
      status: "accepted",
    });

    let groups = [];
    for (let i = 0; i < response.length; i++) {
      let group = await Group.findById(response[i].groupId);
      groups.push(group);
    }
    res.status(200).json(groups);
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};

export const getGroupMemberInfo = async (req, res) => {
  try {
    const groupMemberId = req.userId;

    const response = await groupMember.findOne({
      groupMemberId,

      groupId: req.params.id,
    });

    res.status(200).json(response);
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};
export const getAllGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const groupMembers = await groupMember.find({
      groupId: id,
      status: "accepted",
    });
    let ActiveUsers = [];
    for (let i = 0; i < groupMembers.length; i++) {
      let ActiveUser = await User.findById(groupMembers[i].groupMemberId);
      ActiveUsers.push(ActiveUser);
    }
    res.status(200).json(ActiveUsers);
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};
