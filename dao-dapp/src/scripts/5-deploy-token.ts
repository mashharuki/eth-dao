import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        // deploy ERC20 Token
        const tokenAddress = await sdk.deployer.deployToken({
            name: "Mash DAO Governance Token",
            symbol: "MSH",
            primary_sale_recipient: AddressZero,
        });

        console.log(
            "✅ Successfully deployed token module, address:",
            tokenAddress
        );
    } catch (error) {
        console.error("failed to deploy token module", error);
    }
})();