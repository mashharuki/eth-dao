import sdk from "./1-initialize-sdk.js";
import * as dotenv from 'dotenv';
dotenv.config();

const vote = sdk.getContract("0x3C7B7f10a6276a200F825d45941c4A63ED4Fb480", "vote");
const token = sdk.getContract("0xa2FBF6F1A847365AeA6937950575b3c974F5464f", "token");

(async () => {
    try { 
        // grant minter role
        await (await token).roles.grant("minter", (await vote).getAddress());
        console.log("Successfully gave vote contract permissions to act on token contract");
    } catch (error) {
        console.error(
            "failed to grant vote contract permissions on token contract",
            error
        );
        process.exit(1);
    }

    try {
        // get balance
        const ownedTokenBalance = await (await token).balanceOf(
            process.env.WALLET_ADDRESS!
        );

        // get balance of 90%
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        // transfer to governance Contract
        await (await token).transfer(
            (await vote).getAddress(),
            percent90
        );

        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
    } catch (err) {
        console.error("failed to transfer tokens to vote contract", err);
    }
})();