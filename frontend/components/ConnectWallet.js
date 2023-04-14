import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
//Component to connect the hiro wallet with the Dapp
const appConfig = new AppConfig(["store_write", "publish_data"]);
import { Button, ButtonGroup } from "@chakra-ui/react"

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Arcus",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <div>
        <Button variant="outline" onClick={disconnect}>
          Disconnect Wallet
        </Button>
        {/* <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p> */}
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={authenticate}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;
