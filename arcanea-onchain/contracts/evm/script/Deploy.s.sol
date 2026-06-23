// SPDX-License-Identifier: CC-BY-NC-4.0
pragma solidity 0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {SwarmRegistry} from "../src/SwarmRegistry.sol";
import {RoyaltyRouter} from "../src/RoyaltyRouter.sol";
import {SwarmLicense} from "../src/SwarmLicense.sol";

/// @notice Testnet deploy script for Base Sepolia + Polygon Amoy.
/// @dev    Reads config from env. NEVER hardcode keys. Run only against testnet:
///         forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast
///
///         Required env:
///           PRIVATE_KEY        deployer key (a throwaway TESTNET key — never a real one)
///           OWNER              admin address for the three contracts
///           SETTLEMENT_TOKEN   testnet USDC address (or 0x0 for native-only)
///
///         MAINNET IS A HUMAN GATE. This script must never be pointed at a
///         mainnet RPC without explicit human approval + an audit.
contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.envAddress("OWNER");
        address settlementToken = vm.envOr("SETTLEMENT_TOKEN", address(0));

        vm.startBroadcast(deployerKey);

        SwarmRegistry registry = new SwarmRegistry(owner);
        RoyaltyRouter router = new RoyaltyRouter(owner);
        SwarmLicense license = new SwarmLicense(owner, registry, router, settlementToken);

        vm.stopBroadcast();

        console2.log("SwarmRegistry:", address(registry));
        console2.log("RoyaltyRouter:", address(router));
        console2.log("SwarmLicense:", address(license));
        console2.log("owner:", owner);
        console2.log("settlementToken:", settlementToken);
    }
}
