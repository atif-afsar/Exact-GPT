const { Server } = require("socket.io");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const aiService = require("../service/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../service/vector.service");
const { text } = require("express");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decodedToken = jwt.verify(cookies.token, process.env.JWT_SECRET);
      socket.user = await userModel.findById(decodedToken.id);
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      console.log(messagePayload);

      // const message = await messageModel.create({
      //   user: socket.user._id,
      //   chat: messagePayload.chat,
      //   content: messagePayload.content,
      //   role: "user",
      // });

      // const vectors = await aiService.generateVector(messagePayload.content);

      const [message, vectors] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: messagePayload.content,
          role: "user",
        }),
        aiService.generateVector(messagePayload.content),
      ]);

       await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        })

      // const memory = await queryMemory({
      //   vectors: vectors,
      //   limit: 3,
      //   metadata: {},
      // });

      // const chatHistory = (
      //   await messageModel
      //     .find({ chat: messagePayload.chat })
      //     .sort({ createdAt: -1 })
      //     .limit(20)
      //     .lean()
      // ).reverse();

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          vectors: vectors,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }),
        messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .then((messages) => messages.reverse()),
      ]);

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `these are some previous messages from the chat, use them to generate a response
              ${memory.map((item) => item.metadata.text).join("\n")}`,
            },
          ],
        },
      ];

      console.log(ltm[0]);
      console.log(stm);

      const messages = [...ltm, ...stm];
      const response = await aiService.generateResponse(messages);
      // const responseMessage = await messageModel.create({
      //   user: socket.user._id,
      //   chat: messagePayload.chat,
      //   content: response,
      //   role: "model",
      // });

      // const responseVectors = await aiService.generateVector(response);

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });

      const [responseMessage, responseVectors] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: response,
          role: "model",
        }),
        aiService.generateVector(response),
      ]);

      await createMemory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}

module.exports = initSocketServer;
