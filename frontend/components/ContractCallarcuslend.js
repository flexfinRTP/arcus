import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import styles from "../styles/Home.module.css";
import { Button, ButtonGroup, Container } from "@chakra-ui/react";

import {
  AnchorMode,
  standardPrincipalCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from "@stacks/transactions";
import { userSession } from "./ConnectWallet";

const ContractCallarcuslend = () => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const getTokenBalance = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
      const options = {
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "arcus-lend",
        functionName: "get-token-balance",
        network: new StacksTestnet(),
        functionArgs: [],
        senderAddress: userAddress,
      };

      const result = await callReadOnlyFunction(options);
      console.log(result.value);
      setTokenBalance(parseInt(result.value));
    }
  });

  // if (!userSession.isUserSignedIn()) {
  //   return null;
  // }

  return (
    <div>
      {/* <div>Token Balance = {tokenBalance}</div> */}
      <Container centerContent>
        <Button variant="ghost" onClick={() => getTokenBalance()}>
          Get Balance
          <br />
        </Button>{" "}
      </Container>
      <div>Contract Token Balance = {tokenBalance} xBTC</div>
    </div>
  );
};

export default ContractCallarcuslend;