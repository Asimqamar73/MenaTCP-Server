import Event from "../models/event.js";

export const createEvent = async (req, res) => {
  try {
    const { eventName, eventDescription, selectedDate, selectedTime, image } =
      req.body;
    console.log(image, "image");
    const newEvent = await Event.create({
      eventName,
      eventDescription,
      selectedDate,
      // selectedTime,
      image,
      creatorId: req.userId,
      timestamp: Date.now(),
    });

    res.status(200).json(newEvent);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error });
  }
};

export const getEventsByName = async (req, res) => {
  console.log("getEventsByName");
  try {
    const { query } = req.params;
    let eventsResult;

    eventsResult = await Event.find({
      eventName: { $regex: query, $options: "i" },
    });

    res.status(200).json(eventsResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const deleteEvent = async (req, res) => {
  console.log("deleteEvent");
  const { id } = req.params;

  try {
    const existingEvent = await Event.findById(id);
    if (!existingEvent)
      return res.status(400).json({ message: "Event doesn't exists" });
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
