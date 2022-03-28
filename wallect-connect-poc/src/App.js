import WalletConnectProvider from "@walletconnect/web3-provider";
// import { providers } from "ethers";
import Web3 from "web3";
import { useState } from "react";
import "./App.css";

function App() {
  //  Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    rpc: {
      1: "https://cloudflare-eth.com/",
      137: "https://polygon-rpc.com/",
      // 100: "https://dai.poa.network",
      // ...
    },
  });

  // const account = window.w3.eth.getAccounts()[0]
  const [account, updateAccount] = useState([]);
  const [chainId, updateChainId] = useState(null);

  const connectWallet = async () => {
    //  Enable session (triggers QR Code modal)
    await provider.enable();
    //  Create Web3 instance
    const web3 = new Web3(provider);
    window.w3 = web3;
    const accounts = await web3.eth.getAccounts();
    updateAccount(accounts[0]);
    //  Get Chain Id
    const chainId = await web3.eth.getChainId();
    updateChainId(chainId);
    // console.log('chainId',chainId);
  };

  const disconnectWallet = async () => {
    //  Enable session (triggers QR Code modal)
    await provider.disconnect();
    updateAccount([]);
  };

  const sign = async (msg) => {
    if (window.w3) {
      return await window.w3.eth.personal.sign(msg, account);
    } else {
      return false;
    }
  };

  const getBalance = async () => {
    if (window.w3) {
      const balance = await window.w3.eth.getBalance(account);
      console.log("account balance", balance);
    } else {
      return false;
    }
  };

  const pay = async () => {
    if (window.w3) {
      const balance = await window.w3.eth.sendTransaction({
        from: account,
        to: account,
        value: 100000,
      });
      console.log("account balance", balance);
    } else {
      return false;
    }
  };

  if (provider) {
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
    });
  }

  return (
    <div className="App">
      <button onClick={connectWallet}>Connet Wallet</button>
      <button onClick={disconnectWallet}>Disconnect</button>
      {!!account && account.length > 0 && (
        <h1>Connected with account: {account}</h1>
      )}
      {!!chainId && chainId === 1 ? (
        <h2>Chain: Ethereum</h2>
      ) : !!chainId && chainId === 137 ? (
        <h2>Chain: Polygon</h2>
      ) : (
        ""
      )}
      <button onClick={() => sign("hello world")}>Sign</button>
      <button onClick={getBalance}>Check Balance</button>
      <button onClick={pay}>Pay</button>
    </div>
  );
}

export default App;
