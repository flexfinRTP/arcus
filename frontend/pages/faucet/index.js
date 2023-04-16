import { useState } from "react";
import { Button, Container } from "@chakra-ui/react";
import { useConnect } from "@stacks/connect-react";
import {
  StacksTestnet,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  doContractCall,
} from "@stacks/transactions";

// Update faucetContractAddress with the actual address of the faucet contract
const faucetContractAddress = "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN";
// Update contractName with the actual name of the faucet contract
const contractName = "arcus-faucet";
// Update network with the actual network to use for the transaction
// const network = new StacksTestnet();

function FaucetPage() {
  const { doOpenAuth } = useConnect();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawClick = async () => {
    setIsWithdrawing(true);

    try {
      // Open Hiro wallet to authorize the transaction
      const { stxAddress } = await doOpenAuth();
      const postConditionAddress = stxAddress.testnet;

      // Build and execute the transaction
      await doContractCall({
        network: new StacksTestnet(),
        contractAddress: faucetContractAddress,
        contractName,
        functionName: "withdraw",
        functionArgs: [],
        network,
        postConditions: [
          makeStandardSTXPostCondition(
            postConditionAddress,
            FungibleConditionCode.Equal,
            10 * 1000000
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
    } catch (error) {
      console.error(error);
    }

    setIsWithdrawing(false);
  };

  return (
    <>
    <Container centerContent>
    <br /><br /><br /><br /><br /><br />
      <Button isLoading={isWithdrawing} onClick={handleWithdrawClick}>
        Withdraw 10 ABR from Faucet
      </Button>
      <br /><br />
      <br />
      <Button>Withdraw 10 STX from Faucet</Button>
      </Container>
    </>
  );
}

export default FaucetPage;
