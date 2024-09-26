// RPCs are needed to be registered in main.ts InitModule
// then compiled again using npx tsc

let testRPC: nkruntime.RpcFunction = function (
    // RPCs need the server context
    ctx: nkruntime.Context,
    // RPCs need to use the same server logger
    logger: nkruntime.Logger,
    // RPCs need the same NK since it will receive this RPC's request for it
    nk: nkruntime.Nakama,
    // Payload is the in String format, but is typically made from JSON
    payload: string
) {
    logger.info("testRPC called");
    return JSON.stringify({success: true});
}
