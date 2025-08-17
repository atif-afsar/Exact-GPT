const { Server } = require("socket.io");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const aiService = require("../service/ai.service");
const messageModel = require("../models/message.model");

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

      await messageModel.create({
        user: socket.user._id,
        chat: messagePayload.chat,
        content: messagePayload.content,
        role: "user",
      })

      const chatHistory = await messageModel.find({chat: messagePayload.chat});

      const response = await aiService.generateResponse(chatHistory.map(item =>{
        return {
          role: item.role,
          parts: [{text: item.content}]
        }
      }))

      await messageModel.create({
        user: socket.user._id,
        chat: messagePayload.chat,
        content: response,
        role: "model",
      }) 
      
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
