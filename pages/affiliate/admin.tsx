/**
 * BTP Growth — Admin Payout Management Page
 * /affiliate/admin
 * 
 * Premium admin interface for viewing and managing payout requests.
 * Protected by admin secret.
 */
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type PayoutWithAffiliate = {
  id: string
  affiliate_id: string
  amount: string
  payout_method: string
  payout_email: string
  status: string
  admin_notes: string | null
  requested_at: string
  completed_at: string | null
  affiliates: {
    display_name: string
    email: string
    referral_code: string
    source_app: string
    source_user_id: string
  }
}

export default function AdminPayoutsPage() {
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [payouts, setPayouts] = useState<PayoutWithAffiliate[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('requested')
  const [error, setError] = useState('')

  const fetchPayouts = async (status?: string) => {
    setLoading(true)
    setError('')
    try {
      const url = status ? `/api/affiliate/admin-payouts?status=${status}` : '/api/affiliate/admin-payouts'
      const res = await fetch(url, {
        headers: { 'x-admin-secret': secret },
      })
      if (res.status === 403) {
        setError('Invalid admin secret. Please check your credentials.')
        setAuthenticated(false)
        return
      }
      const data = await res.json()
      setPayouts(data.payouts || [])
      setAuthenticated(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updatePayoutStatus = async (payoutId: string, newStatus: string, notes?: string) => {
    try {
      const res = await fetch('/api/affiliate/admin-payouts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({
          payout_id: payoutId,
          status: newStatus,
          admin_notes: notes,
        }),
      })
      if (res.ok) {
        fetchPayouts(filter)
      }
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Admin Gateway | BTP Growth</title>
        </Head>
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 overflow-hidden">
          {/* Subtle Tech Pattern Background */}
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
          {/* Glowing Orbs for Premium feel */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-multiply opacity-50 z-0 pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 z-0 pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[2rem] border border-white/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center p-4 mx-auto mb-6 shadow-xl shadow-slate-900/10">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>

              <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Admin Gateway</h1>
              <p className="text-slate-500 text-sm mb-8">Enter your master password to access the BTP Growth payout management system.</p>
              
              <div className="text-left space-y-5">
                <div className="relative">
                  <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchPayouts('requested')}
                    placeholder="Admin Secret..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-medium tracking-wider"
                  />
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <p className="text-red-500 text-sm font-semibold bg-red-50 py-3 rounded-lg text-center border border-red-100">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button
                  onClick={() => fetchPayouts('requested')}
                  disabled={loading || !secret}
                  className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none mt-2 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      Secure Login
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Payout Control Center | BTP Growth</title>
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        {/* Admin Topbar */}
        <div className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Payout Control Center</h1>
                <p className="text-xs text-slate-400 font-mono">BTP_GROWTH_ADMIN</p>
              </div>
            </div>
            <button 
              onClick={() => { setAuthenticated(false); setSecret(''); setPayouts([]); }}
              className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/5"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Payouts</h2>
            
            {/* Filter Pills */}
            <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
              {['requested', 'processing', 'completed', 'failed'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setFilter(s); fetchPayouts(s) }}
                  className={`px-6 py-2.5 text-sm font-bold rounded-lg capitalize transition-all whitespace-nowrap ${
                    filter === s 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {s}
                  {filter === s && payouts.length > 0 && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{payouts.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payout Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Fetching records...</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto mt-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                <span className="text-4xl">😴</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No {filter} payouts found</h3>
              <p className="text-slate-500">There are currently no payout requests in this category. Check back later or select another filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {payouts.map((p) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={p.id} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {/* Card Header (Amount & Status) */}
                  <div className={`p-6 border-b border-slate-100 flex items-start justify-between ${
                    p.status === 'completed' ? 'bg-emerald-50/50' :
                    p.status === 'requested' ? 'bg-amber-50/50' :
                    p.status === 'processing' ? 'bg-blue-50/50' :
                    'bg-red-50/50'
                  }`}>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Payout Amount</p>
                      <p className="font-black text-4xl text-slate-900 tracking-tight">${parseFloat(p.amount).toFixed(2)}</p>
                    </div>
                    <span className={`text-xs px-4 py-2 rounded-full font-extrabold uppercase tracking-wider shadow-sm border ${
                      p.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      p.status === 'requested' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      p.status === 'processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  {/* Affiliate Info & Dates */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Affiliate</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{p.affiliates?.display_name || 'Unknown User'}</span>
                          <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-600">
                            {p.affiliates?.referral_code}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">PayPal Account</p>
                        <p className="font-semibold text-blue-600 break-all">{p.payout_email}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Requested</p>
                        <p className="font-medium text-slate-700 text-sm">{new Date(p.requested_at).toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Platform Used</p>
                        <p className="font-medium text-slate-700 text-sm capitalize">{p.affiliates?.source_app.replace('_', ' ')}</p>
                      </div>
                      
                      {p.admin_notes && (
                        <div className="col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Admin Log</p>
                          <p className="text-sm font-medium text-slate-700 italic">"{p.admin_notes}"</p>
                        </div>
                      )}
                    </div>

                    {/* Action Panel */}
                    {(p.status === 'requested' || p.status === 'processing') && (
                      <div className="pt-5 border-t border-slate-100 flex flex-wrap gap-3">
                        {p.status === 'requested' && (
                          <button
                            onClick={() => updatePayoutStatus(p.id, 'processing', 'Processing PayPal transfer')}
                            className="flex-1 bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all text-sm"
                          >
                            Mark Processing
                          </button>
                        )}
                        <button
                          onClick={() => updatePayoutStatus(p.id, 'completed', `Completed transfer to PayPal on ${new Date().toLocaleDateString()}`)}
                          className={`flex-1 bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-sm ${p.status === 'processing' ? 'w-full' : ''}`}
                        >
                          Confirm Paid
                        </button>
                        {p.status === 'requested' && (
                          <button
                            onClick={() => {
                              const note = window.prompt("Reason for rejection?") || 'Rejected by admin'
                              updatePayoutStatus(p.id, 'failed', note)
                            }}
                            className="bg-white text-red-600 border border-slate-200 font-semibold py-3 px-5 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all text-sm"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
