let createMatchRPC: nkruntime.RpcFunction = function (
  context: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  logger.info("CREATING A MATCH!!!! : " + payload);
  var matchId = nk.matchCreate(
    "testMatchHandler" /*, {testParam: "testValue"} -- This should be sent by the client code*/
  );
  return JSON.stringify({ matchId });
};
