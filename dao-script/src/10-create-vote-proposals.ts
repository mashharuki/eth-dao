import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();

const vote = sdk.getContract("0x3C7B7f10a6276a200F825d45941c4A63ED4Fb480", "vote");
const token = sdk.getContract("0xa2FBF6F1A847365AeA6937950575b3c974F5464f", "token");

(async () => {
    try {
        // トレジャリーに 420,000 のトークンを新しく鋳造する提案を作成する
        const amount = 420_000;
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";

        const executions = [
            {
                toAddress: (await token).getAddress(),
                nativeTokenValue: 0,
                transactionData: (await token).encoder.encode(
                    "mintTo", [
                        (await vote).getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];

        // create proposal
        await (await vote).propose(description, executions);
        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        // 6,900 のトークンを自分たちに譲渡するための提案を作成します
        const amount = 6_900;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
        process.env.WALLET_ADDRESS + " for being awesome?";

        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: (await token).encoder.encode(
                    "transfer",
                        [
                            process.env.WALLET_ADDRESS!,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                ),
                toAddress: (await token).getAddress(),
            },
        ];
        // create proposal executions
        await (await vote).propose(description, executions);

        console.log("✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!");
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
})();