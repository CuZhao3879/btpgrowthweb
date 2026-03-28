/**
 * BTP Growth — Affiliate Dashboard Page
 * /affiliate/dashboard
 */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

type DashboardData = {
  affiliate: {
    id: string
    referral_code: string
    tier: string
    display_name: string
    email: string
    payout_email: string
    total_paid_referrals: number
    balance_pending: number
    balance_cleared: number
  }
  stats: {
    total_referrals: number
    paid_referrals: number
    monthly_earnings: number
    total_earnings: number
    direct_team_size: number
  }
  tier_progress: {
    current_tier: string
    next_tier: string | null
    current_count: number
    required_count?: number
    remaining?: number
    message?: string
  }
  recent_commissions: Array<{
    id: string
    commission_amount: string
    commission_level: number
    commission_rate: string
    gross_revenue: string
    status: string
    created_at: string
  }>
  direct_team: Array<{
    id: string
    display_name: string
    referral_code: string
    tier: string
    total_paid_referrals: number
    created_at: string
  }>
  payouts: Array<{
    id: string
    amount: string
    payout_email: string
    status: string
    requested_at: string
    completed_at: string | null
  }>
}

const TIER_CONFIG: Record<string, { label: string; icon: string; color: string; t1: string; t2: string; req: string }> = {
  starter: { label: 'Starter', icon: '🥉', color: '#CD7F32', t1: '15%', t2: '-', req: 'starter' },
  pro: { label: 'Pro', icon: '🥈', color: '#C0C0C0', t1: '15%', t2: '5%', req: 'pro' },
  elite: { label: 'Elite', icon: '🥇', color: '#FFD700', t1: '20%', t2: '5%', req: 'elite' },
  partner: { label: 'Partner', icon: '💎', color: '#B9F2FF', t1: '25%', t2: '5%', req: 'partner' },
}

