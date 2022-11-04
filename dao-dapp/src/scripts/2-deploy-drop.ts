import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        // dreploy contract
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "Mash DAO Membership NFT",
            description: "This is a membership NFT of Mash DAO",
            image: readFileSync("public/mash.png"),
            primary_sale_recipient: AddressZero,
        });
  
        // get edition-drop
        const editionDrop = sdk.getContract(editionDropAddress, "edition-drop");
        // get metadata
        const metadata = await (await editionDrop).metadata.get();
    
        console.log(
            "✅ Successfully deployed editionDrop contract, address:",
            editionDropAddress
        );
  
        console.log("✅ editionDrop metadata:", metadata);
    } catch (error) {
        console.log("failed to deploy editionDrop contract", error);
    }
})();