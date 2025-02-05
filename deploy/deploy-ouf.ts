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
