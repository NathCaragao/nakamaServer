function rpcCreateMatch(
  context: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  var matchId = nk.matchCreate("testMatchHandler", payload);
  return JSON.stringify({ matchId });
}
