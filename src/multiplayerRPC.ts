let createMatchRPC: nkruntime.RpcFunction = function (
  context: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  logger.debug(payload);
  var matchId = nk.matchCreate("testMatchHandler");
  return JSON.stringify({ matchId });
};
