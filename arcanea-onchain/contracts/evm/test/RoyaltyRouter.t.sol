// SPDX-License-Identifier: CC-BY-NC-4.0
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {RoyaltyRouter} from "../src/RoyaltyRouter.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1_000_000e6);
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract RoyaltyRouterTest is Test {
    RoyaltyRouter router;
    MockUSDC usdc;

    address owner = address(0xA11CE);
    address creator = address(0xC0FFEE);
    address platform = address(0xBEEF);
    address treasury = address(0xDEAD);
    bytes32 swarmId = keccak256("creative-author-council");

    function setUp() public {
        vm.prank(owner);
        router = new RoyaltyRouter(owner);
        usdc = new MockUSDC();

        RoyaltyRouter.Recipient[] memory r = new RoyaltyRouter.Recipient[](3);
        r[0] = RoyaltyRouter.Recipient(creator, 7000);
        r[1] = RoyaltyRouter.Recipient(platform, 2000);
        r[2] = RoyaltyRouter.Recipient(treasury, 1000);
        vm.prank(owner);
        router.setRecipients(swarmId, r);
    }

    function test_setRecipients_rejectsBadSplit() public {
        RoyaltyRouter.Recipient[] memory r = new RoyaltyRouter.Recipient[](2);
        r[0] = RoyaltyRouter.Recipient(creator, 5000);
        r[1] = RoyaltyRouter.Recipient(platform, 2000); // sums to 7000
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(RoyaltyRouter.BadSplit.selector, 7000));
        router.setRecipients(swarmId, r);
    }

    function test_routeNative_splitsByBps() public {
        vm.deal(address(this), 10 ether);
        router.routeNative{value: 1 ether}(swarmId);
        assertEq(creator.balance, 0.7 ether, "creator 70%");
        assertEq(platform.balance, 0.2 ether, "platform 20%");
        assertEq(treasury.balance, 0.1 ether, "treasury 10%");
    }

    function test_routeERC20_splitsByBps() public {
        usdc.approve(address(router), 100e6);
        router.routeERC20(swarmId, address(usdc), 100e6);
        assertEq(usdc.balanceOf(creator), 70e6, "creator 70 USDC");
        assertEq(usdc.balanceOf(platform), 20e6, "platform 20 USDC");
        assertEq(usdc.balanceOf(treasury), 10e6, "treasury 10 USDC");
    }

    function test_routeNative_dustGoesToLastRecipient() public {
        // 1 wei: 0/0 to first two by integer math, 1 to last.
        vm.deal(address(this), 1);
        router.routeNative{value: 1}(swarmId);
        assertEq(creator.balance, 0);
        assertEq(platform.balance, 0);
        assertEq(treasury.balance, 1, "dust to last recipient");
    }

    function test_routeNative_revertsWithoutRecipients() public {
        vm.deal(address(this), 1 ether);
        vm.expectRevert(RoyaltyRouter.NoRecipients.selector);
        router.routeNative{value: 1 ether}(keccak256("unknown-swarm"));
    }

    receive() external payable {}
}
