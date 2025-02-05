# ouf-contracts


### .env.template

```
# Signer Private Key (signer[0])
SIGNER_PRIVATE_KEY="88888"

# Arbitrum One Mainnet
ARBITRUM_MAINNET_RPC_ENDPOINT_URL="88888"
ARBITRUM_ETHERSCAN_API_KEY="88888"

# Arbitrum Sepolia
ARBITRUM_SEPOLIA_RPC_ENDPOINT_URL="88888"
```

### .gitignore

```
node_modules
coverage
coverage.json
typechain
typechain-types
.DS_Store

cache
artifacts

.env*
!.env.template
```

### .prettierignore

```
# OSX
.DS_Store

# env
.env

# node
node_modules
package-lock.json
yarn.lock
yarn-error.log

# editooors
.idea
.vscode

# tsc / hardhat / foundry
artifacts
cache
out
data
build
dist
lib

# github
.github
```

### .prettierrc

```
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false,
    "trailingComma": "none",
    "arrowParens": "avoid",
    "printWidth": 80,
    "overrides": [
        {
            "files": "*.sol",
            "options": {
                "printWidth": 100,
                "tabWidth": 4,
                "useTabs": false,
                "singleQuote": false,
                "bracketSpacing": false,
                "explicitTypes": "always"
            }
        }
    ]
}

```

### README.md

```markdown
# OUF Governance Token

Governance Token of OUF (OUr Friendly assistant).

Ouf UI repo: https://github.com/w3hc/ouf 

## Features

-   [Typescript](https://www.typescriptlang.org/)
-   [Ethers v6](https://docs.ethers.org/v6/)
-   [OpenZeppelin Contracts v5.1.0](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.1.0)
-   [Hardhat Verify plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
-   [Hardhat Deploy plugin](https://github.com/wighawag/hardhat-deploy)

## Supported Networks

| Network | Chain ID | Documentation |
|---------|----------|---------------|
| Arbitrum One | 42161 | [Documentation](https://docs.arbitrum.io/welcome/get-started) |
| Arbitrum Sepolia | 421614 | [Documentation](https://docs.arbitrum.io/welcome/get-started) |

## Contract Verification

| Network | Explorer URL | API URL | API Key Variable |
|---------|--------------|---------|-----------------|
| Arbitrum One | https://arbiscan.io | https://api.arbiscan.io/api | ARBITRUM_ETHERSCAN_API_KEY |
| Arbitrum Sepolia | https://sepolia.arbiscan.io | https://api-sepolia.arbiscan.io/api | ARBITRUM_ETHERSCAN_API_KEY |

### Manual Contract Verification

```bash
npx hardhat verify --network <NETWORK_NAME> <CONTRACT_ADDRESS> "10000000000000000000000"
```

Where:
- `<NETWORK_NAME>`: `arbitrum`, `arbitrum-sepolia`
- `<CONTRACT_ADDRESS>`: The address where your contract was deployed

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp .env.template .env
```

3. Update `.env` with your configuration.

## Usage

### Testing

Execute the test suite:
```bash
pnpm test
```

### Deployment

Deploy to supported networks:
```bash
pnpm deploy:<network>
```
Supported values for `<network>`: `arbitrum`, `arbitrum-sepolia`

### Network Operations

Check wallet ETH balances:
```bash
pnpm bal
```

Mint tokens:
```bash
pnpm mint:<network> <amount>
```

Transfer tokens:
```bash
pnpm send:<network> <amount>
```

## Core Dependencies

