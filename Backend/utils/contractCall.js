const ethers = require("ethers");
const oracleAbi = require("../abi/HoneypotOracle.json");
const {
  NeonEVMtestnet,
  Basetestnet,
  Mantletestnet,
  Celotestnet,
  Lineatestnet,
  ArbitrumTestnet,
  ZkSynctestnet,
  ScrollSepolia,
  zkevmtestnet
  
} = require("../utils/provider");

const signHoneypot = async (chain, copyAddress) => {
  let contractAddress, provider;

  switch (chain) {
    case "1101":
      contractAddress = "0x4D2bE571FcF739050894594DBa012a04721a1a1E"; // Replace with the correct address for Matic/Polygon Mumbai
      provider = zkevmtestnet;
      break;
    case "8453":
      contractAddress = "0xf0f887EB07c214f578ffE554749aDA52ef6E9f5C"; // Replace with the correct address for the specific chain
      provider = Basetestnet;
      break;
    case "42161":
     contractAddress = "0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC"; // Replace with the correct address for the specific chain
     provider = ArbitrumTestnet;
     break;
    case "59144":
        contractAddress = "0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC"; // Replace with the correct address for the specific chain
        provider = Lineatestnet;
        break;
    case "42220":
     contractAddress = "0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC"; // Replace with the correct address for the specific chain
     provider = Celotestnet;
     break;
    case "534352":
        contractAddress = "0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC"; // Replace with the correct address for the specific chain
        provider = ScrollSepolia;
        break;
    case "245022934":
     contractAddress = "0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC"; // Replace with the correct address for the specific chain
     provider = NeonEVMtestnet;
     break;
    case "5000":
     contractAddress = "0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC"; // Replace with the correct address for the specific chain
     provider = Mantletestnet;
     break;
    default:
      console.error("Unsupported chain:", chain);
      return;
  }

  const Honeypot = new ethers.Contract(contractAddress, oracleAbi, provider);

  
  const privateKey = "8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb62"; 

  const wallet = new ethers.Wallet(privateKey, provider);

  // Connect the wallet to the Honeypot contract
  const connectedHoneypot = Honeypot.connect(wallet);

  // Call the setHoneypot function
  try {
    const tx = await connectedHoneypot.setHoneypot(copyAddress);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log("setHoneypot function called successfully!");
  } catch (error) {
    console.error("Error calling setHoneypot function:", error);
  }
};
module.exports ={
    signHoneypot
}