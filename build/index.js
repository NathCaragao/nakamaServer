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
var matchInit1 = function (ctx, logger, nk, params) {
    logger.debug("MATCH CREATED WITH PARAMS: " + JSON.stringify(params));
    var presences = {};
    return {
        state: { presences: presences },
        tickRate: 10,
        label: "",
    };
};
var matchJoinAttempt1 = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    logger.debug("%q ATTEMPTS TO JOIN MATCH", ctx.userId);
    var currentNumberOfPlayersInMatch = Object.keys(state.presences).length;
    return {
        state: state,
        accept: currentNumberOfPlayersInMatch <= 3,
    };
};
var matchJoin1 = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = {
            playerInfo: presence,
            message: "",
            isLobbyReady: false,
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
    logger.debug("MATCH LOOP");
    // Object.keys(state.presences).forEach(function (key) {
    //   const presence = state.presences[key];
    //   logger.info("Presence %v name $v", presence.userId, presence.username);
    // });
    messages.forEach(function (message) {
        logger.info("Received ".concat(message.data, " from ").concat(message.sender.userId));
        dispatcher.broadcastMessage(1, message.data);
    });
    return {
        state: state,
    };
};
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
