// This is the entry point function for Nakama Server
let InitModule: nkruntime.InitModule = function (
  // Context is said to be info about server like env variables (haven't grasped yet)
  ctx: nkruntime.Context,
  // Logger manages server logs
  logger: nkruntime.Logger,
  // NK is responsible for being the middleware to call server-side functions
  nk: nkruntime.Nakama,
  // Initializer is said to register RPCs hook and callbacks (haven't grasped yet)
  initializer: nkruntime.Initializer
) {
  initializer.registerMatch("testMatchHandler", {
    matchInit: matchInit1,
    matchJoinAttempt: matchJoinAttempt1,
    matchJoin: matchJoin1,
    matchLoop: matchLoop1,
    matchLeave: matchLeave1,
    matchTerminate: matchTerminate1,
    matchSignal: matchSignal1,
  });

  registerRPCs(initializer);

  logger.info("Hello World!");
};

const registerRPCs = function (initializer: nkruntime.Initializer) {
  initializer.registerRpc("createMatchRPC", createMatchRPC);
};
