import { 
  ConnectWallet,
  ChainId,
  useNetwork,
  useAddress,
  useContract
} from "@thirdweb-dev/react";
import { AddressZero } from "@ethersproject/constants";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useMemo } from "react";
import { Proposal } from "@thirdweb-dev/sdk";

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
  const [voteAddr, setVoteAddr] = useState("0x3C7B7f10a6276a200F825d45941c4A63ED4Fb480");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // NFT コントラクト
  const editionDrop = useContract(editionAddr, "edition-drop").contract;
  // Token コントラクト
  const token = useContract(tokenAddr, "token").contract;
  // Governance コントラクト
  const vote = useContract(voteAddr, "vote").contract;

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
   * get All proposal
   */
  const getAllProposals = async () => {
    try {
      // get all proposal
      const proposals = await vote!.getAll();
      setProposals(proposals);
      console.log("🌈 Proposals:", proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  };

  /**
   * check vote status
   */
  const checkIfUserHasVoted = async () => {
    try {
      // get vote status
      const hasVoted = await vote!.hasVoted(proposals[0].proposalId.toString(), address);
      setHasVoted(hasVoted);

      if (hasVoted) {
        console.log("🥵 User has already voted");
      } else {
        console.log("🙂 User has not voted yet");
      }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
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

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // 提案を取得し終えない限り、ユーザーが投票したかどうかを確認することができない
    if (!proposals.length) {
      return;
    }
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);


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
                        <h2>■ Member List</h2>
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
                      <div>
                        <h2>■ Active Proposals</h2>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsVoting(true);

                            // フォームから値を取得します
                            const votes = proposals.map((proposal) => {
                              const voteResult = {
                                proposalId: proposal.proposalId,
                                vote: 2,
                              };
                              proposal.votes.forEach((vote) => {
                                const elem = document.getElementById(
                                  proposal.proposalId + "-" + vote.type
                                ) as HTMLInputElement;

                                if (elem!.checked) {
                                  voteResult.vote = vote.type;
                                  return;
                                }
                              });
                              return voteResult;
                            });

                            try {
                              // 投票する前にウォレットがトークンを委譲する必要があるかどうかを確認します
                              const delegation = await token!.getDelegationOf(address);
                              // トークンを委譲していない場合は、投票前に委譲します
                              if (delegation === AddressZero) {
                                await token!.delegateTo(address);
                              }
                              
                              try {
                                await Promise.all(
                                  votes.map(async ({ proposalId, vote: _vote }) => {
                                    // check status
                                    const proposal = await vote!.get(proposalId);
                                    
                                    if (proposal.state === 1) {
                                      return vote!.vote(proposalId.toString(), _vote);
                                    }
                                    return;
                                  })
                                );

                                try {
                                  await Promise.all(
                                    votes.map(async ({ proposalId }) => {
                                      const proposal = await vote!.get(proposalId);

                                      // execute
                                      if (proposal.state === 4) {
                                        return vote!.execute(proposalId.toString());
                                      }
                                    })
                                  );
                                  setHasVoted(true);
                                  console.log("successfully voted");
                                } catch (err) {
                                  console.error("failed to execute votes", err);
                                }
                              } catch (err) {
                                console.error("failed to vote", err);
                              }
                            } catch (err) {
                              console.error("failed to delegate tokens");
                            } finally {
                              setIsVoting(false);
                            }
                          }}
                        >
                          {proposals.map((proposal) => (
                            <div key={proposal.proposalId.toString()} className="card">
                              <h5>{proposal.description}</h5>
                              <div>
                                {proposal.votes.map(({ type, label }) => (
                                  <div key={type}>
                                    <input
                                      type="radio"
                                      id={proposal.proposalId + "-" + type}
                                      name={proposal.proposalId.toString()}
                                      value={type}
                                      defaultChecked={type === 2}
                                    />
                                    <label htmlFor={proposal.proposalId + "-" + type}>
                                      {label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <p></p>
                          <button disabled={isVoting || hasVoted} type="submit">
                            {isVoting
                              ? "Voting..."
                              : hasVoted
                                ? "You Already Voted"
                                : "Submit Votes"}
                          </button>
                          <p></p>
                          {!hasVoted && (
                            <small>
                              This will trigger multiple transactions that you will need to
                              sign.
                            </small>
                          )}
                        </form>
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
