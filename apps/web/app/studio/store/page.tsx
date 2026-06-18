/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { AccountAbstractionService } from '@/lib/web3/account-abstraction';
import { StoryProtocolService } from '@/lib/web3/story-protocol';
import {
  PhCpu,
  PhCrown,
  PhDatabase,
  PhCheckCircle,
  PhSpinner,
  PhLock,
  PhArrowUpRight,
  PhSparkle,
  PhCheck,
  PhCopy,
  PhArrowRight
} from '@/lib/phosphor-icons';
// @ts-ignore
import { Coins as PhCoins, Wallet as PhWallet } from '@phosphor-icons/react';

interface SkillItem {
  id: string;
  name: string;
  description: string;
  priceCredits: number;
  priceEth: string;
  author: string;
  tags: string[];
  type: string;
}

const AVAILABLE_SKILLS: SkillItem[] = [
  {
    id: 'cinematic-web-lab',
    name: 'Cinematic Web Lab',
    description: 'Premium scroll-triggered animations and luxury layout generators.',
    priceCredits: 120,
    priceEth: '0.005',
    author: 'FrankX Labs',
    tags: ['Motion', 'UX', 'Next.js'],
    type: 'Frontend'
  },
  {
    id: 'suno-mastery',
    name: 'Suno AI Mastery',
    description: 'Autonomous music composer and high-fidelity prompt architect.',
    priceCredits: 80,
    priceEth: '0.003',
    author: 'SunoConductor',
    tags: ['Audio', 'Prompting'],
    type: 'Media'
  },
  {
    id: 'feynman-thinking',
    name: 'Feynman Thinking Mode',
    description: 'Socratic reasoning loop for explaining complex codebases simply.',
    priceCredits: 50,
    priceEth: '0.002',
    author: 'Luminor Team',
    tags: ['Reasoning', 'Docs'],
    type: 'Core'
  },
  {
    id: 'swarm-orchestrator',
    name: 'Swarm Orchestrator Pro',
    description: 'Mesh swarm coordination with custom trajectory saving to AgentDB.',
    priceCredits: 200,
    priceEth: '0.008',
    author: 'FrankX Labs',
    tags: ['Swarms', 'AgentDB'],
    type: 'System'
  },
  {
    id: 'health-nutrition',
    name: 'Health & Nutrition Advisor',
    description: 'hyper-personalized bio-nutrition planner utilizing 2025 evidence-based journals.',
    priceCredits: 70,
    priceEth: '0.003',
    author: 'LongevityHub',
    tags: ['Advisor', 'Health'],
    type: 'Assistant'
  }
];

