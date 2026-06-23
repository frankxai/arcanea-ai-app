// SPDX-License-Identifier: CC-BY-NC-4.0
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {SwarmRegistry} from "./SwarmRegistry.sol";
import {RoyaltyRouter} from "./RoyaltyRouter.sol";

/// @title SwarmLicense
/// @notice ERC-721 license to run an Arcanea swarm. Holding a token = the right
///         to run the swarm whose `swarmId` it carries. Primary mint proceeds
///         route through the RoyaltyRouter (creator/platform/treasury split);
///         EIP-2981 governs secondary-sale royalties. tokenURI resolves to the
///         swarm's pinned manifest in the registry.
/// @dev    UNAUDITED. Testnet only. Mint price + token come from the registry +
///         deploy config; no mainnet, no real funds until audited and approved.
contract SwarmLicense is ERC721, ERC2981, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    SwarmRegistry public immutable registry;
    RoyaltyRouter public immutable router;
    /// @dev Settlement token for mint (USDC). address(0) => native.
    address public immutable settlementToken;

    uint256 private _nextId = 1;
    mapping(uint256 => bytes32) public swarmOf; // tokenId => swarmId

    event LicenseMinted(uint256 indexed tokenId, bytes32 indexed swarmId, address indexed to, uint256 price);

    error NotActive();
    error WrongPayment(uint256 expected, uint256 sent);

    constructor(
        address initialOwner,
        SwarmRegistry _registry,
        RoyaltyRouter _router,
        address _settlementToken
    ) ERC721("Arcanea Swarm License", "ASWARM") Ownable(initialOwner) {
        registry = _registry;
        router = _router;
        settlementToken = _settlementToken;
    }

    /// @notice Mint a license for `swarmId`, paying its registry license price in
    ///         the native token. Proceeds are split via the router.
    function mintNative(bytes32 swarmId, address to) external payable nonReentrant returns (uint256 tokenId) {
        SwarmRegistry.Swarm memory s = registry.getSwarm(swarmId);
        if (!s.active) revert NotActive();
        if (msg.value != s.licensePrice) revert WrongPayment(s.licensePrice, msg.value);

        tokenId = _issue(swarmId, to, s.creator, s.licensePrice);
        // Free swarms (price 0) skip routing — the router rejects zero-value sends.
        if (msg.value > 0) {
            router.routeNative{value: msg.value}(swarmId);
        }
    }

    /// @notice Mint a license paying in the ERC-20 settlement token (USDC).
    ///         Caller must approve this contract for the license price first.
    function mintERC20(bytes32 swarmId, address to) external nonReentrant returns (uint256 tokenId) {
        SwarmRegistry.Swarm memory s = registry.getSwarm(swarmId);
        if (!s.active) revert NotActive();

        tokenId = _issue(swarmId, to, s.creator, s.licensePrice);
        // Free swarms (price 0) mint without settlement. A priced swarm requires a
        // configured ERC-20 settlement token.
        if (s.licensePrice > 0) {
            if (settlementToken == address(0)) revert WrongPayment(s.licensePrice, 0);
            // Pull funds in, approve the router, and let it split.
            IERC20(settlementToken).safeTransferFrom(msg.sender, address(this), s.licensePrice);
            IERC20(settlementToken).forceApprove(address(router), s.licensePrice);
            router.routeERC20(swarmId, settlementToken, s.licensePrice);
        }
    }

    function _issue(bytes32 swarmId, address to, address creator, uint256 price)
        internal
        returns (uint256 tokenId)
    {
        tokenId = _nextId++;
        swarmOf[tokenId] = swarmId;
        _safeMint(to, tokenId);
        // EIP-2981: secondary royalty to the creator. bps comes from deploy config
        // per token via setTokenRoyalty if desired; default set at deploy time.
        _setTokenRoyalty(tokenId, creator, _defaultRoyaltyBps);
        emit LicenseMinted(tokenId, swarmId, to, price);
    }

    uint96 private _defaultRoyaltyBps = 500; // 5% default; owner-tunable

    function setDefaultRoyaltyBps(uint96 bps) external onlyOwner {
        _defaultRoyaltyBps = bps;
    }

    /// @notice True if `holder` owns at least one license for `swarmId`.
    /// @dev O(n) over the holder's tokens via enumeration is avoided; callers
    ///      should track tokenIds off-chain. This convenience checks a known id.
    function isLicensedToken(uint256 tokenId, bytes32 swarmId, address holder) external view returns (bool) {
        return _ownerOf(tokenId) == holder && swarmOf[tokenId] == swarmId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return registry.getSwarm(swarmOf[tokenId]).manifestURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
