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
    initializer.registerRpc("testRPC", testRPC);
    logger.info("Hello World!");
};
// RPCs are needed to be registered in main.ts InitModule
// then compiled again using npx tsc
// let testRPC: nkruntime.RpcFunction = function (
//     // RPCs need the server context
//     ctx: nkruntime.Context,
//     // RPCs need to use the same server logger
//     logger: nkruntime.Logger,
//     // RPCs need the same NK since it will receive this RPC's request for it
//     nk: nkruntime.Nakama,
//     // Payload is the in String format, but is typically made from JSON
//     payload: string
// ) {
//     logger.info("testRPC called");
//     return JSON.stringify({success: true});
// }
function testRPC(
// RPCs need the server context
ctx, 
// RPCs need to use the same server logger
logger, 
// RPCs need the same NK since it will receive this RPC's request for it
nk, 
// Payload is the in String format, but is typically made from JSON
payload) {
    logger.info("testRPC called");
    return JSON.stringify({ success: true });
}
