# spyd3rScan -Honeypot detector for Defi Due Diligence
A honeypot token is a token which allows users to buy it but cannot be exchanged to any other token.This means the token does not have any liquidity.

As a solution We have built a honeypot token detector which does the due- diligence on behalf of the user to check for potential honeypot properties.

The honeypot detector forks the mainet, and queries smartcontracts of jediSwap for the token queried by the user. When the simulation is run parameters like
- Sell tax
- buy tax
- Amount_out
- Reserves
are recorded 

We also take legacy data from the blochain to see if the transaction properties match. We get the pairs available for the token through **Subgraphs** that we have deployed and get filter and simulate for pairs in question.

The token qualifies as a honeypot if the following properties are detected

- Very high sell tax
- If the amount_out for a quoted token does not match the simulation transfers
- If the reserves for a token pair is too low
- If there is no token Pool
## Onchain security implementation
We also provide an Oracle which is constantly updated with the honeypot status of a token which can be used by other contracts like Lending and borrowing platforms, flashloans , Aggregators. And can avoid these tokens onchain itself.
This oracle can also be used on tokens that are not honeypot but have chances of going to a very low reserve state and quickly be notifie to balance funds.
- Oracle Addresses at the end
## Applications
- New users can safegaurd themselves from Rugpull projects by doing their due diligence
- Users no longer have to get scammed by accpeting Honeypot crypto for their Assets
- Onchain mitigation directly reverts such Scam tokens when Oracle is used
- Users have the descretion to trust or not trust any token through our oracle
- ## Video
https://www.loom.com/share/e5e9be1c946d43bcba826dd8e0f670b1?sid=fbc5b78b-3d65-45b5-ab0f-a7ad309d4660
## Tech stack
- Katana local environment
- Cairo
- Ganache local environment
- Express
- solidity
- Subgraph
- ethers

Chains and protocols
- Starknet - jediSwap
- NeonEVM - Moraswap
- Base - PancakeSwap
- Scroll - skydrome
- Arbitrum - pancakeSwap


## Setup 
Clone the repository with this command or run it on codespaces
```gh repo clone muskbuster/spyderscan```
run the command 
```
cd backend
npx nodemon
```
this will start the instance of honeypot detector in your localhost and has one endpoint 
you can call the endpoint using curl
```bash
curl "http://localhost:8000/<ADDRESS_OF_TOKEN>/chainID"
```
Response will be of type json
```json
{
        "token0": "Ether",
        "token1": "USD Coin",
        "tax": 0.9984171698929437,
        "isHoneyPot": false,
        "tokenAddress": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    }
```

Supported Chain IDs are
```
  1: "eth",
1101:"starknet"
  56: "bsc",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
  1101: "polygon_zkevm",

```
### For frontend 
`cd Honeypot_client`
`npm start`

Change the URL in index.js to your localhost
## Usage 
We have deployed a frontend for the detector which is directly connected to our Oracle aswell.You can simply input the address of the token you want to learn about and get to know if it is a honeypot token or not.
This can be used by the public to conduct their due-diligence for a token.
Go to website -  https://statknet-honeypot.vercel.app/
![282304598-2ba73b14-49c8-4cbb-b8ee-01bf8667cb9f](https://github.com/muskbuster/spyderscan/assets/81789395/3798085c-09b5-4651-8c99-60bfb8f809e4)

To integrate Oracles you can call the ishoneypot in the following Oracle Addresses
``` 
 0x6a0c05a08fbf89100b6082971eb74d9766088da91651e48e4c535945c40d61d - Starknet
 0xf0f887EB07c214f578ffE554749aDA52ef6E9f5C - base oracle
 0x4D2bE571FcF739050894594DBa012a04721a1a1E -zkevm
 0xF3F299290A6E74A0bF6e90F6F3EfD964cBfbE3DC arbi



``` 
However these are testnet deployments with mainet data for now 

### example implementation of oracle 

For starknet 

```cairo
use starknet::{ContractAddress, ContractState};

trait IhoneypotDispatcherTrait<T> {
    fn get_if_honeypot(self: @T, token_address: ContractAddress) -> u16;
}

struct HoneypotDispatcher {
    contract_address: ContractAddress,
}

impl IhoneypotDispatcherTrait<HoneypotDispatcher> for HoneypotDispatcher {
    fn get_if_honeypot(self: @HoneypotDispatcher, token_address: ContractAddress) -> u16 {
 HoneypotDispatcher .get_if_honeypot(token_address)
    }
}
#[starknet::contract]
mod HoneypotWrapper {
    use super::{IhoneypotDispatcherTrait, HoneypotDispatcher};
    use starknet::ContractAddress;

    #[storage]
    struct Storage {}

    impl HoneypotWrapper of IHoneypotDispatcherTrait<HoneypotDispatcher> {
        fn get_if_honeypot(
            self: @ContractState,
            contract_address: ContractAddress,
            token_address: ContractAddress,
        ) -> u16 {
            HoneypotDispatcher { contract_address }.get_if_honeypot(token_address)
        }
    }
}

```

- We also allow a function `trustToken(address tokenAddress)` which allows a user to trust the token even if tagged as honeypot as to give user descretion where they have to explicitly sign that they trust the token
For EVM chains
```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "IOracle.sol"; // Assuming the HoneypotOracle contract is in the same directory

contract SampleWallet {
    IHoneypotOracle public honeypotOracle;

    constructor(address _honeypotOracleAddress) {
        honeypotOracle = IHoneypotOracle(_honeypotOracleAddress);
    }

    function sendTokens(address tokenAddress, address to, uint256 amount) external {
        require(!honeypotOracle.isHoneypot(tokenAddress), "Token is a honeypot, transaction aborted");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(to, amount);
    }

    function receiveTokens(address tokenAddress, address from, uint256 amount) external {
        require(!honeypotOracle.isHoneypot(tokenAddress), "Token is a honeypot, transaction aborted");
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(from, address(this), amount);
    }
}
```

And can be called with any other logic

## architecture 
![image](https://github.com/gitshreevatsa/Statknet-Honeypot/assets/81789395/150b6731-e06e-4896-991d-965684846a8f)
## Further Advancements
- Upon full development of katana we will be simulating other aspects of the tokens and run code checks on the token contract using **amarna** and  **Slither** static analyzer  to give more and more insignts on the tokens
- We will expand this tool to other types of exchanges that do not follow uniswap AMM architecture aswell
- Provide advanced APIs for free to build newer and better detectors

## Final Protocol List
- Starknet - jediSwap
- NeonEVM - Moraswap
- Base - PancakeSwap
- Scroll - skydrome
- Arbitrum - pancakeSwap


