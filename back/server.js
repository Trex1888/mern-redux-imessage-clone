import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mongoData from "./mongoData.js";
import Pusher from "pusher";
import config from "./config.js";

const app = express();
const port = process.env.PORT || 9000;

const secretURL = config.SECRET_KEY;
const pusher = new Pusher({
  appId: "1131504",
  key: "831e70f6b3faba550351",
  secret: secretURL,
  cluster: "us2",
  useTLS: true,
});

app.use(cors());
app.use(express.json());

const connect_url = config.MONGODB_URL;
mongoose.connect(connect_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongoose");

  const changeStream = mongoose.connection.collection("conversations").watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("chats", "newChat", {
        change: change,
      });
    } else if (change.operationType === "update") {
      pusher.trigger("messages", "newMessage", {
        change: change,
      });
    } else {
      console.log("Error triggering Pusher...");
    }
  });
});

app.get("/", (req, res) => res.status(200).send("iMessage MERN clone"));

app.post("/new/conversation", (req, res) => {
  const dbData = req.body;

  mongoData.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/new/message", (req, res) => {
  mongoData.updateOne(
    { _id: req.query.id },
    { $push: { conversation: req.body } },
    (err, data) => {
      if (err) {
        console.log("Error saving message...");
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

app.get("/get/conversationList", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      data.sort((b, a) => {
        return a.timestamp - b.timestamp;
      });

      let conversations = [];

      data.map((conversationData) => {
        const conversationInfo = {
          id: conversationData._id,
          name: conversationData.chatName,
          timestamp: conversationData.conversation[0].timestamp,
        };
        conversations.push(conversationInfo);
      });
      res.status(200).send(conversations);
    }
  });
});

app.get("/get/conversation", (req, res) => {
  const id = req.query.id;

  mongoData.find({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/get/lastMessage", (req, res) => {
  const id = req.query.id;

  mongoData.find({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let convData = data[0].conversation;

      convData.sort((b, a) => {
        return a.timestamp - b.timestamp;
      });
      res.status(200).send(convData[0]);
    }
  });
});

app.listen(port, () => console.log(`listening on localhost:${port}`));
