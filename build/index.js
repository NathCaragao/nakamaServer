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
    logger.info("Hello World!");
};
var matchInit1 = function (ctx, logger, nk, params) {
    logger.debug('Lobby match created   : ' + JSON.stringify(params));
    var presences = {};
    return {
        state: { presences: presences },
        tickRate: 1,
        label: ''
    };
};
var matchJoinAttempt1 = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    logger.debug('%q attempted to join Lobby match', ctx.userId);
    return {
        state: state,
        accept: true
    };
};
var matchJoin1 = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q joined Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var matchLeave1 = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        delete (state.presences[presence.userId]);
        logger.debug('%q left Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var matchLoop1 = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    logger.debug('Lobby match loop executed');
    Object.keys(state.presences).forEach(function (key) {
        var presence = state.presences[key];
        logger.info('Presence %v name $v', presence.userId, presence.username);
    });
    messages.forEach(function (message) {
        logger.info('Received %v from %v', message.data, message.sender.userId);
        dispatcher.broadcastMessage(1, message.data, [message.sender], null);
    });
    return {
        state: state
    };
};
var matchTerminate1 = function (ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    logger.debug('Lobby match terminated');
    var message = "Server shutting down in ".concat(graceSeconds, " seconds.");
    dispatcher.broadcastMessage(2, message, null, null);
    return {
        state: state
    };
};
var matchSignal1 = function (ctx, logger, nk, dispatcher, tick, state, data) {
    logger.debug('Lobby match signal received: ' + data);
    return {
        state: state,
        data: "Lobby match signal received: " + data
    };
};
var createMatchRPC = function (context, logger, nk, payload) {
    logger.info("CREATING A MATCH!!!! : " + payload);
    var matchId = nk.matchCreate("testMatchHandler");
    return JSON.stringify({ matchId: matchId });
};