-   Node [v20.9.0](https://nodejs.org/uk/blog/release/v20.9.0/)
-   PNPM [v9.10.0](https://pnpm.io/pnpm-vs-npm)
-   Hardhat [v2.22.16](https://github.com/NomicFoundation/hardhat/releases/)
-   OpenZeppelin Contracts [v5.1.0](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.1.0)
-   Ethers [v6.13.4](https://docs.ethers.org/v6/)

## Support

Feel free to reach out to [Julien](https://github.com/julienbrg) on [Farcaster](https://warpcast.com/julien-), [Element](https://matrix.to/#/@julienbrg:matrix.org), [Status](https://status.app/u/iwSACggKBkp1bGllbgM=#zQ3shmh1sbvE6qrGotuyNQB22XU5jTrZ2HFC8bA56d5kTS2fy), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).
```

## contracts


### contracts/OufGovernanceToken.sol

```
// SPDX-License-Identifier: GPL-3.0
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact julien@strat.cc
contract OufGovernanceToken is ERC20, ERC20Burnable, Ownable, ERC20Permit, ERC20Votes {
    constructor(
        address initialOwner
    ) ERC20("OufGovernanceToken", "OUF") Ownable(initialOwner) ERC20Permit("OufGovernanceToken") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}

```

## deploy


### deploy/deploy-ouf.ts

```typescript
import "@nomiclabs/hardhat-ethers"
import color from "cli-color"
var msg = color.xterm(39).bgXterm(128)
import hre, { ethers } from "hardhat"

export default async ({ getNamedAccounts, deployments }: any) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log("Deploying OufGovernanceToken to Arbitrum Sepolia...")
    console.log("Deployer:", deployer)

    const oufToken = await deploy("OufGovernanceToken", {
        from: deployer,
        args: [deployer],
        log: true
    })

    if (hre.network.name === "arbitrum-sepolia") {
        try {
            console.log(
                "OufGovernanceToken deployed to:",
                msg(oufToken.address)
            )
            console.log("\nArbiscan verification in progress...")

            // Wait for 30 seconds before verification to ensure the contract is deployed
            await new Promise(resolve => setTimeout(resolve, 30 * 1000))

            await hre.run("verify:verify", {
                address: oufToken.address,
                constructorArguments: [deployer]
            })
            console.log("Arbiscan verification completed ✅")
        } catch (error) {
            console.error("Error during verification:", error)
        }
    } else {
        console.log("Not on Arbitrum Sepolia - skipping verification")
    }
}

export const tags = ["OufGovernanceToken"]

```

### hardhat.config.ts

```typescript
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-verify"
import "hardhat-deploy"
import * as dotenv from "dotenv"
dotenv.config()

const {
    SIGNER_PRIVATE_KEY,
    ARBITRUM_SEPOLIA_RPC_ENDPOINT_URL,
    ARBITRUM_ETHERSCAN_API_KEY
} = process.env

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: 0
    },
    networks: {
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true
        },
        "arbitrum-sepolia": {
            chainId: 421614,
            url:
                ARBITRUM_SEPOLIA_RPC_ENDPOINT_URL ||
                "https://sepolia-rollup.arbitrum.io/rpc",
            accounts:
                SIGNER_PRIVATE_KEY !== undefined ? [SIGNER_PRIVATE_KEY] : []
        }
    },
    solidity: {
        version: "0.8.22",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    sourcify: {
        enabled: true
    },
    etherscan: {
        apiKey: {
            "arbitrum-sepolia": ARBITRUM_ETHERSCAN_API_KEY || ""
        },
        customChains: [
            {
                network: "arbitrum-sepolia",
                chainId: 421614,
                urls: {
                    apiURL: "https://api-sepolia.arbiscan.io/api",
                    browserURL: "https://sepolia.arbiscan.io"
                }
            }
        ]
    }
}

export default config

```

### ouf-contracts_app_description.md

```markdown
# ouf-contracts


### .env.template

```
# Signer Private Key (signer[0])
SIGNER_PRIVATE_KEY="88888"

# Arbitrum One Mainnet
ARBITRUM_MAINNET_RPC_ENDPOINT_URL="88888"
ARBITRUM_ETHERSCAN_API_KEY="88888"

# Arbitrum Sepolia
ARBITRUM_SEPOLIA_RPC_ENDPOINT_URL="88888"
```

### .gitignore

```
node_modules
coverage
coverage.json
typechain
typechain-types
.DS_Store

cache
artifacts

.env*
!.env.template
```

### .prettierignore

```
# OSX
.DS_Store

# env
.env

# node
node_modules
package-lock.json
yarn.lock
yarn-error.log

# editooors
.idea
.vscode

# tsc / hardhat / foundry
artifacts
cache
out
data
build
dist
lib

# github
.github
```

### .prettierrc

```
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false,
    "trailingComma": "none",
    "arrowParens": "avoid",
    "printWidth": 80,
    "overrides": [
        {
            "files": "*.sol",
            "options": {
                "printWidth": 100,
                "tabWidth": 4,
                "useTabs": false,
                "singleQuote": false,
                "bracketSpacing": false,
                "explicitTypes": "always"
            }
        }
    ]
}

```

### README.md

```markdown
# OUF Governance Token

Governance Token of OUF (OUr Friendly assistant).

Ouf UI repo: https://github.com/w3hc/ouf 

## Features

-   [Typescript](https://www.typescriptlang.org/)
-   [Ethers v6](https://docs.ethers.org/v6/)
-   [OpenZeppelin Contracts v5.1.0](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.1.0)
-   [Hardhat Verify plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
-   [Hardhat Deploy plugin](https://github.com/wighawag/hardhat-deploy)

## Supported Networks

| Network | Chain ID | Documentation |
|---------|----------|---------------|
| Arbitrum One | 42161 | [Documentation](https://docs.arbitrum.io/welcome/get-started) |
| Arbitrum Sepolia | 421614 | [Documentation](https://docs.arbitrum.io/welcome/get-started) |

## Contract Verification

| Network | Explorer URL | API URL | API Key Variable |
|---------|--------------|---------|-----------------|
| Arbitrum One | https://arbiscan.io | https://api.arbiscan.io/api | ARBITRUM_ETHERSCAN_API_KEY |
| Arbitrum Sepolia | https://sepolia.arbiscan.io | https://api-sepolia.arbiscan.io/api | ARBITRUM_ETHERSCAN_API_KEY |

### Manual Contract Verification

```bash
npx hardhat verify --network <NETWORK_NAME> <CONTRACT_ADDRESS> "10000000000000000000000"
```

Where:
- `<NETWORK_NAME>`: `arbitrum`, `arbitrum-sepolia`
- `<CONTRACT_ADDRESS>`: The address where your contract was deployed

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp .env.template .env
```

3. Update `.env` with your configuration.

## Usage

### Testing

Execute the test suite:
```bash
pnpm test
```

### Deployment

Deploy to supported networks:
```bash
pnpm deploy:<network>
```
Supported values for `<network>`: `arbitrum`, `arbitrum-sepolia`

### Network Operations

Check wallet ETH balances:
```bash
pnpm bal
```

Mint tokens:
```bash
pnpm mint:<network> <amount>
```

Transfer tokens:
```bash
pnpm send:<network> <amount>
```

## Core Dependencies

-   Node [v20.9.0](https://nodejs.org/uk/blog/release/v20.9.0/)
-   PNPM [v9.10.0](https://pnpm.io/pnpm-vs-npm)
-   Hardhat [v2.22.16](https://github.com/NomicFoundation/hardhat/releases/)
-   OpenZeppelin Contracts [v5.1.0](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.1.0)
-   Ethers [v6.13.4](https://docs.ethers.org/v6/)

## Support

Feel free to reach out to [Julien](https://github.com/julienbrg) on [Farcaster](https://warpcast.com/julien-), [Element](https://matrix.to/#/@julienbrg:matrix.org), [Status](https://status.app/u/iwSACggKBkp1bGllbgM=#zQ3shmh1sbvE6qrGotuyNQB22XU5jTrZ2HFC8bA56d5kTS2fy), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).
```

## contracts


### contracts/OufGovernanceToken.sol

```
// SPDX-License-Identifier: GPL-3.0
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact julien@strat.cc
contract OufGovernanceToken is ERC20, ERC20Burnable, Ownable, ERC20Permit, ERC20Votes {
    constructor(
        address initialOwner
    ) ERC20("OufGovernanceToken", "OUF") Ownable(initialOwner) ERC20Permit("OufGovernanceToken") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}

```

## deploy


### deploy/deploy-ouf.ts

```typescript
import "@nomiclabs/hardhat-ethers"
import color from "cli-color"
var msg = color.xterm(39).bgXterm(128)
import hre, { ethers } from "hardhat"

export default async ({ getNamedAccounts, deployments }: any) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log("Deploying OufGovernanceToken to Arbitrum Sepolia...")
    console.log("Deployer:", deployer)

    const oufToken = await deploy("OufGovernanceToken", {
        from: deployer,
        args: [deployer],
        log: true
    })

    if (hre.network.name === "arbitrum-sepolia") {
        try {
            console.log(
                "OufGovernanceToken deployed to:",
                msg(oufToken.address)
            )
            console.log("\nArbiscan verification in progress...")

            // Wait for 30 seconds before verification to ensure the contract is deployed
            await new Promise(resolve => setTimeout(resolve, 30 * 1000))

            await hre.run("verify:verify", {
                address: oufToken.address,
                constructorArguments: [deployer]
            })
            console.log("Arbiscan verification completed ✅")
        } catch (error) {
            console.error("Error during verification:", error)
        }
    } else {
        console.log("Not on Arbitrum Sepolia - skipping verification")
    }
}

export const tags = ["OufGovernanceToken"]

```

### hardhat.config.ts

```typescript
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-verify"
import "hardhat-deploy"
import * as dotenv from "dotenv"
dotenv.config()

const {
    SIGNER_PRIVATE_KEY,
    ARBITRUM_SEPOLIA_RPC_ENDPOINT_URL,
    ARBITRUM_ETHERSCAN_API_KEY
} = process.env

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: 0
    },
    networks: {
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true
        },
        "arbitrum-sepolia": {
            chainId: 421614,
            url:
                ARBITRUM_SEPOLIA_RPC_ENDPOINT_URL ||
                "https://sepolia-rollup.arbitrum.io/rpc",
            accounts:
                SIGNER_PRIVATE_KEY !== undefined ? [SIGNER_PRIVATE_KEY] : []
        }
    },
    solidity: {
        version: "0.8.22",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    sourcify: {
        enabled: true
    },
    etherscan: {
        apiKey: {
            "arbitrum-sepolia": ARBITRUM_ETHERSCAN_API_KEY || ""
        },
        customChains: [
            {
                network: "arbitrum-sepolia",
                chainId: 421614,
                urls: {
                    apiURL: "https://api-sepolia.arbiscan.io/api",
                    browserURL: "https://sepolia.arbiscan.io"
                }
            }
        ]
    }
}

export default config

```

### ouf-contracts_app_description.md

```markdown

```

### package.json

```json
{
    "name": "w3hc-hardhat-template",
    "version": "0.1.0",
    "main": "index.js",
    "type": "commonjs",
    "scripts": {
        "test": "hardhat test",
        "compile": "hardhat compile",
        "deploy": "hardhat deploy --network arbitrum-sepolia --reset",
        "mint": "hardhat mint --network arbitrum-sepolia --amount",
        "send": "hardhat send --wallet 0xD8a394e7d7894bDF2C57139fF17e5CBAa29Dd977 --network arbitrum-sepolia --amount",
        "bal": "npx hardhat run scripts/check-my-balance.ts",
        "prettier": "prettier --write \"**/*.ts\"",
        "prettier-check": "prettier --check \"**/*.ts\""
    },
    "keywords": [
        "template",
        "hardhat",
        "solidity",
        "web3"
    ],
    "author": "W3HC",
    "devDependencies": {
        "@nomicfoundation/hardhat-chai-matchers": "^2.0.8",
        "@nomicfoundation/hardhat-ethers": "^3.0.8",
        "@nomicfoundation/hardhat-network-helpers": "^1.0.12",
        "@nomicfoundation/hardhat-toolbox": "^5.0.0",
        "@nomicfoundation/hardhat-verify": "^2.0.12",
        "@typechain/ethers-v6": "^0.5.1",
        "@typechain/hardhat": "^9.1.0",
        "@types/chai": "^4.3.20",
        "@types/cli-color": "^2.0.6",
        "@types/mocha": "^10.0.10",
        "@types/node": "^22.10.1",
        "chai": "^4.5.0",
        "hardhat": "^2.22.17",
        "hardhat-gas-reporter": "^1.0.10",
        "prettier": "^3.4.2",
        "prettier-plugin-solidity": "^1.4.1",
        "solidity-coverage": "^0.8.14",
        "ts-node": "^10.9.2",
        "typechain": "^8.3.2",
        "typescript": "^5.7.2"
    },
    "dependencies": {
        "@nomiclabs/hardhat-ethers": "npm:hardhat-deploy-ethers@^0.4.2",
        "@openzeppelin/contracts": "^5.1.0",
        "cli-color": "^2.0.4",
        "dotenv": "^16.4.7",
        "ethers": "^6.13.4",
        "hardhat-deploy": "^0.12.4",
        "hardhat-deploy-ethers": "0.4.2"
    }
}
```

### pnpm-lock.yaml

```yaml
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      '@nomiclabs/hardhat-ethers':
        specifier: npm:hardhat-deploy-ethers@^0.4.2
        version: hardhat-deploy-ethers@0.4.2(@nomicfoundation/hardhat-ethers@3.0.8(ethers@6.13.4)(hardhat@2.22.17(ts-node@10.9.2(@types/node@22.10.1)(typescript@5.7.2))(typescript@5.7.2)))(hardhat-deploy@0.12.4)(hardhat@2.22.17(ts-node@10.9.2(@types/node@22.10.1)(typescript@5.7.2))(typescript@5.7.2))
      '@openzeppelin/contracts':
        specifier: ^5.1.0
        version: 5.1.0
      cli-color:
        specifier: ^2.0.4
        version: 2.0.4
      dotenv:
        specifier: ^16.4.7
        version: 16.4.7
      ethers:
        specifier: ^6.13.4
        version: 6.13.4
      hardhat-deploy:
        specifier: ^0.12.4
        version: 0.12.4
      hardhat-deploy-ethers:
        specifier: 0.4.2
```

[This file was cut: it has more than 500 lines]

```

## scripts


### scripts/check-my-balance.ts

```typescript
const color = require("cli-color")
var msg = color.xterm(39).bgXterm(128)
import hre from "hardhat"
import { ethers } from "ethers"

async function main() {
    const networks = Object.entries(hre.config.networks)

    console.log(
        color.cyanBright(
            "\nFetching signer balances for all supported networks...\n"
        )
    )

    for (const [networkName, networkConfig] of networks) {
        try {
            console.log(color.magenta(`\nSwitching to network: ${networkName}`))

            // Ensure network has an RPC URL and accounts
            const { url, accounts } = networkConfig as any

            if (!url || accounts.length === 0) {
                console.error(
                    color.yellow(
                        `Skipping network "${networkName}" due to missing RPC URL or accounts.`
                    )
                )
                continue
            }

            // Create provider and signer
            const provider = new ethers.JsonRpcProvider(url)
            const signer = new ethers.Wallet(accounts[0], provider)

            // Get balance
            const balance = await provider.getBalance(signer.address)

            console.log(
                `Signer (${signer.address}) on network "${networkName}" has`,
                msg(ethers.formatEther(balance)),
                "ETH."
            )
        } catch (error: any) {
            console.error(
                color.red(
                    `Failed to process network ${networkName}: ${error.message}`
                )
            )
        }
    }

    console.log(color.cyanBright("\nDone fetching balances for all networks."))
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})

```

## tasks


### tasks/mint.ts

```typescript
import { task } from "hardhat/config"
import fs from "fs"
import path from "path"
var msg = require("cli-color").xterm(39).bgXterm(128)
var error = require("cli-color").red.bold

task("mint", "Mint a given amount of ERC-20 tokens")
    .addParam("amount")
    .setAction(async (args, hre) => {
        const ethers = hre.ethers
        const [signer] = await ethers.getSigners()
        const OufGovernanceToken =
            await ethers.getContractFactory("OufGovernanceToken")

        const deploymentPath = path.join(
            __dirname,
            "..",
            "deployments",
            hre.network.name,
            "OufGovernanceToken.json"
        )

        if (!fs.existsSync(deploymentPath)) {
            console.log(
                error(
                    `\nCan't find a deployed instance of OufGovernanceToken ERC-20 on ${hre.network.name}`
                ),
                "\nTry deploying it first with:",
                msg(`\npnpm deploy:${hre.network.name}`)
            )
            return
        }

        const deploymentData = JSON.parse(
            fs.readFileSync(deploymentPath, "utf8")
        )
        const addr = deploymentData.address

        const erc20 = new ethers.Contract(
            addr,
            OufGovernanceToken.interface,
            signer
        )
        const mint = await erc20.mint(await ethers.parseEther(args.amount))
        const hash = mint.hash
        console.log(
            "Minted",
            msg(args.amount),
            "units. \n\nTx hash:",
            msg(hash)
        )
    })

