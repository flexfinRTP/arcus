import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import styles from "../styles/Home.module.css";
import { Button, ButtonGroup, Container, Stack } from "@chakra-ui/react";

import {
  AnchorMode,
  standardPrincipalCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  intCV,
} from "@stacks/transactions";
import { userSession } from "./ConnectWallet";

// This is a React component that handles lending and borrowing of sBTC using the Stacks blockchain network and Connect API
const LendBorrow = (props) => {
  const [users, setUsers] = useState([]);
  const { doContractCall } = useConnect();
  let newArray = props.user;

  function sendLoan() {
    let receiverAddress = window.prompt("Enter the receiver's address.");
    let amount = window.prompt("Enter amount of sBTC you wanted to send.");
    receiverAddress = standardPrincipalCV(receiverAddress);
    amount = intCV(amount);

    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 1 * 1000000;
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
      contractName: "arcus-lend",
      functionName: "send-loan",
      functionArgs: [receiverAddress, amount],
      postConditions: [
        makeStandardSTXPostCondition(
          postConditionAddress,
          postConditionCode,
          postConditionAmount
        ),
      ],
      onFinish: (data) => {
        console.log("onFinish:", data);
        console.log(
          "Explorer:",
          `localhost:8000/txid/${data.txId}?chain=testnet`
        );
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

   // `takeLoan()` prompts the user for input and makes a contract call to withdraw sBTC from the specified address.
  function takeLoan() {
    let Address = window.prompt("Enter the receiver's address");
    let amount = window.prompt("Enter the amount of sBTC you want to withdraw.");
    Address = standardPrincipalCV(Address);
    amount = intCV(amount);

    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 1 * 1000000;
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
      contractName: "arcus-lend",
      functionName: "take-loan",
      functionArgs: [Address, amount],
      postConditions: [
        makeStandardSTXPostCondition(
          postConditionAddress,
          postConditionCode,
          postConditionAmount
        ),
      ],
      onFinish: (data) => {
        console.log("onFinish:", data);
        console.log(
          "Explorer:",
          `localhost:8000/txid/${data.txId}?chain=testnet`
        );
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  function renderList() {
    return newArray.map((item) => (
      <>
        <h3 key={item}>{item} </h3>
      </>
    ));
  }

  return (
    <>
      <Stack direction="row" spacing={4} align="center">
        <Button variant="outline" onClick={() => takeLoan("ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN", 1)}>
          Withdraw Reserve
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            sendLoan("ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN", 1)
          }
        >
          Deposit Reserve
        </Button>
      </Stack>
      <br />
      <br />
      {renderList()}
    </>
  );
};

export default LendBorrow;
