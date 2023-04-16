import React, { useCallback, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import {
  callReadOnlyFunction,
  makeStandardSTXPostCondition,
} from "@stacks/transactions";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";

const BTest = () => {
  const { doContractCall } = useConnect();

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleDeposit = useCallback(async () => {
    try {
      // get user address from Stacks Connect
      const userSession = await doContractCall({
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "arcus-lend",
        functionName: "get-user-address",
        functionArgs: [],
        network: new StacksTestnet(),
      });
      const userAddress = userSession.payload.value.address;

      // call deposit-btc function in Clarity smart contract
      const depositResult = await doContractCall({
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "btc-bridge",
        functionName: "deposit-btc",
        functionArgs: [amount],
        network: new StacksTestnet(),
        postConditionMode: 0,
        postConditions: [
          makeStandardSTXPostCondition(
            userAddress,
            FungibleConditionCode.Equal,
            0
          ),
        ],
      });

      // update status with result of deposit
      setStatus(depositResult.result);
    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    }
  }, [doContractCall, amount]);

  const handleBridge = useCallback(async () => {
    try {
      // call bridge-btc-to-stacks function in Clarity smart contract
      const bridgeResult = await doContractCall({
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "btc-bridge",
        functionName: "bridge-btc-to-stacks",
        functionArgs: [],
        network: new StacksTestnet(),
      });

      // update status with result of bridging
      setStatus(bridgeResult.result);
    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    }
  }, [doContractCall]);

  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Amount</FormLabel>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleDeposit}>Deposit BTC</Button>
      <Button onClick={handleBridge}>Bridge to Stacks</Button>
      <Text>{status}</Text>
    </VStack>
  );
};

export default BTest;
