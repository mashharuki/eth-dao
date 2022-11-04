import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getContract("0xFBF64a8A3A4fCabb4042946192217090ae2B82C6", "edition-drop");

(async () => {
    try {
        // FYI: https://docs.thirdweb.com/typescript/sdk.tokendrop.claimconditions#tokendropclaimconditions-property
        const claimConditions = [
            {
                startTime: new Date(),
                maxQuantity: 50_000,
                price: 0,
                quantityLimitPerTransaction: 1,
                waitInSeconds: MaxUint256,
            },
        ];
        // set 
        await (await editionDrop).claimConditions.set("0", claimConditions);
        console.log("✅ Successfully set claim condition!");
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})();
