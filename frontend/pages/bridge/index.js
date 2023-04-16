import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import ConnectWallet from "../../components/ConnectWallet";
import LendBorrow from "../../components/LendBorrow";
import styles from "../../styles/Home.module.css";
import ContractCallarcuslend from "../../components/ContractCallarcuslend";
import { useConnect } from "@stacks/connect-react";
import { Button, ButtonGroup, Container, Link, Text } from "@chakra-ui/react";

import { StacksTestnet } from "@stacks/network";

import {
  AnchorMode,
  standardPrincipalCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from "@stacks/transactions";
import { userSession } from "../../components/ConnectWallet";

export default function Bridge() {
  const [users, setUsers] = useState([]);
  const { doContractCall } = useConnect();

  function handleUser(newUser) {
    const userAdd = standardPrincipalCV(newUser);
    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 1 * 1000000;
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
      contractName: "arcus-lend",
      functionName: "add-demo-user",
      functionArgs: [userAdd],
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

  function addUser() {
    let newAddress = window.prompt("Enter the user address");
    handleUser(newAddress);
    const newArray = [...users, newAddress];

    setUsers(newArray);

    console.log(users);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Arcus</title>
        <meta name="description" content="Arcus - BTC Vault" />
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
    
      
        <Text fontSize="xl" fontWeight="semibold" color="">
          Ready to go? Put your BTC to work <span><Link href="/btcreserve" fontWeight="extrabold" color="#F2A900">now!</Link></span>
        </Text>
        
        <br />       <br />
        <br />
        <br />
        <Text fontSize="3xl" fontWeight="bold" color="#F2A900">
          Unlock your Bitcoin to unexplored profit.
        </Text>
        <br />
        <br />
        <Text fontSize="4xl" fontWeight="bold" color="">
          Available Now! Bridge from USDT to sUSDT
        </Text>
        <br />
        <Text fontSize="2xl" fontWeight="bold" color="#828282">
          Future: Bridge from BTC to sBTC
        </Text>
        <br /><br />
        <br />
        <br />
        <Container centerContent>
          <Text fontSize="2xl" fontWeight="semibold" color="#F2A900">
            Use the ALEX Bridge Now
          </Text>
          <Text fontSize="" fontWeight="semibold" color="#828282">
            testnet whitelist only...
          </Text>

          <br />
          <br />
          <Button
            bg="#F2A900"
            color="white"
            colorScheme="orange"
            variant="solid"
            w="50%"
            gap="4"
            mb={4}
            py={12}
            fontSize="xl"
            alignItems="center"
            justifyContent="center"
            display="flex"
            mt="2"
            boxShadow="dark-lg"
            p="8"
            rounded="xl"
          >Bridge</Button>
          <br />
          <br />
        </Container>
      </main>
    </div>
  );
}