export default function AffiliateDashboardPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState<'login' | 'dashboard'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loginApp, setLoginApp] = useState('monvo_ai')
  const [loginUserId, setLoginUserId] = useState('')
  const [payoutEmail, setPayoutEmail] = useState('')
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [payoutMessage, setPayoutMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'team' | 'payouts'>('overview')

  const handleLogin = async () => {
    if (!loginUserId.trim()) {
      setError(t('affiliate.login.errorEmpty'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/affiliate/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_app: loginApp, login_id: loginUserId.trim() }),
      })
      if (res.ok) {
        const dashData = await res.json()
        setData(dashData)
        setStep('dashboard')
      } else if (res.status === 404) {
        setError(t('affiliate.login.errorNotFound'))
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError(t('affiliate.login.errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async () => {
    if (!payoutEmail.trim() || !payoutEmail.includes('@')) {
      setPayoutMessage('Please enter a valid PayPal email')
      return
    }
    setPayoutLoading(true)
    setPayoutMessage('')
    try {
      const res = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_app: loginApp,
          login_id: loginUserId.trim(),
          payout_email: payoutEmail.trim(),
        }),
      })
      const result = await res.json()
      if (res.ok) {
        setPayoutMessage(`✅ Payout of $${result.payout.amount.toFixed(2)} requested successfully!`)
        handleLogin()
      } else {
        setPayoutMessage(`❌ ${result.error}`)
      }
    } catch {
      setPayoutMessage('Network error')
    } finally {
      setPayoutLoading(false)
    }
  }

  const tierConfig = data ? TIER_CONFIG[data.affiliate.tier] || TIER_CONFIG.starter : TIER_CONFIG.starter

  // LOGIN VIEW
  if (step === 'login') {
    return (
      <>
        <Head>
          <title>Affiliate Login | BTP Growth</title>
          <meta name="description" content="View your affiliate earnings, referrals, and manage payouts on BTP Growth" />
        </Head>
        <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-400/10 blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden mb-5">
                  <Image
                    src="/images/logo.png"
                    alt="BTP Growth Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('affiliate.login.title')}</h1>
                <p className="text-slate-500 text-sm mt-2 text-center">{t('affiliate.login.subtitle')}</p>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('affiliate.login.selectApp')}</label>
                  <div className="relative">
                    <select
                      value={loginApp}
                      onChange={(e) => setLoginApp(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                    >
                      <option value="monvo_ai">Monvo AI</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('affiliate.login.userId')}</label>
                  <input
                    type="text"
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    placeholder={t('affiliate.login.userIdPlaceholder')}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                  <p className="text-[13px] text-slate-500 mt-2 ml-1">
                    {t('affiliate.login.userIdHint')}
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-start gap-2"
                    >
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-md mt-6"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('affiliate.login.authenticating')}
                      </>
                    ) : (
                      <>
                        {t('affiliate.login.button')}
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  // DASHBOARD VIEW
  if (!data) return null

  return (
    <>
      <Head>
        <title>Dashboard — {data.affiliate.display_name || 'Affiliate'} | BTP Growth</title>
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-16">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.png" alt="BTP Growth" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{t('affiliate.dashboard.title')}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 pr-4 pl-1.5 py-1.5 rounded-full border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-sm font-bold text-blue-600">
                {(data.affiliate.display_name || 'A')[0].toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{data.affiliate.display_name || 'Affiliate'}</p>
                <p className="text-[11px] font-mono text-slate-500 leading-tight">{data.affiliate.referral_code}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-[138px] sm:top-[146px] z-20">
          <div className="max-w-6xl mx-auto px-4 flex gap-6 overflow-x-auto no-scrollbar">
            {(['overview', 'commissions', 'team', 'payouts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-semibold border-b-2 transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {t(`affiliate.dashboard.tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {[
                    { label: t('affiliate.dashboard.stats.monthlyEarnings'), value: `$${data.stats.monthly_earnings.toFixed(2)}`, color: 'text-slate-900', icon: '💰' },
                    { label: t('affiliate.dashboard.stats.availableBalance'), value: `$${data.affiliate.balance_cleared.toFixed(2)}`, color: 'text-emerald-600', icon: '✅' },
                    { label: t('affiliate.dashboard.stats.pendingClear'), value: `$${data.affiliate.balance_pending.toFixed(2)}`, color: 'text-amber-500', icon: '⏳' },
                    { label: t('affiliate.dashboard.stats.paidReferrals'), value: `${data.stats.paid_referrals}`, color: 'text-slate-900', icon: '👥' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <span className="text-xl">{stat.icon}</span>
                      </div>
                      <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Tier & Code */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Tier Progress */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-semibold text-slate-900">{t('affiliate.dashboard.tier.title')}</h3>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-4 py-1.5 rounded-full text-sm font-bold text-slate-800 shadow-sm border border-slate-200/50">
                        {tierConfig.icon} {tierConfig.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-1">{t('affiliate.dashboard.tier.direct')}</p>
                        <p className="text-xl font-bold text-slate-900">{tierConfig.t1}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-1">{t('affiliate.dashboard.tier.indirect')}</p>
                        <p className="text-xl font-bold text-slate-900">{tierConfig.t2}</p>
                      </div>
                    </div>

                    {data.tier_progress.next_tier ? (
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-sm font-medium text-slate-600">{t('affiliate.dashboard.tier.progressTo')} {data.tier_progress.next_tier}</p>
                          <p className="text-xs font-semibold text-blue-600">
                            {data.tier_progress.current_count} / {data.tier_progress.required_count}
                          </p>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((data.tier_progress.current_count / (data.tier_progress.required_count || 1)) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-blue-600 h-full rounded-full"
                          />
                        </div>
                        <p className="text-sm text-slate-500">
                          {t('affiliate.dashboard.tier.inviteMore')} <span className="font-semibold text-slate-900">{data.tier_progress.remaining}</span> {t('affiliate.dashboard.tier.remaining')}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl shrink-0">🎉</div>
                        <div>
                          <p className="text-sm font-bold text-emerald-800">{t('affiliate.dashboard.tier.maxReached')}</p>
                          <p className="text-xs text-emerald-600 mt-0.5">{t('affiliate.dashboard.tier.maxDesc')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Referral Code */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 className="text-base font-semibold text-slate-900 mb-1">{t('affiliate.dashboard.referral.title')}</h3>
                    <p className="text-sm text-slate-500 mb-6">{t('affiliate.dashboard.referral.subtitle')}</p>
                    
                    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center mb-6">
                      <p className="text-4xl sm:text-5xl font-extrabold tracking-widest text-slate-900">{data.affiliate.referral_code}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(data.affiliate.referral_code)
                        // Could add a toast notification here
                      }}
                      className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      {t('affiliate.dashboard.referral.copyButton')}
                    </button>
                  </div>
                </div>

                {/* Tier Structure Info */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
                  <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    {t('affiliate.dashboard.tierStructure.title')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(TIER_CONFIG).map(([key, tier], idx) => (
                      <div key={key} className={`rounded-xl p-5 border ${data.affiliate.tier === key ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900">{tier.icon} {tier.label}</span>
                          <span className="text-xs font-semibold text-slate-500 uppercase bg-slate-200/50 px-2 py-0.5 rounded">{t('affiliate.dashboard.tierStructure.level')} {idx + 1}</span>
                        </div>
                        <div className="mb-3">
                          <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full inline-block">{t('affiliate.dashboard.tierStructure.require')} {tier.req === 'starter' ? '0' : tier.req === 'pro' ? '10' : tier.req === 'elite' ? '50' : '100'} {t('affiliate.dashboard.tierStructure.users')}</span>
                        </div>
                        <div className="space-y-1 text-sm pt-2 border-t border-slate-200/60">
                          <p className="flex justify-between"><span className="text-slate-500">{t('affiliate.dashboard.tierStructure.direct')}</span> <span className="font-semibold text-slate-900">{tier.t1}</span></p>
                          <p className="flex justify-between"><span className="text-slate-500">{t('affiliate.dashboard.tierStructure.indirect')}</span> <span className="font-semibold text-slate-900">{tier.t2}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'commissions' && (
              <motion.div
                key="commissions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Commission History</h3>
                {data.recent_commissions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📈</div>
                    <p className="text-slate-900 font-semibold mb-1">No commissions yet</p>
                    <p className="text-slate-500 text-sm">Share your referral code to start earning from subscriptions.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden custom-scrollbar">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                            <th className="text-left px-6 py-4 font-semibold">Date</th>
                            <th className="text-left px-6 py-4 font-semibold">Gross Revenue</th>
                            <th className="text-left px-6 py-4 font-semibold">Rate</th>
                            <th className="text-left px-6 py-4 font-semibold">Commission</th>
                            <th className="text-center px-6 py-4 font-semibold">Level</th>
                            <th className="text-right px-6 py-4 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.recent_commissions.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium">
                                {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-600">${parseFloat(c.gross_revenue).toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-600">{(parseFloat(c.commission_rate) * 100).toFixed(0)}%</td>
                              <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">${parseFloat(c.commission_amount).toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${c.commission_level === 1 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                  Tier {c.commission_level}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                  c.status === 'cleared' ? 'bg-emerald-100 text-emerald-700' :
                                  c.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  c.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {c.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Your Network</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{data.direct_team.length} Members</span>
                </div>
                
                {data.direct_team.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
                    <p className="text-slate-900 font-semibold mb-1">No team members yet</p>
                    <p className="text-slate-500 text-sm">When someone registers using your code, they will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.direct_team.map((member) => (
                      <div key={member.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
                              {(member.display_name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight mb-0.5">{member.display_name || 'Anonymous'}</p>
                              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">Joined {new Date(member.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-semibold text-slate-700 flex items-center gap-1.5">
                            {TIER_CONFIG[member.tier]?.icon} {TIER_CONFIG[member.tier]?.label}
                          </span>
                          <p className="text-sm font-semibold text-slate-700"><span className="text-blue-600">{member.total_paid_referrals}</span> referrals</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'payouts' && (
              <motion.div
                key="payouts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Request Payout Section */}
                <div className="lg:col-span-1 border border-slate-200 shadow-sm mb-6 lg:mb-0">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-t-2xl p-6 text-white text-center rounded-b-none">
                    <p className="text-blue-100 text-sm font-medium mb-1.5">Available Balance</p>
                    <p className="text-4xl font-extrabold">${data.affiliate.balance_cleared.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-b-2xl">
                    <p className="text-sm text-slate-500 mb-5 text-center">
                      Minimum payout amount is <strong>$15.00</strong>. Payments are made via PayPal.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">PayPal Email Address</label>
                        <input
                          type="email"
                          value={payoutEmail}
                          onChange={(e) => setPayoutEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        />
                      </div>
                      <button
                        onClick={handleRequestPayout}
                        disabled={payoutLoading || data.affiliate.balance_cleared < 15}
                        className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 disabled:hover:bg-slate-900 disabled:shadow-none"
                      >
                        {payoutLoading ? 'Processing...' : 'Request Payout'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {payoutMessage && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className={`mt-4 p-3 rounded-xl text-sm font-medium flex items-start gap-2 ${payoutMessage.includes('❌') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}
                        >
                          <span>{payoutMessage.includes('❌') ? '⚠️' : '🎉'}</span>
                          <p>{payoutMessage.replace('❌ ', '').replace('✅ ', '')}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Payout History */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Payout History</h3>
                  {data.payouts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💸</div>
                      <p className="text-slate-900 font-semibold mb-1">No payout requests yet</p>
                      <p className="text-slate-500 text-sm">Once you request a payout, its status will appear here.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {data.payouts.map((p) => (
                          <div key={p.id} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                p.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                p.status === 'requested' ? 'bg-amber-100 text-amber-500' :
                                p.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </div>
                              <div>
                                <p className="font-bold text-xl text-slate-900">${parseFloat(p.amount).toFixed(2)}</p>
                                <p className="text-sm font-medium text-slate-600 mt-0.5">{p.payout_email}</p>
                                <p className="text-xs text-slate-500 mt-1">{new Date(p.requested_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="self-end sm:self-center">
                              <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm ${
                                p.status === 'completed' ? 'bg-emerald-500 text-white' :
                                p.status === 'requested' ? 'bg-amber-500 text-white' :
                                p.status === 'processing' ? 'bg-blue-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                {p.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