```

### tasks/send.ts

```typescript
import { task } from "hardhat/config"
import fs from "fs"
import path from "path"
var msg = require("cli-color").xterm(39).bgXterm(128)
var error = require("cli-color").red.bold

task("send", "Send a given amount of tokens to a given address")
    .addParam("wallet")
    .addParam("amount")
    .setAction(async (args, hre) => {
        const ethers = hre.ethers
        const [signer] = await ethers.getSigners()
        const OufGovernanceToken =
            await ethers.getContractFactory("OufGovernanceToken")

        const deploymentPath = path.join(
            __dirname,
            "..",
            "deployments",
            hre.network.name,
            "OufGovernanceToken.json"
        )

        if (!fs.existsSync(deploymentPath)) {
            console.log(
                error(
                    `\nCan't find a deployed instance of OufGovernanceToken ERC-20 on ${hre.network.name}`
                ),
                "\nTry deploying it first with:",
                msg(`\npnpm deploy:${hre.network.name}`)
            )
            return
        }

        const deploymentData = JSON.parse(
            fs.readFileSync(deploymentPath, "utf8")
        )
        const addr = deploymentData.address

        const erc20 = new ethers.Contract(
            addr,
            OufGovernanceToken.interface,
            signer
        )
        const mint = await erc20.transfer(
            args.wallet,
            await ethers.parseEther(args.amount)
        )
        const hash = mint.hash
        console.log(
            "\nSent",
            msg(args.amount),
            "to",
            args.wallet,
            "\n\nTx hash:",
            msg(hash)
        )
    })

