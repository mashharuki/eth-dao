import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// get edition-drop NFT contract
const editionDrop = sdk.getContract("0xFBF64a8A3A4fCabb4042946192217090ae2B82C6", "edition-drop");

(async () => {
    try {
        await (await editionDrop).createBatch([
            {
                name: "MAsh DAO's NFT",
                description:
                "Mash DAO のメンバーになれる限定アイテムです",
                image: readFileSync("public/NFT.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
})();