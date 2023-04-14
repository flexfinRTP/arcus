import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import LendBorrow from "../components/LendBorrow";
import styles from "../styles/Home.module.css";
import ContractCallarcuslend from "../components/ContractCallarcuslend";
import { useConnect } from "@stacks/connect-react";
import { Button, ButtonGroup, Container, Text } from "@chakra-ui/react";

import { StacksTestnet } from "@stacks/network";

import {
  AnchorMode,
  standardPrincipalCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from "@stacks/transactions";
import { userSession } from "../components/ConnectWallet";

export default function Home() {
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
        <br />
        <br />
        <Text fontSize="4xl" fontWeight="bold" color="#F2A900">
          Welcome to Arcus.
        </Text>
        <br />
        <br />
        <ContractCallarcuslend />
        <br />
        <br />
        <Container centerContent>
        <Text fontSize="xl" fontWeight="semibold" color="#F2A900">
          Add a user to the Arcus Bitcoin Reserve now!
          <br />
        </Text>
          <LendBorrow user={users} />
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
            onClick={() => addUser()}
          >
            Add User
          </Button>
          <br />
          <br />
        </Container>
      </main>
    </div>
  );
}
