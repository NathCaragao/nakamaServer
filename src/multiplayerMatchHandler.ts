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
    isJumping: boolean;
    isAttacking: boolean;
    isSkill: boolean;
    velocity: any;
    weaponMode: any;
    position: any;
    health: Number;
    character: String;
  };
};

enum MessageOpCode {
  DATA_FROM_SERVER = 1,
  UPDATE_DISPLAY_NAME,
  UPDATE_HOST,
  LOBBY_PLAYER_READY_CHANGED,
  ONGOING_PLAYER_STARTED_CHANGED,
  ONGOING_PLAYER_DATA_UPDATE,
  ONGOING_PLAYER_FINISHED,
  DECLARED_WINNER,
  ONGOING_PLAYER_LEFT,
  PLAYER_UPDATE_USED_CHARACTER,
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
  const initialLabel = { matchStatus: MatchStatus.LOBBY };
  var firstPlacePlayer: any = null;

  return {
    state: {
      presences,
      currentMatchStatus,
      emptyTicks: 0,
      firstPlacePlayer,
    },
    tickRate: 10,
    label: JSON.stringify(initialLabel),
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
        isJumping: false,
        isAttacking: false,
        isSkill: false,
        velocity: "(0, 0)",
        weaponMode: "Melee",
        position: "(0, 0)",
        health: 0,
        character: "",
      },
    };
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
    dispatcher.broadcastMessage(
      MessageOpCode.ONGOING_PLAYER_LEFT,
      JSON.stringify({ userId: presence.userId })
    );
    delete state.presences[presence.userId];
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
    } else if (message.opCode == MessageOpCode.PLAYER_UPDATE_USED_CHARACTER) {
      state.presences[dataJson.userId].ongoingMatchData.character =
        dataJson.payload.character;
    } else if (message.opCode == MessageOpCode.ONGOING_PLAYER_DATA_UPDATE) {
      if (state?.presences[dataJson.userId]?.ongoingMatchData) {
        state.presences[dataJson.userId].ongoingMatchData.direction =
          dataJson.payload.ongoingMatchData.direction;

        state.presences[dataJson.userId].ongoingMatchData.isJumping =
          dataJson.payload.ongoingMatchData.isJumping;

        state.presences[dataJson.userId].ongoingMatchData.isAttacking =
          dataJson.payload.ongoingMatchData.isAttacking;

        state.presences[dataJson.userId].ongoingMatchData.isSkill =
          dataJson.payload.ongoingMatchData.isSkill;

        state.presences[dataJson.userId].ongoingMatchData.velocity =
          dataJson.payload.ongoingMatchData.velocity.toString();

        state.presences[dataJson.userId].ongoingMatchData.weaponMode =
          dataJson.payload.ongoingMatchData.weaponMode;

        state.presences[dataJson.userId].ongoingMatchData.position =
          dataJson.payload.ongoingMatchData.position.toString();

        state.presences[dataJson.userId].ongoingMatchData.health =
          dataJson.payload.ongoingMatchData.health;
      }
    } else if (message.opCode == MessageOpCode.ONGOING_PLAYER_FINISHED) {
      state.firstPlacePlayer =
        state.firstPlacePlayer == null
          ? state.presences[dataJson.userId]
          : state.firstPlacePlayer;
      dispatcher.broadcastMessage(
        MessageOpCode.DECLARED_WINNER,
        JSON.stringify({ user: state.firstPlacePlayer })
      );
    }
  });

  // Check the current match status
  if (getNumberOfPlayers(state.presences) >= 2) {
    let isEveryPlayerStarted = true;
    Object.keys(state.presences).forEach(function (presenceId) {
      if (state.presences[presenceId].isStarted == false) {
        isEveryPlayerStarted = false;
      }
    });
    if (isEveryPlayerStarted) {
      dispatcher.matchLabelUpdate(
        JSON.stringify({ matchStatus: MatchStatus.ONGOING })
      );
    }
  }

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
