type PlayerMultiplayerData = {
  isHost: boolean;

  playerData: {
    nakamaData: nkruntime.Presence;
    displayName: String;
  };

  isReady: boolean;

  isStarted: boolean;
  ongoingMatchData: {
    direction: any;
  };
};

enum MessageOpCode {
  DATA_FROM_SERVER = 1,
  UPDATE_DISPLAY_NAME,
  UPDATE_HOST,
  LOBBY_PLAYER_READY_CHANGED,
  ONGOING_PLAYER_STARTED_CHANGED,
  ONGOING_PLAYER_DATA_UPDATE,
}

enum MatchStatus {
  LOBBY = 1,
  ONGOING = 2,
}

const getNumberOfPlayers = function (playersList: Object) {
  return Object.keys(playersList).length;
};

const matchInit1 = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  params: { [key: string]: string }
): { state: nkruntime.MatchState; tickRate: number; label: string } {
  const presences: { [userId: string]: PlayerMultiplayerData } = {};
  var currentMatchStatus: MatchStatus = MatchStatus.LOBBY;

  return {
    state: { presences, currentMatchStatus, emptyTicks: 0 },
    tickRate: 20,
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
  let currentNumberOfPlayersInMatch = getNumberOfPlayers(state.presences);

  return {
    state,
    accept:
      currentNumberOfPlayersInMatch < 3 &&
      state.currentMatchStatus != MatchStatus.ONGOING,
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
      // This is only true for reasons
      isHost: true,

      playerData: {
        nakamaData: presence,
        displayName: "",
      },

      isReady: false,

      isStarted: false,
      ongoingMatchData: {
        direction: 0,
      },
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
  // Check if host is still in match
  // MIGHT BE BETTER MOVED TO MATCH_LEAVE() AND ADD A BROADCAST WHEN THE HOST LEAVES
  // SO THAT CLIENT CAN HANDLE IT AND TERMINATE THE MATCH THEN MOVE TO NO_MATCH_GUI
  if (getNumberOfPlayers(state.presences) >= 1) {
    var isHostPresent = false;
    Object.keys(state.presences).forEach(function (presenceId) {
      if (state.presences[presenceId].isHost == true) {
        isHostPresent = true;
      }
    });
    if (isHostPresent == false) return null;
  }

  // Process messages from clients
  messages.forEach(function (message) {
    const dataString = arrayBufferToString(message.data);
    const dataJson = JSON.parse(dataString);

    if (message.opCode == MessageOpCode.UPDATE_HOST) {
      state.presences[dataJson.userId].isHost = dataJson.payload.isHost;
    } else if (message.opCode == MessageOpCode.UPDATE_DISPLAY_NAME) {
      state.presences[dataJson.userId].playerData.displayName =
        dataJson.payload.displayName;
    } else if (message.opCode == MessageOpCode.LOBBY_PLAYER_READY_CHANGED) {
      state.presences[dataJson.userId].isReady = dataJson.payload.isReady;
    } else if (message.opCode == MessageOpCode.ONGOING_PLAYER_STARTED_CHANGED) {
      state.presences[dataJson.userId].isStarted = dataJson.payload.isStarted;
    } else if (message.opCode == MessageOpCode.ONGOING_PLAYER_DATA_UPDATE) {
      state.presences[dataJson.userId].ongoingMatchData.direction =
        dataJson.payload.ongoingMatchData.direction;
    }
  });

  // Broadcast message to every client
  dispatcher.broadcastMessage(
    MessageOpCode.DATA_FROM_SERVER,
    JSON.stringify(state)
  );

  if (getNumberOfPlayers(state.presences) == 0) {
    state.emptyTicks++;
    if (state.emptyTicks == 150) {
      return null;
    }
  } else {
    state.emptyTicks = 0;
  }

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
