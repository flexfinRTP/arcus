import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import ConnectWallet from "../../components/ConnectWallet";
import LendBorrow from "../../components/LendBorrow";
import styles from "../../styles/Home.module.css";
import ContractCallarcuslend from "../../components/ContractCallarcuslend";
import ContractCallarcusbal from "../../components/ContractCallarcusbal";
import ContractCallarcusinvestABR from "../../components/ContractCallarcusinvestABR";
import ContractCallarcusinvestBTC from "../../components/ContractCallarcusinvestBTC";
import ContractCallarcusinvestUSDT from "../../components/ContractCallarcusinvestUSDT";
import ContractCallarcusinvestALEX from "../../components/ContractCallarcusinvestALEX";
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

export default function Market() {
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
          Invest your Reserve BTC into your preferred trading strategy.
        </Text>
        <Text fontSize="2xl" fontWeight="" color="">
          Put your BTC to work...
        </Text>
        {/* <br />
        <br />
        <ContractCallarcuslend /> */}
        <br />
        <br />
        <Container centerContent>
          <Text fontSize="3xl" fontWeight="bold" color="#F2A900">
            Vaults
          </Text>
          <br />
        </Container>
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
              fontSize="2xl"
              fontWeight="semibold"
              color="#F2A900"
            >
              sABR Vault
            </Text>
          </Container>
          <Container centerContent>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color="#F2A900"
            >
              108% APY
            </Text>
          </Container>
          <ContractCallarcusinvestABR />
        </Stack>
        <br />
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
              fontSize="2xl"
              fontWeight="semibold"
              color="#F2A900"
            >
              sBTC / sABR
            </Text>
          </Container>
          <Container centerContent>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color="#F2A900"
            >
              23.7% APY
            </Text>
          </Container>
          <ContractCallarcusinvestBTC />
        </Stack>

        <br />
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
              fontSize="2xl"
              fontWeight="semibold"
              color="#F2A900"
            >
              sBTC / sUSDT
            </Text>
          </Container>
          <Container centerContent>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color="#F2A900"
            >
              4.7% APY
            </Text>
          </Container>
          <ContractCallarcusinvestUSDT />
        </Stack>
        <br />
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
              fontSize="2xl"
              fontWeight="semibold"
              color="#F2A900"
            >
              sBTC / ALEX
            </Text>
          </Container>
          <Container centerContent>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color="#F2A900"
            >
              49.7% APY
            </Text>
          </Container>
          <ContractCallarcusinvestALEX />
        </Stack>
        <br />
      </main>
    </div>
  );
}
