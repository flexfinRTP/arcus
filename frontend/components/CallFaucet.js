// Update faucetContractAddress with the actual address of the faucet contract
// Update network with the actual network to use for the transaction
// Update contractName with the actual name of the faucet contract
import { StacksTestnet, makeSTXTokenTransfer, broadcastTransaction } from '@stacks/transactions';

function withdrawFromFaucet() {
    const faucetContractAddress = "ST39KDG85WZ340RAGGFY4FN3JMKYMEC1AEQHRM7TN"; // Address of the faucet contract
    const functionName = "withdraw"; // Function name to withdraw tokens
    const functionArgs = []; // No arguments needed for withdraw function
    const network = new StacksTestnet(); // Network to use for the transaction
  
    doContractCall({
      contractAddress: faucetContractAddress,
      contractName: "arcus-faucet", // Name of the faucet contract
      functionName,
      functionArgs,
      network,
      postConditions: [
        makeStandardSTXPostCondition(
          userSession.loadUserData().profile.stxAddress.testnet, // Address of the user
          FungibleConditionCode.Equal, // Tokens must be equal to the amount requested
          10 * 1000000 // 10 ABR tokens
        ),
      ],
      onFinish: (data) => {
        console.log("onFinish:", data); // Log data on successful transaction
        console.log(
          "Explorer:",
          `localhost:8000/txid/${data.txId}?chain=testnet`
        ); // Log URL to explorer for the transaction
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled"); // Log message on transaction cancelation
      },
    });
  }
  