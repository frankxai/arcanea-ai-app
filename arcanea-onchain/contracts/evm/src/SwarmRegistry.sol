// SPDX-License-Identifier: CC-BY-NC-4.0
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SwarmRegistry
/// @notice On-chain index of licensable Arcanea swarms. Each entry mirrors a
///         `@arcanea/swarm-protocol` Swarm Package Manifest pinned off-chain
///         (IPFS/Arweave). The manifest is the source of truth for topology,
///         agents, and the royalty split; this registry stores the minimal
///         coordinates the marketplace + license contract need on-chain.
/// @dev    UNAUDITED. Testnet only. Not for mainnet or real funds until audited
///         and explicitly human-approved. No funds are ever held here.
contract SwarmRegistry is Ownable {
    struct Swarm {
        /// @dev ipfs:// or ar:// URI of the canonical manifest JSON.
        string manifestURI;
        /// @dev FNV/keccak fingerprint of the canonical manifest, for integrity.
        bytes32 manifestHash;
        /// @dev Address entitled to the creator share of revenue.
        address creator;
        /// @dev Mint price for a license, in the settlement token's smallest unit.
        uint256 licensePrice;
        /// @dev Per-invocation price for metered usage.
        uint256 perCallPrice;
        /// @dev Whether the swarm is currently listed.
        bool active;
        /// @dev True once registered (distinguishes from a zeroed slot).
        bool exists;
    }

    /// @dev swarmId = keccak256(manifest.id). Stable across chains.
    mapping(bytes32 => Swarm) private _swarms;
    bytes32[] private _ids;

    event SwarmRegistered(bytes32 indexed swarmId, address indexed creator, string manifestURI);
    event SwarmUpdated(bytes32 indexed swarmId, string manifestURI, bytes32 manifestHash);
    event SwarmPriced(bytes32 indexed swarmId, uint256 licensePrice, uint256 perCallPrice);
    event SwarmActiveSet(bytes32 indexed swarmId, bool active);

    error AlreadyRegistered();
    error NotRegistered();
    error NotCreatorOrOwner();
    error ZeroCreator();

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyCreatorOrOwner(bytes32 swarmId) {
        Swarm storage s = _swarms[swarmId];
        if (!s.exists) revert NotRegistered();
        if (msg.sender != s.creator && msg.sender != owner()) revert NotCreatorOrOwner();
        _;
    }

    /// @notice Register a new swarm SKU.
    function registerSwarm(
        bytes32 swarmId,
        string calldata manifestURI,
        bytes32 manifestHash,
        address creator,
        uint256 licensePrice,
        uint256 perCallPrice
    ) external onlyOwner {
        if (_swarms[swarmId].exists) revert AlreadyRegistered();
        if (creator == address(0)) revert ZeroCreator();
        _swarms[swarmId] = Swarm({
            manifestURI: manifestURI,
            manifestHash: manifestHash,
            creator: creator,
            licensePrice: licensePrice,
            perCallPrice: perCallPrice,
            active: true,
            exists: true
        });
        _ids.push(swarmId);
        emit SwarmRegistered(swarmId, creator, manifestURI);
        emit SwarmPriced(swarmId, licensePrice, perCallPrice);
    }

    /// @notice Update the manifest pointer (e.g. a new version pinned).
    function updateManifest(bytes32 swarmId, string calldata manifestURI, bytes32 manifestHash)
        external
        onlyCreatorOrOwner(swarmId)
    {
        Swarm storage s = _swarms[swarmId];
        s.manifestURI = manifestURI;
        s.manifestHash = manifestHash;
        emit SwarmUpdated(swarmId, manifestURI, manifestHash);
    }

    /// @notice Update pricing for both money models.
    function setPricing(bytes32 swarmId, uint256 licensePrice, uint256 perCallPrice)
        external
        onlyCreatorOrOwner(swarmId)
    {
        Swarm storage s = _swarms[swarmId];
        s.licensePrice = licensePrice;
        s.perCallPrice = perCallPrice;
        emit SwarmPriced(swarmId, licensePrice, perCallPrice);
    }

    /// @notice List / delist a swarm.
    function setActive(bytes32 swarmId, bool active) external onlyCreatorOrOwner(swarmId) {
        _swarms[swarmId].active = active;
        emit SwarmActiveSet(swarmId, active);
    }

    function getSwarm(bytes32 swarmId) external view returns (Swarm memory) {
        if (!_swarms[swarmId].exists) revert NotRegistered();
        return _swarms[swarmId];
    }

    function exists(bytes32 swarmId) external view returns (bool) {
        return _swarms[swarmId].exists;
    }

    function totalSwarms() external view returns (uint256) {
        return _ids.length;
    }

    function swarmIdAt(uint256 index) external view returns (bytes32) {
        return _ids[index];
    }
}
