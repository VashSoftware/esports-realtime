import type { SupabaseClient } from "@supabase/supabase-js";
import type { Server } from "socket.io";

export async function handleScoresUpdate(
  payload: any,
  io: Server,
  supabase: SupabaseClient
) {
  // Your code here
  console.log("Scores updated.");

  const score = await supabase
    .from("scores")
    .select("*")
    .eq("id", payload.new.id)
    .single();

  io.to(`match-${score.data.match_id}`).emit("scores-update", payload);
}
