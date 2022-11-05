# eth-dao
ETH-DAO DAppを開発するためのリポジトリです。

### thirdwebのテンプレ生成コマンド

```zsh
npx thirdweb create -t next-typescript-starter
```

### NFT コントラクトデプロイコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/2-deploy-drop.ts
```

```zsh
SDK initialized by address: 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
✅ Successfully deployed editionDrop contract, address: 0xFBF64a8A3A4fCabb4042946192217090ae2B82C6
✅ editionDrop metadata: {
  name: 'Mash DAO Membership NFT',
  description: 'This is a membership NFT of Mash DAO',
  image: 'https://gateway.ipfscdn.io/ipfs/QmNMg2usQMrfvMg8TcTYFModwhiW9zAa4fBywxje3bKbuL/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''
}
✨  Done in 41.41s.
```

### NFTのメタデータをセットするコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/3-config-nft.ts
```

### NFTをミントするコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/4-set-claim-condition.ts
```

### ERC20規格対応のトークンをデプロイするコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/5-deploy-token.ts
```

```zsh
Loaded env from /Users/harukikondo/git/eth-dao/dao-dapp/.env.local
SDK initialized by address: 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
✅ Successfully deployed token module, address: 0xa2FBF6F1A847365AeA6937950575b3c974F5464f
✨  Done in 45.45s.
```

### トークンをmintするコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/6-print-money.ts
```

```zsh
SDK initialized by address: 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
✅ There now is 1000000.0 $MSH in circulation
✨  Done in 36.39s.
```

### ガバナンスコントラクトをデプロイするコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/8-deploy-vote.ts
```

```zsh
Loaded env from /Users/harukikondo/git/eth-dao/dao-dapp/.env.local
SDK initialized by address: 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
✅ Successfully deployed vote contract, address: 0x3C7B7f10a6276a200F825d45941c4A63ED4Fb480
✨  Done in 36.51s.
```

### ガバナンストークンをトレジャリーに移転させるコマンド

```zsh
yarn node --loader ts-node/esm src/scripts/9-setup-vote.ts
```

```zsh
Successfully gave vote contract permissions to act on token contract
✅ Successfully transferred 900000 tokens to vote contract
✨  Done in 57.58s.
```

### thirdwebのSDKを使ってSignerオブジェクトを生成するサンプルコード

```ts
// create SDK ob
const sdk = new ThirdwebSDK(
    new ethers.Wallet(process.env.PRIVATE_KEY!, ethers.getDefaultProvider(process.env.ALCHEMY_API_URL))
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
```

### 参考文献
1. [thirdweb](https://thirdweb.com/)
2. [thirdweb Docs](https://portal.thirdweb.com/templates)
3. [thirdweb Contracts](https://github.com/thirdweb-dev/contracts)
4. [chainlink faucet](https://faucets.chain.link/)
5. [DropERC1155.sol](https://github.com/thirdweb-dev/contracts/blob/main/contracts/drop/DropERC1155.sol)
6. [Mash DAO Membership NFT](https://goerli.etherscan.io/token/0xFBF64a8A3A4fCabb4042946192217090ae2B82C6)
7. [TokenERC20.sol](https://github.com/thirdweb-dev/contracts/blob/main/contracts/token/TokenERC20.sol)