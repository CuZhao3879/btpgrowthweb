import type { NextApiRequest, NextApiResponse } from 'next'

type ExchangeRateResponse = {
  base: 'USD'
  target: 'MYR'
  rate: number
  source: string
  updatedAt: string
  cached: boolean
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 3
const FALLBACK_USD_TO_MYR = 4.7

let cachedRate: ExchangeRateResponse | null = null
let cachedAt = 0

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ExchangeRateResponse>
) {
  const now = Date.now()

  res.setHeader('Cache-Control', 's-maxage=259200, stale-while-revalidate=86400')

  if (cachedRate && now - cachedAt < CACHE_TTL_MS) {
    return res.status(200).json({ ...cachedRate, cached: true })
  }

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=MYR')

    if (!response.ok) {
      throw new Error(`Exchange API returned ${response.status}`)
    }

    const data = await response.json()
    const rate = Number(data?.rates?.MYR)

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error('Exchange API returned an invalid USD/MYR rate')
    }

    cachedRate = {
      base: 'USD',
      target: 'MYR',
      rate,
      source: 'Frankfurter.app',
      updatedAt: data?.date || new Date(now).toISOString(),
      cached: false,
    }
    cachedAt = now

    return res.status(200).json(cachedRate)
  } catch {
    const fallback = cachedRate || {
      base: 'USD' as const,
      target: 'MYR' as const,
      rate: FALLBACK_USD_TO_MYR,
      source: 'Fallback estimate',
      updatedAt: new Date(now).toISOString(),
      cached: false,
    }

    return res.status(200).json({ ...fallback, cached: Boolean(cachedRate) })
  }
}
