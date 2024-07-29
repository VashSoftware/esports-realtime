import { Server } from "socket.io";
import { handleMapPoolUpdate } from "./events/mapPoolUpdate";
import { handleMatchesUpdate } from "./events/matchesUpdate";
import { handleMatchMapsUpdate } from "./events/matchMapsUpdate";
import { handleMatchParticipantPlayersUpdate } from "./events/matchParticipantPlayersUpdate";
import { handleNotificationsUpdate } from "./events/notificationsUpdate";
import { handleScoresUpdate } from "./events/scoresUpdate";
import { handleMatchQueueUpdate } from "./events/matchQueueUpdate";
import { handleQuickQueueUpdate } from "./events/quickQueueUpdate";
import { createClient } from "@supabase/supabase-js";
import { handleMatchParticipantsUpdate } from "./events/matchParticipantsUpdate";
import { readFileSync } from "fs";
import { createServer } from "https";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const httpsServer = createServer({
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem"),
});

const io = new Server(httpsServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected!");

  socket.on("join-user", (userId: string) => {
    console.log(`User ${userId} joined!`);

    socket.join(`user-${userId}`);
  });

  socket.on("join-match", (matchId: string) => {
    console.log(`Match ${matchId} joined!`);

    socket.join(`match-${matchId}`);
  });

  socket.on("join-pool", (poolId: string) => {
    console.log(`Pool ${poolId} joined!`);

    socket.join(`pool-${poolId}`);
  });

  socket.on("map-pool-update", (data) => {
    handleMapPoolUpdate(data, io);
  });

  socket.on("matches-update", (data) => {
    handleMatchesUpdate(data, io);
  });

  socket.on("match-maps-update", (data) => {
    handleMatchMapsUpdate(data, io);
  });

  socket.on("match-participants-update", (data) => {
    handleMatchParticipantsUpdate(data, io);
  });

  socket.on("match-participant-players-update", (data) => {
    handleMatchParticipantPlayersUpdate(data, io);
  });

  socket.on("notifications-update", (data) => {
    handleNotificationsUpdate(data, io);
  });

  socket.on("scores-update", (data) => {
    handleScoresUpdate(data, io, supabase);
  });

  socket.on("match-queue-update", (data) => {
    handleMatchQueueUpdate(data, io);
  });

  socket.on("quick-queue-update", (data) => {
    handleQuickQueueUpdate(data, io);
  });
});

io.listen(3001);
