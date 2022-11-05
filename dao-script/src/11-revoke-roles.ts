import sdk from "./1-initialize-sdk.js";

const token = sdk.getContract("0xa2FBF6F1A847365AeA6937950575b3c974F5464f", "token");

(async () => {
    try {
        // get all role
        const allRoles = await (await token).roles.getAll();

        console.log("👀 Roles that exist right now:", allRoles);

        // ERC-20 のコントラクトに関して、あなたのウォレットが持っている権限をすべて取り消します
        await (await token).roles.setAll({ admin: [], minter: [] });
        
        console.log(
            "🎉 Roles after revoking ourselves",
            await (await token).roles.getAll()
        );
        console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
    }
})();