export default function ClawStorePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'credits' | 'developer'>('marketplace');
  const [credits, setCredits] = useState<number>(350);
  const [byokEnabled, setByokEnabled] = useState<boolean>(false);
  const [byokKey, setByokKey] = useState<string>('');
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Purchase/deploy simulation state
  const [processingSkillId, setProcessingSkillId] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<'credits' | 'onchain' | null>(null);
  const [txDetails, setTxDetails] = useState<{ hash: string; type: string } | null>(null);
  const [purchasedSkills, setPurchasedSkills] = useState<string[]>([]);

  // Stripe simulation state
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);

  // Developer payout simulation state
  const [stripeConnected, setStripeConnected] = useState<boolean>(false);
  const [payoutLoading, setPayoutLoading] = useState<boolean>(false);
  const [developerEarnings, setDeveloperEarnings] = useState({
    total: 3120,
    creatorShare: 2184,
    platformFee: 936,
    withdrawn: 1500,
    pending: 684
  });

  const aaService = new AccountAbstractionService();
  const storyService = new StoryProtocolService();

  useEffect(() => {
    if (user?.id) {
      loadSmartAccount();
    }
  }, [user]);

  const loadSmartAccount = async () => {
    if (!user?.id) return;
    setLoadingWallet(true);
    try {
      const wallet = await aaService.getOrCreateSmartAccount(user.id);
      setSmartAccount(wallet);
    } catch (err) {
      console.error('Failed to load Smart Contract wallet:', err);
    } finally {
      setLoadingWallet(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleBuyWithCredits = async (skill: SkillItem) => {
    if (credits < skill.priceCredits) {
      alert('Insufficient credits. Please top up in the Subscription tab.');
      return;
    }
    setProcessingSkillId(skill.id);
    setPurchaseType('credits');
    setTxDetails(null);

    // Simulate database lookup and credit deduction
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setCredits((prev) => prev - skill.priceCredits);
    setPurchasedSkills((prev) => [...prev, skill.id]);
    setProcessingSkillId(null);
    setPurchaseType(null);
    alert(`Successfully unlocked ${skill.name} via credits! It is now available in your CLI.`);
  };

  const handleDeployOnchain = async (skill: SkillItem) => {
    if (!smartAccount) {
      alert('Please connect your account to generate your smart contract wallet.');
      return;
    }

    setProcessingSkillId(skill.id);
    setPurchaseType('onchain');
    setTxDetails(null);

    try {
      // 1. Simulate ERC-1155 Purchase transaction sponsored via ZeroDev/Safe Paymaster
      const tx = await aaService.executeSponsoredTransaction(
        smartAccount,
        '0x5FbDB2315678afecb367f032d93F642f64180aa3', // ClawSkillLicense ERC-1155 Mock Address
        `0xmintLicense-${skill.id}`
      );

      // 2. Register asset as an IP Asset on Story Protocol PIL
      const ipAsset = await storyService.registerIPAsset(
        smartAccount,
        '0x5FbDB2315678afecb367f032d93F642f64180aa3', // NFT License Contract
        Math.floor(Math.random() * 10000), // Mock Token ID
        `ipfs://bafybeiclay-${skill.id}-metadata`
      );

      setTxDetails({
        hash: tx.txHash,
        type: 'Onchain + Story Protocol PIL Registration Complete'
      });
      setPurchasedSkills((prev) => [...prev, skill.id]);
    } catch (err) {
      console.error(err);
      alert('Transaction failed. Check console for details.');
    } finally {
      setProcessingSkillId(null);
      setPurchaseType(null);
    }
  };

  const handleStripePurchase = async (pkgId: string, cost: number, creditAmt: number) => {
    setStripeLoading(pkgId);
    // Simulate Stripe Checkout Redirect and Webhook settlement
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCredits((prev) => prev + creditAmt);
    setStripeLoading(null);
    alert(`Stripe Payment of $${cost} succeeded! Added ${creditAmt} credits to your account.`);
  };

  const handleConnectStripe = async () => {
    setPayoutLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStripeConnected(true);
    setPayoutLoading(false);
  };

  const handleWithdrawEarnings = async () => {
    if (developerEarnings.pending <= 0) return;
    setPayoutLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDeveloperEarnings((prev) => ({
      ...prev,
      withdrawn: prev.withdrawn + prev.pending,
      pending: 0
    }));
    setPayoutLoading(false);
    alert('Immediate Stripe Connect payout processed successfully!');
  };

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-24">
        {/* Header & Wallet Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/[0.06]">
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Arcanea Studio Store
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Acquire AI skills as NFT licenses, subscribe to SOTA credits, or manage developer earnings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Credits Display */}
            <div className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <PhCoins className="w-5 h-5 text-[var(--arc-brand-atlantean-teal)]" />
              <div>
                <div className="text-[10px] text-white/50 font-medium leading-none">CREDIT BALANCE</div>
                <div className="text-base font-bold text-white mt-1 leading-none">{credits} CR</div>
              </div>
            </div>

            {/* Smart Wallet Account */}
            <div className="flex items-center gap-3 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--arc-brand-cosmic-blue)]/10 to-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20">
              <PhWallet className="w-5 h-5 text-[var(--arc-brand-atlantean-teal)]" />
              {loadingWallet ? (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <PhSpinner className="w-4 h-4 animate-spin text-[var(--arc-brand-atlantean-teal)]" />
                  Deriving TBA...
                </div>
              ) : smartAccount ? (
                <div className="text-left">
                  <div className="text-[9px] text-[var(--arc-brand-atlantean-teal)] font-bold tracking-wider leading-none">
                    BASE SEPOLIA TBA
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 leading-none">
                    <span className="text-xs font-mono font-medium text-white/80">
                      {smartAccount.walletAddress.slice(0, 6)}...{smartAccount.walletAddress.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(smartAccount.walletAddress, 'wallet')}
                      className="text-white/40 hover:text-white/80 transition-colors"
                      title="Copy wallet address"
                    >
                      {copied === 'wallet' ? (
                        <PhCheck className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <PhCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={loadSmartAccount}
                  className="text-xs text-[var(--arc-brand-atlantean-teal)] hover:underline"
                >
                  Generate Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 mb-8 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-transparent text-[var(--arc-brand-atlantean-teal)] shadow-[inset_0_0_0_1px_rgba(0,188,212,0.2)]'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Skill Marketplace
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'credits'
                ? 'bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-transparent text-[var(--arc-brand-atlantean-teal)] shadow-[inset_0_0_0_1px_rgba(0,188,212,0.2)]'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Subscription & Credits
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'developer'
                ? 'bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-transparent text-[var(--arc-brand-atlantean-teal)] shadow-[inset_0_0_0_1px_rgba(0,188,212,0.2)]'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Developer Dashboard
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'marketplace' && (
          <div>
            {/* Store Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVAILABLE_SKILLS.map((skill) => {
                const isPurchased = purchasedSkills.includes(skill.id);
                const isProcessing = processingSkillId === skill.id;

                return (
                  <div
                    key={skill.id}
                    className="group flex flex-col justify-between rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06] hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_0_30px_rgba(0,188,212,0.05)] transition-all duration-300 p-5"
                  >
                    <div>
                      {/* Badge / Type */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--arc-brand-atlantean-teal)] px-2 py-0.5 rounded bg-[var(--arc-brand-atlantean-teal)]/10">
                          {skill.type}
                        </span>
                        <span className="text-xs text-white/40">by {skill.author}</span>
                      </div>

                      <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-white/60 mt-2 line-clamp-2 min-h-[32px]">
                        {skill.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {skill.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-white/40 bg-white/[0.04] px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/[0.05]">
                      {/* Price Section */}
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <span className="text-[10px] text-white/40 block">CREDITS PRICE</span>
                          <span className="text-lg font-bold text-white">{skill.priceCredits} CR</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-white/40 block">ONCHAIN LICENSE</span>
                          <span className="text-xs font-mono font-medium text-white/70">{skill.priceEth} ETH</span>
                        </div>
                      </div>

                      {/* Buy Buttons */}
                      {isPurchased ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                          <PhCheckCircle className="w-4.5 h-4.5" />
                          License Unlocked
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleBuyWithCredits(skill)}
                            disabled={!!processingSkillId}
                            className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isProcessing && purchaseType === 'credits' ? (
                              <>
                                <PhSpinner className="w-4 h-4 animate-spin text-white" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <PhCoins className="w-4 h-4 text-white/60" />
                                Buy with Credits
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeployOnchain(skill)}
                            disabled={!!processingSkillId}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-cosmic-blue)]/20 hover:from-[var(--arc-brand-atlantean-teal)]/30 hover:to-[var(--arc-brand-cosmic-blue)]/30 text-[var(--arc-brand-atlantean-teal)] text-xs font-semibold border border-[var(--arc-brand-atlantean-teal)]/30 hover:border-[var(--arc-brand-atlantean-teal)]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isProcessing && purchaseType === 'onchain' ? (
                              <>
                                <PhSpinner className="w-4 h-4 animate-spin text-[var(--arc-brand-atlantean-teal)]" />
                                Registering PIL Asset...
                              </>
                            ) : (
                              <>
                                <PhWallet className="w-4 h-4" />
                                Mint & PIL Register
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Contract Details Console */}
            {txDetails && (
              <div className="mt-12 p-5 rounded-xl bg-green-500/5 border border-green-500/10 text-sm">
                <div className="flex items-center gap-2.5 mb-2 text-green-400 font-semibold">
                  <PhCheckCircle className="w-5 h-5" />
                  Onchain Transaction Settled successfully (Paymaster Sponsored)
                </div>
                <div className="space-y-1.5 font-mono text-xs text-white/75 mt-3">
                  <div>
                    <span className="text-white/45">STATUS:</span> SUCCESS (ERC-6551 TBA Counterparty)
                  </div>
                  <div>
                    <span className="text-white/45">TX HASH:</span>{' '}
                    <span className="text-white/90 break-all">{txDetails.hash}</span>
                  </div>
                  <div>
                    <span className="text-white/45">PROVENANCE:</span> Story Protocol PIL Register, Base Sepolia L2
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="max-w-4xl mx-auto">
            {/* Subscription Tiers */}
            <h2 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              SOTA Credit Plans (Aggregated Multi-LLM Orchestration)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Tier 1 */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white/60">Free Tier</h3>
                  <div className="text-2xl font-bold mt-2">$0</div>
                  <p className="text-xs text-white/50 mt-1">Capped daily SOTA access</p>
                  <ul className="text-xs text-white/70 space-y-2.5 mt-6">
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> 20 daily credits
                    </li>
                    <li className="flex items-center gap-2 text-white/40">
                      <PhLock className="w-3.5 h-3.5" /> High-concurrency Swarms
                    </li>
                  </ul>
                </div>
                <button
                  disabled
                  className="w-full py-2 rounded-lg bg-white/5 text-white/40 text-xs font-semibold mt-8 cursor-default"
                >
                  Active Plan
                </button>
              </div>

              {/* Tier 2 */}
              <div className="rounded-xl bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)]/10 to-transparent border border-[var(--arc-brand-atlantean-teal)]/20 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(0,188,212,0.02)]">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--arc-brand-atlantean-teal)]">Premium</h3>
                    <span className="text-[9px] font-bold text-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-brand-atlantean-teal)]/10 px-2 py-0.5 rounded">
                      POPULAR
                    </span>
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    $19 <span className="text-xs font-normal text-white/40">/ mo</span>
                  </div>
                  <p className="text-xs text-white/50 mt-1">Ideal for daily creator workflow</p>
                  <ul className="text-xs text-white/70 space-y-2.5 mt-6">
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> 1,200 monthly credits
                    </li>
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> High-concurrency Swarms
                    </li>
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> Fast image & video lanes
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleStripePurchase('sub-premium', 19, 1200)}
                  disabled={!!stripeLoading}
                  className="w-full py-2 rounded-lg bg-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/80 text-black text-xs font-bold mt-8 transition-colors flex items-center justify-center gap-2"
                >
                  {stripeLoading === 'sub-premium' ? (
                    <PhSpinner className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Upgrade with Stripe'
                  )}
                </button>
              </div>

              {/* Tier 3 */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white/60">Pro Agent</h3>
                  <div className="text-2xl font-bold mt-2">
                    $49 <span className="text-xs font-normal text-white/40">/ mo</span>
                  </div>
                  <p className="text-xs text-white/50 mt-1">Unlimited pipelines & deep model logic</p>
                  <ul className="text-xs text-white/70 space-y-2.5 mt-6">
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> 3,500 monthly credits
                    </li>
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> Custom skill publishing
                    </li>
                    <li className="flex items-center gap-2">
                      <PhCheck className="w-3.5 h-3.5 text-[var(--arc-brand-atlantean-teal)]" /> Advanced model fine-tunes
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleStripePurchase('sub-pro', 49, 3500)}
                  disabled={!!stripeLoading}
                  className="w-full py-2 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-bold mt-8 transition-colors flex items-center justify-center gap-2"
                >
                  {stripeLoading === 'sub-pro' ? (
                    <PhSpinner className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Get Pro with Stripe'
                  )}
                </button>
              </div>
            </div>

            {/* BYOK Toggle */}
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <PhSparkle className="w-4 h-4 text-[var(--arc-brand-atlantean-teal)]" />
                    Bring Your Own Key (BYOK)
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Bypass daily quotas and credit consumption by supplying your own OpenRouter/Anthropic API keys.
                  </p>
                </div>
                <button
                  onClick={() => setByokEnabled(!byokEnabled)}
                  className={`w-12 h-6.5 rounded-full transition-colors flex items-center p-0.5 ${
                    byokEnabled ? 'bg-[var(--arc-brand-atlantean-teal)]' : 'bg-white/10'
                  }`}
                  aria-label="Toggle Bring Your Own Key"
                >
                  <span
                    className={`w-5.5 h-5.5 rounded-full bg-black shadow-md transition-transform ${
                      byokEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {byokEnabled && (
                <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center gap-3">
                  <input
                    type="password"
                    placeholder="sk-or-v1-..."
                    value={byokKey}
                    onChange={(e) => setByokKey(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:border-[var(--arc-brand-atlantean-teal)]/40 focus:outline-none"
                  />
                  <button
                    onClick={() => alert('API Key saved successfully for local execution.')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg border border-white/5 transition-all"
                  >
                    Save Key
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'developer' && (
          <div className="max-w-4xl mx-auto">
            {/* Stripe Connect Link */}
            <div className="rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06] p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold">Creator Payout Splits (Stripe Connect)</h3>
                  <p className="text-xs text-white/55 mt-1">
                    List your agent skills on the Arcanea store. Get 70% payout splits on credit purchases.
                  </p>
                </div>
                <div>
                  {stripeConnected ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/25">
                      <PhCheckCircle className="w-4.5 h-4.5" />
                      Stripe Connect Linked
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectStripe}
                      disabled={payoutLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] hover:shadow-[0_0_20px_rgba(0,188,212,0.2)] text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                    >
                      {payoutLoading ? (
                        <PhSpinner className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Configure Stripe Connect
                          <PhArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Balance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/[0.06]">
                <div className="px-4 py-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <span className="text-[10px] text-white/40 block font-medium">TOTAL SALES</span>
                  <span className="text-base font-bold text-white mt-1 block">${developerEarnings.total}</span>
                </div>
                <div className="px-4 py-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <span className="text-[10px] text-white/40 block font-medium">CREATOR SHARE (70%)</span>
                  <span className="text-base font-bold text-white mt-1 block">${developerEarnings.creatorShare}</span>
                </div>
                <div className="px-4 py-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <span className="text-[10px] text-white/40 block font-medium">WITHDRAWN</span>
                  <span className="text-base font-bold text-green-400 mt-1 block">${developerEarnings.withdrawn}</span>
                </div>
                <div className="px-4 py-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <span className="text-[10px] text-white/40 block font-medium">PENDING PAYOUT</span>
                  <span className="text-base font-bold text-[var(--arc-brand-atlantean-teal)] mt-1 block">
                    ${developerEarnings.pending}
                  </span>
                </div>
              </div>

              {/* Withdraw Button */}
              {stripeConnected && developerEarnings.pending > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleWithdrawEarnings}
                    disabled={payoutLoading}
                    className="px-5 py-2.5 bg-white hover:bg-white/90 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                  >
                    {payoutLoading ? (
                      <PhSpinner className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <>
                        Withdraw Payout Split
                        <PhArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
