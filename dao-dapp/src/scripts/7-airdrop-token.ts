import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getContract("0xFBF64a8A3A4fCabb4042946192217090ae2B82C6", "edition-drop");
const token = sdk.getContract("0xa2FBF6F1A847365AeA6937950575b3c974F5464f", "token");

(async () => {
    try {
        // get holder address
        const walletAddresses = await (await editionDrop).history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log(
                "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
            );
            process.exit(0);
        }

        const airdropTargets = walletAddresses.map((address) => {
            // 1000 から 10000 の間でランダムな数を取得
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

            // ターゲットを設定
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });

        // transfer Batch
        console.log("🌈 Starting airdrop...");
        await (await token).transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("Failed to airdrop tokens", err);
    }
})();