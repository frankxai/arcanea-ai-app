// SPDX-License-Identifier: CC-BY-NC-4.0
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title RoyaltyRouter
/// @notice Splits revenue (native or ERC-20/USDC) for a swarm across recipients
///         by basis points. Used for both money models: primary license-mint
///         proceeds and per-invocation (x402) metered payments route here and
///         are immediately split to creator / platform / treasury.
/// @dev    UNAUDITED. Testnet only. Splits push-pay on receipt; recipients are
///         set per swarm and must sum to 10000 bps. No autonomous withdrawal —
///         funds in equal funds out, atomically, per call.
contract RoyaltyRouter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant BPS_TOTAL = 10_000;

    struct Recipient {
        address account;
        uint96 bps;
    }

    /// @dev swarmId => ordered recipients (creator, platform, treasury, ...).
    mapping(bytes32 => Recipient[]) private _recipients;

    event RecipientsSet(bytes32 indexed swarmId, uint256 count);
    event RoutedNative(bytes32 indexed swarmId, address indexed payer, uint256 amount);
    event RoutedERC20(bytes32 indexed swarmId, address indexed token, address indexed payer, uint256 amount);
    event Paid(bytes32 indexed swarmId, address indexed to, uint256 amount);

    error NoRecipients();
    error BadSplit(uint256 sum);
    error ZeroAmount();
    error ZeroAddress();
    error NativeTransferFailed(address to);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Define the split for a swarm. bps must sum to exactly 10000.
    function setRecipients(bytes32 swarmId, Recipient[] calldata recips) external onlyOwner {
        if (recips.length == 0) revert NoRecipients();
        uint256 sum;
        for (uint256 i; i < recips.length; ++i) {
            if (recips[i].account == address(0)) revert ZeroAddress();
            sum += recips[i].bps;
        }
        if (sum != BPS_TOTAL) revert BadSplit(sum);

        delete _recipients[swarmId];
        for (uint256 i; i < recips.length; ++i) {
            _recipients[swarmId].push(recips[i]);
        }
        emit RecipientsSet(swarmId, recips.length);
    }

    /// @notice Route native-token payment for a swarm, splitting it immediately.
    function routeNative(bytes32 swarmId) external payable nonReentrant {
        if (msg.value == 0) revert ZeroAmount();
        Recipient[] storage recips = _recipients[swarmId];
        if (recips.length == 0) revert NoRecipients();

        uint256 distributed;
        for (uint256 i; i < recips.length; ++i) {
            uint256 share = i == recips.length - 1
                ? msg.value - distributed // last recipient absorbs rounding dust
                : (msg.value * recips[i].bps) / BPS_TOTAL;
            distributed += share;
            if (share > 0) {
                (bool ok,) = recips[i].account.call{value: share}("");
                if (!ok) revert NativeTransferFailed(recips[i].account);
                emit Paid(swarmId, recips[i].account, share);
            }
        }
        emit RoutedNative(swarmId, msg.sender, msg.value);
    }

    /// @notice Route an ERC-20 (e.g. USDC) payment. Caller must approve first.
    function routeERC20(bytes32 swarmId, address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        Recipient[] storage recips = _recipients[swarmId];
        if (recips.length == 0) revert NoRecipients();

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 distributed;
        for (uint256 i; i < recips.length; ++i) {
            uint256 share = i == recips.length - 1
                ? amount - distributed
                : (amount * recips[i].bps) / BPS_TOTAL;
            distributed += share;
            if (share > 0) {
                IERC20(token).safeTransfer(recips[i].account, share);
                emit Paid(swarmId, recips[i].account, share);
            }
        }
        emit RoutedERC20(swarmId, token, msg.sender, amount);
    }

    function recipientsOf(bytes32 swarmId) external view returns (Recipient[] memory) {
        return _recipients[swarmId];
    }
}
