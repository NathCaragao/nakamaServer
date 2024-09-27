let createMatchRPC: nkruntime.RpcFunction = function (
  context: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  logger.info("CREATING A MATCH!!!! : " + payload);
  var matchId = nk.matchCreate("testMatchHandler");
  return JSON.stringify({ matchId });
};
