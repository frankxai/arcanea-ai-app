// SPDX-License-Identifier: CC-BY-NC-4.0
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {SwarmRegistry} from "../src/SwarmRegistry.sol";
import {RoyaltyRouter} from "../src/RoyaltyRouter.sol";
import {SwarmLicense} from "../src/SwarmLicense.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1_000_000e6);
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract SwarmLicenseTest is Test {
    SwarmRegistry registry;
    RoyaltyRouter router;
    SwarmLicense license;
    MockUSDC usdc;

    address owner = address(0xA11CE);
    address creator = address(0xC0FFEE);
    address platform = address(0xBEEF);
    address treasury = address(0xDEAD);
    address buyer = address(0xB0B);
    bytes32 swarmId = keccak256("creative-author-council");
    uint256 price = 49e6; // 49 USDC

    function setUp() public {
        vm.startPrank(owner);
        registry = new SwarmRegistry(owner);
        router = new RoyaltyRouter(owner);
        usdc = new MockUSDC();
        license = new SwarmLicense(owner, registry, router, address(usdc));

        registry.registerSwarm(swarmId, "ipfs://manifest", keccak256("manifest"), creator, price, 250000);

        RoyaltyRouter.Recipient[] memory r = new RoyaltyRouter.Recipient[](3);
        r[0] = RoyaltyRouter.Recipient(creator, 7000);
        r[1] = RoyaltyRouter.Recipient(platform, 2000);
        r[2] = RoyaltyRouter.Recipient(treasury, 1000);
        router.setRecipients(swarmId, r);

        usdc.transfer(buyer, 100e6);
        vm.stopPrank();
    }

    function test_mintERC20_issuesLicenseAndSplitsProceeds() public {
        vm.startPrank(buyer);
        usdc.approve(address(license), price);
        uint256 tokenId = license.mintERC20(swarmId, buyer);
        vm.stopPrank();

        assertEq(license.ownerOf(tokenId), buyer, "buyer owns license");
        assertEq(license.swarmOf(tokenId), swarmId, "token bound to swarm");
        assertEq(usdc.balanceOf(creator), 34_300_000, "creator 70% of 49 USDC");
        assertEq(usdc.balanceOf(platform), 9_800_000, "platform 20%");
        assertEq(usdc.balanceOf(treasury), 4_900_000, "treasury 10%");
    }

    function test_tokenURI_resolvesToManifest() public {
        vm.startPrank(buyer);
        usdc.approve(address(license), price);
        uint256 tokenId = license.mintERC20(swarmId, buyer);
        vm.stopPrank();
        assertEq(license.tokenURI(tokenId), "ipfs://manifest");
    }

    function test_royaltyInfo_followsEIP2981() public {
        vm.startPrank(buyer);
        usdc.approve(address(license), price);
        uint256 tokenId = license.mintERC20(swarmId, buyer);
        vm.stopPrank();
        (address receiver, uint256 amount) = license.royaltyInfo(tokenId, 1000e6);
        assertEq(receiver, creator, "royalty to creator");
        assertEq(amount, 50e6, "5% default royalty");
    }

    function test_isLicensedToken() public {
        vm.startPrank(buyer);
        usdc.approve(address(license), price);
        uint256 tokenId = license.mintERC20(swarmId, buyer);
        vm.stopPrank();
        assertTrue(license.isLicensedToken(tokenId, swarmId, buyer));
        assertFalse(license.isLicensedToken(tokenId, swarmId, owner));
    }
}
