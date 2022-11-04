import { 
  ConnectWallet,
  ChainId,
  useNetwork,
  useAddress
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

/**
 * Home Component
 * @returns 
 */
const Home: NextPage = () => {
  // get address
  const address = useAddress();
  // get network ID
  const [network, switchNetwork] = useNetwork();

  return (
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
      )}
    </>
  );
};

export default Home;
