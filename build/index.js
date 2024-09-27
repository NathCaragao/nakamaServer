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
    logger.info("Hello World!");
};
var matchInit = function (ctx, logger, nk, params) {
    return {
        state: { presences: {}, emptyTicks: 0 },
        tickRate: 1, // 1 tick per second = 1 MatchLoop func invocations per second
        label: "",
    };
};
var matchJoin = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (p) {
        state.presences[p.sessionId] = p;
    });
    return {
        state: state,
    };
};
var matchLeave = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (p) {
        delete state.presences[p.sessionId];
    });
    return {
        state: state,
    };
};
var matchLoop = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    // If we have no presences in the match according to the match state, increment the empty ticks count
    if (state.presences.length === 0) {
        state.emptyTicks++;
    }
    // If the match has been empty for more than 100 ticks, end the match by returning null
    if (state.emptyTicks > 100) {
        return null;
    }
    return {
        state: state,
    };
};
