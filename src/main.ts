let InitModule: nkruntime.InitModule = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
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
  initializer.registerRpc("createMatchRPC", createMatchRPC);
  initializer.registerRpc("findMatchRPC", findMatchRPC);
};
