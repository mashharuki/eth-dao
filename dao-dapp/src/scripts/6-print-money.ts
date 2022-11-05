import sdk from "./1-initialize-sdk.js";

const token = sdk.getContract("0xa2FBF6F1A847365AeA6937950575b3c974F5464f", "token");

(async () => {
    try {
        const amount = 1000000;
        // mint
        await (await token).mint(amount);
        // get totalSupply
        const totalSupply = await (await token).totalSupply();

        console.log(
            "✅ There now is",
            totalSupply.displayValue,
            "$MSH in circulation"
        );
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();