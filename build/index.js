"use strict";
// This is the entry point function for Nakama Server
var InitModule = function (
// Context is said to be info about server like env variables (haven't grasped yet)
ctx, 
// Logger manages server logs
logger, 
// NK is responsible for being the middleware to call server-side functions
nk, 
// Initializer is said to register RPCs hook and callbacks (haven't grasped yet)
initializer) {
    initializer.registerMatch("testMatchHandler", {
        matchInit: matchInit1,
        matchJoinAttempt: matchJoinAttempt1,
        matchJoin: matchJoin1,
        matchLoop: matchLoop1,
        matchLeave: matchLeave1,
        matchTerminate: matchTerminate1,
        matchSignal: matchSignal1,
    });
    initializer.registerRpc("createMatchRPC", createMatchRPC);
};
var MessageOpCode;
(function (MessageOpCode) {
    MessageOpCode[MessageOpCode["DATA_FROM_SERVER"] = 1] = "DATA_FROM_SERVER";
    MessageOpCode[MessageOpCode["UPDATE_DISPLAY_NAME"] = 2] = "UPDATE_DISPLAY_NAME";
    MessageOpCode[MessageOpCode["UPDATE_HOST"] = 3] = "UPDATE_HOST";
    MessageOpCode[MessageOpCode["LOBBY_PLAYER_READY_CHANGED"] = 4] = "LOBBY_PLAYER_READY_CHANGED";
    MessageOpCode[MessageOpCode["ONGOING_PLAYER_STARTED_CHANGED"] = 5] = "ONGOING_PLAYER_STARTED_CHANGED";
})(MessageOpCode || (MessageOpCode = {}));
var MatchStatus;
(function (MatchStatus) {
    MatchStatus[MatchStatus["LOBBY"] = 1] = "LOBBY";
    MatchStatus[MatchStatus["ONGOING"] = 2] = "ONGOING";
})(MatchStatus || (MatchStatus = {}));
var getNumberOfPlayers = function (playersList) {
    return Object.keys(playersList).length;
};
var matchInit1 = function (ctx, logger, nk, params) {
    // logger.debug("MATCH CREATED WITH PARAMS: " + JSON.stringify(params));
    var presences = {};
    var currentMatchStatus = MatchStatus.LOBBY;
    return {
        state: { presences: presences, currentMatchStatus: currentMatchStatus },
        tickRate: 10,
        label: "",
    };
};
var matchJoinAttempt1 = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    // logger.debug("%q ATTEMPTS TO JOIN MATCH", ctx.userId);
    // let currentNumberOfPlayersInMatch: number = Object.keys(
    //   state.presences
    // ).length;
    var currentNumberOfPlayersInMatch = getNumberOfPlayers(state.presences);
    return {
        state: state,
        accept: currentNumberOfPlayersInMatch < 3 &&
            state.currentMatchStatus != MatchStatus.ONGOING,
    };
};
var matchJoin1 = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = {
            isHost: false,
            playerData: {
                nakamaData: presence,
                displayName: "",
            },
            isReady: false,
            isStarted: false,
            ongoingMatchData: {},
        };
        logger.debug("%q JOINED MATCH", presence.userId);
    });
    return {
        state: state,
    };
};
var matchLeave1 = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        delete state.presences[presence.userId];
        logger.debug("%q LEFT MATCH", presence.userId);
    });
    return {
        state: state,
    };
};
var matchLoop1 = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    // logger.debug("MATCH LOOP");
    // Process messages from clients
    messages.forEach(function (message) {
        var dataString = arrayBufferToString(message.data);
        var dataJson = JSON.parse(dataString);
        if (message.opCode == MessageOpCode.UPDATE_HOST) {
            state.presences[dataJson.userId].isHost = dataJson.payload.isHost;
        }
        else if (message.opCode == MessageOpCode.UPDATE_DISPLAY_NAME) {
            state.presences[dataJson.userId].playerData.displayName =
                dataJson.payload.displayName;
        }
        else if (message.opCode == MessageOpCode.LOBBY_PLAYER_READY_CHANGED) {
            state.presences[dataJson.userId].isReady = dataJson.payload.isReady;
        }
        // if (message.opCode == MessageOpCode.LOBBY_PLAYER_READY_CHANGED) {
        //   logger.debug(
        //     `RECEIVED MESSAGE FROM: ${jsonMessage.userID}, with MESSAGE: ${jsonMessage.isReady}`
        //   );
        // }
        // dispatcher.broadcastMessage(1, message.data);
    });
    // Broadcast message to every client
    dispatcher.broadcastMessage(MessageOpCode.DATA_FROM_SERVER, JSON.stringify(state));
    if (getNumberOfPlayers(state.presences) == 0) {
        return null;
    }
    return {
        state: state,
    };
};
function arrayBufferToString(buffer) {
    var result = "";
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
}
var matchTerminate1 = function (ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    logger.debug("MATCH TERMINATING");
    return {
        state: state,
    };
};
var matchSignal1 = function (ctx, logger, nk, dispatcher, tick, state, data) {
    logger.debug("Lobby match signal received: " + data);
    return {
        state: state,
        data: "Lobby match signal received: " + data,
    };
};
var createMatchRPC = function (context, logger, nk, payload) {
    logger.info("CREATING A MATCH!!!! : " + payload);
    var matchId = nk.matchCreate("testMatchHandler");
    return JSON.stringify({ matchId: matchId });
};
