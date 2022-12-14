import sdk from "./1-initialize-sdk.js";

const token = sdk.getContract("0xa2FBF6F1A847365AeA6937950575b3c974F5464f", "token");

(async () => {
    try {
        // get all role
        const allRoles = await (await token).roles.getAll();

        console.log("๐ Roles that exist right now:", allRoles);

        // ERC-20 ใฎใณใณใใฉใฏใใซ้ขใใฆใใใชใใฎใฆใฉใฌใใใๆใฃใฆใใๆจฉ้ใใในใฆๅใๆถใใพใ
        await (await token).roles.setAll({ admin: [], minter: [] });
        
        console.log(
            "๐ Roles after revoking ourselves",
            await (await token).roles.getAll()
        );
        console.log("โ Successfully revoked our superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
    }
})();