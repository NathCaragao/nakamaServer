// These comments will keep track of "state" variable and its properties AFTER functions' execution

// NOTE: IT IS A GOOD IDEA TO RENAME THESE ARGS FOR BETTER CLARITY - like presences and state.presences

// state: {
//    presences: { <userId>:String : <PresenceInfos>:nakamaPresence } * but empty
// }
const matchInit1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  params: { [key: string]: string }
): { state: nkruntime.MatchState; tickRate: number; label: string } {
  logger.debug("Lobby match created   : " + JSON.stringify(params));

  const presences: { [userId: string]: nkruntime.Presence } = {};

  return {
    state: { presences },
    tickRate: 1,
    label: "",
  };
};

// state: {
//    presences: { <userId>:String : <PresenceInfos>:nakamaPresence } * but empty
// }
const matchJoinAttempt1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  presence: nkruntime.Presence,
  metadata: { [key: string]: any }
): {
  state: nkruntime.MatchState;
  accept: boolean;
  rejectMessage?: string | undefined;
} | null {
  logger.debug("%q attempted to join Lobby match", ctx.userId);

  return {
    state,
    accept: true,
  };
};

// state: {
//    presences: { <userId>:String : <PresenceInfos>:nakamaPresence } * but now populated
//             : { "thisIsAUserId" : <nkruntime.Presence> object } * example
// }
const matchJoin1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  presences: nkruntime.Presence[]
): { state: nkruntime.MatchState } | null {
  presences.forEach(function (presence) {
    state.presences[presence.userId] = presence;
    logger.debug("%q joined Lobby match", presence.userId);
  });

  return {
    state,
  };
};

// state: {
//    presences: { <userId>:String : <PresenceInfos>:nakamaPresence } * but will delete all state.presences from presences arg
// }
const matchLeave1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  presences: nkruntime.Presence[]
): { state: nkruntime.MatchState } | null {
  presences.forEach(function (presence) {
    delete state.presences[presence.userId];
    logger.debug("%q left Lobby match", presence.userId);
  });

  return {
    state,
  };
};

// This is also where messages received are processed.
// state: {
//    presences: { <userId>:String : <PresenceInfos>:nakamaPresence } * NOT MODIFIED
// }
const matchLoop1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  messages: nkruntime.MatchMessage[]
): { state: nkruntime.MatchState } | null {
  logger.debug("Lobby match loop executed");

  Object.keys(state.presences).forEach(function (key) {
    const presence = state.presences[key];
    logger.info("Presence %v name $v", presence.userId, presence.username);
  });

  messages.forEach(function (message) {
    logger.info("Received %v from %v", message.data, message.sender.userId);
    dispatcher.broadcastMessage(1, message.data, [message.sender], null);
  });

  // test broadcasting of message every tick
  dispatcher.broadcastMessage(1, "SUCK A NEEGA DIGG", null, null, true);
  return {
    state,
  };
};

// state: {
//    presences: { <userId>:String : <PresenceInfos>:nakamaPresence } * the room is most likely going to be cleared.
// }
const matchTerminate1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  graceSeconds: number
): { state: nkruntime.MatchState } | null {
  logger.debug("Lobby match terminated");

  const message = `Server shutting down in ${graceSeconds} seconds.`;
  dispatcher.broadcastMessage(2, message, null, null);

  return {
    state,
  };
};

const matchSignal1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  data: string
): { state: nkruntime.MatchState; data?: string } | null {
  logger.debug("Lobby match signal received: " + data);

  return {
    state,
    data: "Lobby match signal received: " + data,
  };
};
