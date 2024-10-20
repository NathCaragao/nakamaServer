type PlayerData = {
  playerInfo: nkruntime.Presence;
  message: String;
  isLobbyReady: boolean;
};

const matchInit1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  params: { [key: string]: string }
): { state: nkruntime.MatchState; tickRate: number; label: string } {
  logger.debug("MATCH CREATED WITH PARAMS: " + JSON.stringify(params));

  const presences: { [userId: string]: PlayerData } = {};

  return {
    state: { presences },
    tickRate: 10,
    label: "",
  };
};

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
  logger.debug("%q ATTEMPTS TO JOIN MATCH", ctx.userId);

  let currentNumberOfPlayersInMatch: number = Object.keys(
    state.presences
  ).length;

  return {
    state,
    accept: currentNumberOfPlayersInMatch <= 3,
  };
};

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
    state.presences[presence.userId] = {
      playerInfo: presence,
      message: "",
      isLobbyReady: false,
    };
    logger.debug("%q JOINED MATCH", presence.userId);
  });

  return {
    state,
  };
};

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
    logger.debug("%q LEFT MATCH", presence.userId);
  });

  return {
    state,
  };
};

const matchLoop1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  messages: nkruntime.MatchMessage[]
): { state: nkruntime.MatchState } | null {
  logger.debug("MATCH LOOP");

  messages.forEach(function (message) {
    const stringFromMessage = arrayBufferToString(message.data);
    const jsonMessage = JSON.parse(stringFromMessage);
    logger.info(`RECEIVED A MESSAGE: ${jsonMessage.testKey}`);
    dispatcher.broadcastMessage(1, message.data);
  });

  return {
    state,
  };
};

function arrayBufferToString(buffer: ArrayBuffer): string {
  let result = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

const matchTerminate1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  graceSeconds: number
): { state: nkruntime.MatchState } | null {
  logger.debug("MATCH TERMINATING");

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
