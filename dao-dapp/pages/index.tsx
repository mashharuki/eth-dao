import { 
  ConnectWallet,
  ChainId,
  useNetwork,
  useAddress,
  useContract
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useMemo } from "react";

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
  const [tokenAddr, setTokenAddr] = useState("0xa2FBF6F1A847365AeA6937950575b3c974F5464f");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([]);

  // NFT コントラクト
  const editionDrop = useContract(editionAddr, "edition-drop").contract;
  // Token コントラクト
  const token = useContract(tokenAddr, "token").contract;

  /**
   * create short address
   */
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  /**
   * get all holders address
   */
  const getAllAddresses = async () => {
    try {
      // get address
      const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("🚀 Members addresses", memberAddresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }
  };

  /**
   * check have a NFT
   */
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

  /**
   * get all balances
   */
  const getAllBalances = async () => {
    try {
      // get balances
      const amounts = await token?.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };

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

  useEffect(() => {
    if (!address) {
      return;
    }
    checkBalance();
  }, [address, editionDrop]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop?.history]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // create menmer's info (token balance & address)
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      // find balance
      const member = memberTokenAmounts?.find(({ holder }: {holder: string}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [hasClaimedNFT, token?.history]);

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
                    <h1 className={styles.title}>🐶Mash DAO Member Page🐶</h1>
                    <p>Congratulations on being a member</p>
                    <div>
                      <div>
                        <h2>Member List</h2>
                        <table className="card">
                          <thead>
                            <tr>
                              <th>Address</th>
                              <th>Token Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberList!.map((member) => {
                              return (
                                <tr key={member.address}>
                                  <td>{shortenAddress(member.address)}</td>
                                  <td>{member.tokenAmount}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
