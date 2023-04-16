// TODO: call rewards amount pending for strat and countdown timer

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

const ContractCallarcusrewards = () => {
  const [rewardsBalance, setRewardsBalance] = useState(0);
  const getRewardsBalance = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
      const options = {
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "arcus-vaults",
        functionName: "get-rewards-balance",
        network: new StacksTestnet(),
        functionArgs: [],
        senderAddress: userAddress,
      };

      const result = await callReadOnlyFunction(options);
      console.log(result.value);
      setRewardsBalance(parseInt(result.value));
    }
  });

  // if (!userSession.isUserSignedIn()) {
  //   return null;
  // }

  return (
    <div>
      {/* <div>Token Balance = {tokenBalance}</div> */}
      <Container centerContent>
        <Button variant="ghost" onClick={() => getRewardsBalance()}>
         Pending BTC Rewards
          <br />
        </Button>{" "}
        <div> {rewardsBalance} sBTC</div>
        <div> {rewardsBalance} ABR</div>
      </Container>
    </div>
  );
};

export default ContractCallarcusrewards;
