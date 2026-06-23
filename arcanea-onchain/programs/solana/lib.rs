// SPDX-License-Identifier: CC-BY-NC-4.0
//! Anchor program skeleton for the Arcanea swarm marketplace on Solana (Wave 4).
//!
//! UNAUDITED. DEVNET ONLY. Mirrors the EVM contracts: a license NFT bound to a
//! swarm_id, and a royalty router that splits SPL-token payments by basis points.
//! Same human gates as the EVM workspace (no mainnet, no real funds/keys without
//! explicit human approval).
//!
//! This is an intentionally minimal skeleton: account contexts + the load-bearing
//! bps-split invariant. Full implementation (Metaplex CPI mint, SPL transfers)
//! lands when EVM testnet is proven.

use anchor_lang::prelude::*;

declare_id!("Aswrm1111111111111111111111111111111111111");

pub const BPS_TOTAL: u16 = 10_000;

#[program]
pub mod arcanea_swarm {
    use super::*;

    /// Register a swarm's revenue split. `bps` must sum to exactly 10000.
    pub fn set_recipients(ctx: Context<SetRecipients>, recipients: Vec<Recipient>) -> Result<()> {
        require!(!recipients.is_empty(), SwarmError::NoRecipients);
        // Account space is allocated for at most 8 recipients (see SetRecipients).
        require!(recipients.len() <= 8, SwarmError::TooManyRecipients);
        let sum: u32 = recipients.iter().map(|r| r.bps as u32).sum();
        require!(sum as u16 == BPS_TOTAL, SwarmError::BadSplit);

        let split = &mut ctx.accounts.split;
        split.swarm_id = ctx.accounts.swarm_id_seed.key();
        split.recipients = recipients;
        Ok(())
    }

    /// Route an SPL-token payment for a swarm, splitting it by bps.
    /// (CPI transfers to each recipient's token account are added in Wave 4.)
    pub fn route_spl(ctx: Context<RouteSpl>, amount: u64) -> Result<()> {
        require!(amount > 0, SwarmError::ZeroAmount);
        let split = &ctx.accounts.split;
        require!(!split.recipients.is_empty(), SwarmError::NoRecipients);

        // Invariant check mirrored from EVM RoyaltyRouter: compute shares with the
        // last recipient absorbing rounding dust. SPL CPI transfers: Wave 4.
        let mut distributed: u64 = 0;
        let n = split.recipients.len();
        for (i, r) in split.recipients.iter().enumerate() {
            let share = if i == n - 1 {
                amount - distributed
            } else {
                amount.checked_mul(r.bps as u64).unwrap() / BPS_TOTAL as u64
            };
            distributed += share;
            // TODO(Wave 4): token::transfer CPI to r's associated token account.
        }
        require!(distributed == amount, SwarmError::BadSplit);
        Ok(())
    }

    /// Mint a license NFT bound to `swarm_id` (Metaplex CPI added in Wave 4).
    pub fn mint_license(_ctx: Context<MintLicense>, _swarm_id: [u8; 32]) -> Result<()> {
        // TODO(Wave 4): Metaplex token-metadata CPI; bind swarm_id in metadata.
        Ok(())
    }
}

#[account]
pub struct SwarmSplit {
    pub swarm_id: Pubkey,
    pub recipients: Vec<Recipient>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Recipient {
    pub account: Pubkey,
    pub bps: u16,
}

#[derive(Accounts)]
pub struct SetRecipients<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 4 + (32 + 2) * 8)]
    pub split: Account<'info, SwarmSplit>,
    /// CHECK: seed marker for the swarm id.
    pub swarm_id_seed: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RouteSpl<'info> {
    pub split: Account<'info, SwarmSplit>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct MintLicense<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[error_code]
pub enum SwarmError {
    #[msg("no recipients configured for this swarm")]
    NoRecipients,
    #[msg("recipient bps must sum to exactly 10000")]
    BadSplit,
    #[msg("at most 8 recipients are supported")]
    TooManyRecipients,
    #[msg("amount must be greater than zero")]
    ZeroAmount,
}
