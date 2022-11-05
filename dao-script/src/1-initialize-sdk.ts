import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import * as dotenv from 'dotenv';
dotenv.config();

// 環境変数を env ファイルから読み込む
const { 
    PRIVATE_KEY, 
    ALCHEMY_API_URL, 
    WALLET_ADDRESS 
} = process.env;

if (!PRIVATE_KEY || PRIVATE_KEY === "") {
    console.log("🛑 Private key not found.");
}
  
if (!ALCHEMY_API_URL || ALCHEMY_API_URL === "") {
    console.log("🛑 Alchemy API URL not found.");
}
  
if (!WALLET_ADDRESS || WALLET_ADDRESS === "") {
    console.log("🛑 Wallet Address not found.");
}

// create SDK ob
const sdk = new ThirdwebSDK(
    new ethers.Wallet(PRIVATE_KEY!, ethers.getDefaultProvider(ALCHEMY_API_URL))
);
  
(async () => {
    try {
        if (!sdk || !("getSigner" in sdk)) return;
        // get address
        const address = await sdk.getSigner()?.getAddress();
        console.log("SDK initialized by address:", address);
    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
    }
})();
  

export default sdk;