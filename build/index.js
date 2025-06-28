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
    initializer.registerRpc("findMatchRPC", findMatchRPC);
};
var MessageOpCode;
(function (MessageOpCode) {
    MessageOpCode[MessageOpCode["DATA_FROM_SERVER"] = 1] = "DATA_FROM_SERVER";
    MessageOpCode[MessageOpCode["UPDATE_DISPLAY_NAME"] = 2] = "UPDATE_DISPLAY_NAME";
    MessageOpCode[MessageOpCode["UPDATE_HOST"] = 3] = "UPDATE_HOST";
    MessageOpCode[MessageOpCode["LOBBY_PLAYER_READY_CHANGED"] = 4] = "LOBBY_PLAYER_READY_CHANGED";
    MessageOpCode[MessageOpCode["ONGOING_PLAYER_STARTED_CHANGED"] = 5] = "ONGOING_PLAYER_STARTED_CHANGED";
    MessageOpCode[MessageOpCode["ONGOING_PLAYER_DATA_UPDATE"] = 6] = "ONGOING_PLAYER_DATA_UPDATE";
    MessageOpCode[MessageOpCode["ONGOING_PLAYER_FINISHED"] = 7] = "ONGOING_PLAYER_FINISHED";
    MessageOpCode[MessageOpCode["DECLARED_WINNER"] = 8] = "DECLARED_WINNER";
    MessageOpCode[MessageOpCode["ONGOING_PLAYER_LEFT"] = 9] = "ONGOING_PLAYER_LEFT";
    MessageOpCode[MessageOpCode["PLAYER_UPDATE_USED_CHARACTER"] = 10] = "PLAYER_UPDATE_USED_CHARACTER";
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
    var presences = {};
    var currentMatchStatus = MatchStatus.LOBBY;
    var initialLabel = { matchStatus: MatchStatus.LOBBY };
    var firstPlacePlayer = null;
    return {
        state: {
            presences: presences,
            currentMatchStatus: currentMatchStatus,
            emptyTicks: 0,
            firstPlacePlayer: firstPlacePlayer,
        },
        tickRate: 10,
        label: JSON.stringify(initialLabel),
    };
};
var matchJoinAttempt1 = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
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
        state: state,
    };
};
var matchLeave1 = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        dispatcher.broadcastMessage(MessageOpCode.ONGOING_PLAYER_LEFT, JSON.stringify({ userId: presence.userId }));
        delete state.presences[presence.userId];
    });
    return {
        state: state,
    };
};
var matchLoop1 = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    // Check if host is still in match
    // MIGHT BE BETTER MOVED TO MATCH_LEAVE() AND ADD A BROADCAST WHEN THE HOST LEAVES
    // SO THAT CLIENT CAN HANDLE IT AND TERMINATE THE MATCH THEN MOVE TO NO_MATCH_GUI
    // Process messages from clients
    messages.forEach(function (message) {
        var _a;
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
        else if (message.opCode == MessageOpCode.ONGOING_PLAYER_STARTED_CHANGED) {
            state.presences[dataJson.userId].isStarted = dataJson.payload.isStarted;
        }
        else if (message.opCode == MessageOpCode.PLAYER_UPDATE_USED_CHARACTER) {
            state.presences[dataJson.userId].ongoingMatchData.character =
                dataJson.payload.character;
        }
        else if (message.opCode == MessageOpCode.ONGOING_PLAYER_DATA_UPDATE) {
            if ((_a = state === null || state === void 0 ? void 0 : state.presences[dataJson.userId]) === null || _a === void 0 ? void 0 : _a.ongoingMatchData) {
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
        }
        else if (message.opCode == MessageOpCode.ONGOING_PLAYER_FINISHED) {
            state.firstPlacePlayer =
                state.firstPlacePlayer == null
                    ? state.presences[dataJson.userId]
                    : state.firstPlacePlayer;
            dispatcher.broadcastMessage(MessageOpCode.DECLARED_WINNER, JSON.stringify({ user: state.firstPlacePlayer }));
        }
    });
    // Check the current match status
    if (getNumberOfPlayers(state.presences) >= 2) {
        var isEveryPlayerStarted_1 = true;
        Object.keys(state.presences).forEach(function (presenceId) {
            if (state.presences[presenceId].isStarted == false) {
                isEveryPlayerStarted_1 = false;
            }
        });
        if (isEveryPlayerStarted_1) {
            dispatcher.matchLabelUpdate(JSON.stringify({ matchStatus: MatchStatus.ONGOING }));
        }
    }
    // Broadcast message to every client
    dispatcher.broadcastMessage(MessageOpCode.DATA_FROM_SERVER, JSON.stringify(state));
    if (getNumberOfPlayers(state.presences) == 0) {
        state.emptyTicks++;
        if (state.emptyTicks == 150) {
            return null;
        }
    }
    else {
        state.emptyTicks = 0;
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
    var matchId = nk.matchCreate("testMatchHandler" /*, {testParam: "testValue"} -- This should be sent by the client code*/);
    return JSON.stringify({ matchId: matchId });
};
var findMatchRPC = function (context, logger, nk) {
    var matchFoundLimit = 10;
    var minPlayerInRoom = 0;
    var maxPlayerInRoom = 2;
    var query = "+label.matchStatus:1";
    var matches = nk.matchList(matchFoundLimit, true, null, minPlayerInRoom, maxPlayerInRoom, query);
    var matchId = "";
    // If matches exist, sort by match size and return the largest.
    if (matches.length > 0) {
        matches.sort(function (a, b) {
            return a.size >= b.size ? 1 : -1;
        });
        matchId = matches[0].matchId;
    }
    return JSON.stringify({ matchId: matchId });
    // // If no matches exist, create a new one using the "lobby" module and return it's ID.
    // var matchId = nk.matchCreate('supermatch', {});
    // return JSON.stringify({ matchId });
};
