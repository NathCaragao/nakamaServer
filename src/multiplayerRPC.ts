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

let findMatchRPC: nkruntime.RpcFunction = function (
  context: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama
): string {
  const matchFoundLimit = 10;
  const minPlayerInRoom = 0;
  const maxPlayerInRoom = 2;
  const query = "+label.matchStatus:1";

  var matches = nk.matchList(
    matchFoundLimit,
    true,
    null,
    minPlayerInRoom,
    maxPlayerInRoom,
    query
  );

  var matchId = "";
  // If matches exist, sort by match size and return the largest.
  if (matches.length > 0) {
    matches.sort(function (a, b) {
      return a.size >= b.size ? 1 : -1;
    });
    matchId = matches[0].matchId;
  }

  return JSON.stringify({ matchId });
  // // If no matches exist, create a new one using the "lobby" module and return it's ID.
  // var matchId = nk.matchCreate('supermatch', {});
  // return JSON.stringify({ matchId });
};
