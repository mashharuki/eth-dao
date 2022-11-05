import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        // deploy governance contract 
        const voteContractAddress = await sdk.deployer.deployVote({
            name: "Mash DAO",
            voting_token_address: "0xa2FBF6F1A847365AeA6937950575b3c974F5464f",
            voting_delay_in_blocks: 0,
            voting_period_in_blocks: 6570,
            voting_quorum_fraction: 0,
            proposal_token_threshold: 0,
        });

        console.log(
            "✅ Successfully deployed vote contract, address:",
            voteContractAddress,
        );
    } catch (err) {
        console.error("Failed to deploy vote contract", err);
    }
})();