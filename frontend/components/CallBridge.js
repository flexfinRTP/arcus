import { useCallback, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import { callReadOnlyFunction, makeStandardSTXPostCondition } from "@stacks/transactions";

const CallBridge = () => {
  const { doContractCall } = useConnect();

  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const handleDeposit = useCallback(async () => {
    try {
      // get user address from Stacks Connect
      const userSession = await doContractCall({
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "arcus-lendv01",
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
        functionArgs: [`${amount}`],
        network: new StacksTestnet(),
        postConditionMode: 0,
        postConditions: [
          makeStandardSTXPostCondition(userAddress, FungibleConditionCode.Equal, 0),
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
      // call bridge function in Clarity smart contract
      const bridgeResult = await doContractCall({
        contractAddress: "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN",
        contractName: "btc-bridge",
        functionName: "bridge",
        functionArgs: [`${address}`],
        network: new StacksTestnet(),
        postConditionMode: 0,
        postConditions: [],
      });
      
      // update status with result of bridge
      setStatus(bridgeResult.result);
    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    }
  }, [doContractCall, address]);

  return (
    <div>
      <h2>Deposit BTC</h2>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleDeposit}>Deposit</button>
      <p>{status}</p>

      <h2>Bridge BTC to sBTC</h2>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Hiro wallet address" />
      <button onClick={handleBridge}>Bridge</button>
      <p>{status}</p>
    </div>
  );
};

export default CallBridge;