```

## test


### test/OufGovernanceToken.ts

```typescript
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("OufGovernanceToken", function () {
    async function deployContracts() {
        const [owner, alice, bob] = await ethers.getSigners()
        const OufGovernanceToken =
            await ethers.getContractFactory("OufGovernanceToken")
        const token = await OufGovernanceToken.deploy(owner.address)
        return { token, owner, alice, bob }
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { token, owner } = await loadFixture(deployContracts)
            expect(await token.owner()).to.equal(owner.address)
        })

        it("Should have correct name and symbol", async function () {
            const { token } = await loadFixture(deployContracts)
            expect(await token.name()).to.equal("OufGovernanceToken")
            expect(await token.symbol()).to.equal("OUF")
        })

        it("Should start with zero total supply", async function () {
            const { token } = await loadFixture(deployContracts)
            expect(await token.totalSupply()).to.equal(0)
        })
    })

    describe("Minting", function () {
        it("Should allow owner to mint tokens", async function () {
            const { token, alice } = await loadFixture(deployContracts)
            const mintAmount = ethers.parseEther("100")
            await token.mint(alice.address, mintAmount)
            expect(await token.balanceOf(alice.address)).to.equal(mintAmount)
        })

        it("Should not allow non-owner to mint tokens", async function () {
            const { token, alice, bob } = await loadFixture(deployContracts)
            const mintAmount = ethers.parseEther("100")
            await expect(
                token.connect(alice).mint(bob.address, mintAmount)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        })
    })

    describe("ERC20Votes", function () {
        it("Should track voting power after delegation", async function () {
            const { token, alice, bob } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("100")

            // Mint tokens to Alice
            await token.mint(alice.address, amount)

            // Alice delegates to Bob
            await token.connect(alice).delegate(bob.address)

            // Check Bob's voting power
            expect(await token.getVotes(bob.address)).to.equal(amount)
        })

        it("Should track voting power historically", async function () {
            const { token, alice } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("0")

            // Mint tokens to Alice
            await token.mint(alice.address, amount)

            // Alice self-delegates
            await token.connect(alice).delegate(alice.address)

            // Move one block forward
            await ethers.provider.send("evm_mine", [])

            // Get the current block number
            const blockNumber = await ethers.provider.getBlockNumber()

            // Check historical voting power
            expect(
                await token.getPastVotes(alice.address, blockNumber - 1)
            ).to.equal(amount)
        })
    })

    describe("Burning", function () {
        it("Should allow token holders to burn their tokens", async function () {
            const { token, alice } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("100")

            // Mint tokens to Alice
            await token.mint(alice.address, amount)

            // Alice burns half her tokens
            await token.connect(alice).burn(amount / 2n)

            expect(await token.balanceOf(alice.address)).to.equal(amount / 2n)
        })
    })

    describe("ERC20Permit", function () {
        it("Should allow permit functionality", async function () {
            const { token, owner, alice } = await loadFixture(deployContracts)
            const amount = ethers.parseEther("100")

            // Get the current nonce
            const nonce = await token.nonces(owner.address)

            // Get the EIP712 domain separator
            const domain = {
                name: await token.name(),
                version: "1",
                chainId: (await ethers.provider.getNetwork()).chainId,
                verifyingContract: await token.getAddress()
            }

            // Create the permit type data
            const types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" }
                ]
            }

            const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

            const value = {
                owner: owner.address,
                spender: alice.address,
                value: amount,
                nonce: nonce,
                deadline: deadline
            }

            // Sign the permit
            const signature = await owner.signTypedData(domain, types, value)
            const sig = ethers.Signature.from(signature)

            // Execute the permit
            await token.permit(
                owner.address,
                alice.address,
                amount,
                deadline,
                sig.v,
                sig.r,
                sig.s
            )

            // Check the allowance
            expect(
                await token.allowance(owner.address, alice.address)
            ).to.equal(amount)
        })
    })
})

```

### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "resolveJsonModule": true
    }
}

```

## Structure

```
├── .env.template
├── .github
    └── workflows
    │   └── run-unit-tests.yml
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── contracts
    └── OufGovernanceToken.sol
├── deploy
    └── deploy-ouf.ts
├── hardhat.config.ts
├── ouf-contracts_app_description.md
├── package.json
├── pnpm-lock.yaml
├── scripts
    └── check-my-balance.ts
├── tasks
    ├── mint.ts
    └── send.ts
├── test
    └── OufGovernanceToken.ts
├── tsconfig.json
```

Timestamp: Feb 05 2025 08:42:03 PM UTC