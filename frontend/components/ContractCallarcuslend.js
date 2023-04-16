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

// This is a React component that handles lending and borrowing of xBTC using the Stacks blockchain network and Connect API
const ArcusInvestUSDT = (props) => {
  const [users, setUsers] = useState([]);
  const { doContractCall } = useConnect();
  let newArray = props.user;
  function sendLoan() {
    // Prompt the user for the receiver's address and amount to send
    let receiverAddress = window.prompt("Enter the receiver's address.");
    let amount = window.prompt("Enter amount of $sUSDT you wanted to send.");
  
    // Convert the receiver's address to a standard principal CV and the amount to an int CV
    receiverAddress = standardPrincipalCV(receiverAddress);
    amount = intCV(amount);
  
    // Set up the post-condition for the transaction
    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 1 * 1000000;
  
    // Perform the contract call to send the loan
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
      contractName: "arcus-vaults",
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
  

  function takeLoan() {
    let Address = window.prompt("Enter the receiver's address");
    let amount = window.prompt("Enter the amount of $sUSDT you want to withdraw.");
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
      contractName: "arcus-vaults",
      functionName: "withdraw-vault-sudst",
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

  function depositVaultUSDT(contractAddress, amount) {
    const functionArgs = [
      standardPrincipalCV("ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN"),
      intCV(amount),
    ];
    callReadOnlyFunction({
      contractAddress,
      contractName: "arcus-vaults",
      functionName: "deposit-vault-usdt",
      functionArgs,
      network: new StacksTestnet(),
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
      anchorMode: AnchorMode.Any,
      postConditions: [
        makeStandardSTXPostCondition(
          userSession.loadUserData().profile.stxAddress.testnet,
          FungibleConditionCode.Equal,
          1000000
        ),
      ],
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.error(error));
  }

  function withdrawVaultUSDT(contractAddress, amount) {
    const functionArgs = [
      standardPrincipalCV("ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN"),
      intCV(amount),
    ];
    callReadOnlyFunction({
      contractAddress,
      contractName: "arcus-vaults",
      functionName: "withdraw-vault-usdt",
      functionArgs,
      network: new StacksTestnet(),
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
      anchorMode: AnchorMode.Any,
      postConditions: [
        makeStandardSTXPostCondition(
          userSession.loadUserData().profile.stxAddress.testnet,
          FungibleConditionCode.Equal,
          1000000
        ),
      ],
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.error(error));
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
        <Button variant="outline" onClick={() => withdrawVaultUSDT("ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN", 1)}>
          Withdraw
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            depositVaultUSDT("ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN", 1)
          }
        >
          Deposit
        </Button>
      </Stack>
      <br />
      <br />
      {/* {renderList()} */}
    </>
  );
};

export default ArcusInvestUSDT;