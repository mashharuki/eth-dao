import { 
  ConnectWallet,
  ChainId,
  useNetwork,
  useAddress,
  useContract
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

/**
 * Home Component
 * @returns 
 */
const Home: NextPage = () => {
  // get address
  const address = useAddress();
  // get network ID
  const [network, switchNetwork] = useNetwork();
  const [editionAddr, setEidtionAddr] = useState("0xFBF64a8A3A4fCabb4042946192217090ae2B82C6");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // NFT コントラクト
  const editionDrop = useContract(editionAddr, "edition-drop").contract;

  // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
  const checkBalance = async () => {
    try {
      // get balance of token Id 0
      const balance = await editionDrop!.balanceOf(address || "", 0);
      if (balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("🌟 this user has a membership NFT!");
      } else {
        setHasClaimedNFT(false);
        console.log("😭 this user doesn't have a membership NFT.");
      }
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to get balance", error);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    checkBalance();
  }, [address, editionDrop]);

  /**
   * Mint NFT function
   */
  const mintNft = async () => {
    try {
      setIsClaiming(true);
      // mint NFT
      await editionDrop!.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      {(!address) ? (
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>
              Welcome to Mash DAO!!🚀
            </h1>
            <p></p>
            <div className={styles.connect}>
              <ConnectWallet />
            </div>
          </main>
        </div>
      ) : (
        <>
          {(address && network && network?.data?.chain?.id !== ChainId.Goerli)?(
            <div className={styles.container}>
              <main className={styles.main}>
                <h1 className={styles.title}>Goerli に切り替えてください⚠️</h1>
                <p>この dApp は Goerli テストネットのみで動作します。</p>
                <p>ウォレットから接続中のネットワークを切り替えてください。</p>
              </main>
            </div>
          ):(
            <>
              {hasClaimedNFT ? (
                <div className={styles.container}>
                  <main className={styles.main}>
                    <h1 className={styles.title}>🍪DAO Member Page</h1>
                    <p>Congratulations on being a member</p>
                  </main>
                </div>
              ) : (
                <div className={styles.container}>
                  <main className={styles.main}>
                    <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
                    <button disabled={isClaiming} onClick={mintNft}>
                      {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
                    </button>
                  </main>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Home;
