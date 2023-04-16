import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import styles from "../styles/Home.module.css";
import { Button, ButtonGroup, Container, Text } from "@chakra-ui/react";

import {
  AnchorMode,
  standardPrincipalCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from "@stacks/transactions";
import { userSession } from "./ConnectWallet";

const ContractCallarcusbal = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [reserveBalance, setReserveBalance] = useState(0);

  const getUserBalance = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
      const options = {
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "arcus-lend",
        functionName: "get-user-balance",
        network: new StacksTestnet(),
        functionArgs: [],
        senderAddress: userAddress,
      };

      const result = await callReadOnlyFunction(options);
      console.log(result.value);
      setUserBalance(parseInt(result.value));
    }
  });

  const getReserveBalance = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
      const options = {
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "arcus-lend",
        functionName: "get-reserve-balance",
        network: new StacksTestnet(),
        functionArgs: [],
        senderAddress: userAddress,
      };

      const result = await callReadOnlyFunction(options);
      console.log(result.value);
      setReserveBalance(parseInt(result.value));
    }
  });

  // if (!userSession.isUserSignedIn()) {
  //   return null;
  // }

  return (
    <div>
      {/* <div>Token Balance = {tokenBalance}</div> */}
      <Container centerContent>
        <Button variant="ghost" onClick={() => getUserBalance()}>
           Wallet Balance
          <br />
        </Button>{" "}
        <Text>{userBalance} xBTC</Text>
      </Container>
      <Container centerContent>
        <Button variant="ghost" onClick={() => getReserveBalance()}>
          Reserve Balance
          <br />
        </Button>{" "}
        <Text>{reserveBalance} xBTC</Text>
      </Container>
    </div>
  );
};

export default ContractCallarcusbal;
