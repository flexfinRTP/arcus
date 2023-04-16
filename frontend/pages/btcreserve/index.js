import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import ConnectWallet from "../../components/ConnectWallet";
import LendBorrow from "../../components/LendBorrow";
import styles from "../../styles/Home.module.css";
import ContractCallarcuslend from "../../components/ContractCallarcuslend";
import ContractCallarcusbal from "../../components/ContractCallarcusbal";
import ContractCallarcusrewards from "../../components/ContractCallarcusrewards";
import { useConnect } from "@stacks/connect-react";
import {
  Button,
  ButtonGroup,
  Container,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { StacksTestnet } from "@stacks/network";

import {
  AnchorMode,
  standardPrincipalCV,
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from "@stacks/transactions";
import { userSession } from "../../components/ConnectWallet";

export default function Reserve() {
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
        <Text fontSize="4xl" fontWeight="semibold" color="#F2A900">
          Welcome your Arcus Bitcoin Reserve.
        </Text>
        <Text fontSize="xl" fontWeight="" color="">
          Create your reserve wallet, and gain access to exclusive Bitcoin DeFi.
        </Text>
        <Text fontSize="2xl" fontWeight="semibold" color="">
          The Citadel awaits...
        </Text>
        {/* <br />
        <br />
        <ContractCallarcuslend /> */}
        <br />
        <br />
        <Container centerContent>
          <Text fontSize="3xl" fontWeight="bold" color="#F2A900">
            BTC Reserve Dashboard
          </Text>
          <br />
          <ContractCallarcusrewards />
          <Stack
            direction={"row"}
            spacing={72}
            py={2}
            px={8}
            display="flex"
            alignItems="center"
          >
            <ContractCallarcusbal />
            <LendBorrow user={users} />
          </Stack>
        </Container>
        <br /> <br />
        <br />
        {/* TODO: pending Rewards display */}
        <br />
        <Stack
          direction={"row"}
          spacing={24}
          py={2}
          px={16}
          display="flex"
          alignItems="center"
        >
          <Container centerContent>
            <Text
              textAlign="center"
              fontSize="xl"
              fontWeight="semibold"
              color="#F2A900"
            >
              Add an authorized user to the Arcus Bitcoin Reserve now!
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
              onClick={() => addUser()}
            >
              Add User
            </Button>
            <br />
            <br />
          </Container>
          <br />
          <br /> <br />
          <br />
          <Container centerContent>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="semibold"
              color="#F2A900"
            >
              Create your Bitcoin Reserve.
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
              onClick={() => addUser()}
            >
              Create
            </Button>
            <br />
            <br />
          </Container>
        </Stack>
      </main>
    </div>
  );
}
