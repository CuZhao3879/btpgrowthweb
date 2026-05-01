import { NextSeo } from 'next-seo'
import {
  CheckCircle2,
  DollarSign,
  ImageIcon,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'

type Category = 'all' | 'video' | 'motion' | 'image' | 'upscale'
type CostQuality = 'measured' | 'estimated' | 'pending'

type Plan = {
  id: string
  name: string
  monthlyPriceMyr: number
  credits: number
  targetMargin: number
}

type VronkModel = {
  id: string
  category: Exclude<Category, 'all'>
  provider: string
  model: string
  action: string
  credits: number
  apiCost?: number
  costQuality: CostQuality
  note?: string
}

const AFFILIATE_COMMISSION_RATE = 0.2
const USD_TO_MYR_RATE = 3.96
const EXCHANGE_RATE_REFRESH_DAYS = 3

const plans: Plan[] = [
  { id: 'starter', name: 'Starter', monthlyPriceMyr: 25, credits: 200, targetMargin: 0.7 },
  { id: 'plus', name: 'Plus', monthlyPriceMyr: 100, credits: 1000, targetMargin: 0.6 },
  { id: 'premier', name: 'Premier', monthlyPriceMyr: 250, credits: 3000, targetMargin: 0.5 },
  { id: 'ultra', name: 'Ultra', monthlyPriceMyr: 1000, credits: 15000, targetMargin: 0.4 },
]

const vronkModels: VronkModel[] = [
  {
    id: 'vronk-video-720p-5s',
    category: 'video',
    provider: 'xAI / Default',
    model: 'Vronk Video / Grok Video',
    action: '720p - 5s',
    credits: 45,
    apiCost: 0.35,
    costQuality: 'measured',
    note: 'xAI 10s = $0.70, prorated to 5s',
  },
  { id: 'seedance-15-720p-5s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.5 Pro', action: '720p - 5s no audio', credits: 60, apiCost: 0.12, costQuality: 'estimated', note: 'BytePlus official formula: token ~= width x height x fps x duration / 1024. 720p 16:9 5s ~= 102,960 tokens x $1.20/M without audio = $0.124.' },
  { id: 'seedance-15-1080p-5s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.5 Pro', action: '1080p - 5s no audio', credits: 110, apiCost: 0.29, costQuality: 'estimated', note: 'BytePlus official formula: 1080p 16:9 5s ~= 244,800 tokens x $1.20/M without audio = $0.294.' },
  { id: 'seedance-15-720p-10s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.5 Pro', action: '720p - 10s no audio', credits: 120, apiCost: 0.25, costQuality: 'estimated', note: 'BytePlus official formula: 720p 16:9 10s ~= 205,920 tokens x $1.20/M without audio = $0.247.' },
  { id: 'seedance-15-1080p-10s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.5 Pro', action: '1080p - 10s no audio', credits: 220, apiCost: 0.59, costQuality: 'estimated', note: 'BytePlus official formula: 1080p 16:9 10s ~= 489,600 tokens x $1.20/M without audio = $0.588.' },
  { id: 'seedance-10-720p-5s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.0 Pro', action: '720p - 5s', credits: 40, apiCost: 0.26, costQuality: 'estimated', note: 'BytePlus official billing example: seedance-1-0-pro 720p 16:9 5s = $0.26.' },
  { id: 'seedance-10-1080p-5s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.0 Pro', action: '1080p - 5s', credits: 80, apiCost: 0.61, costQuality: 'estimated', note: 'BytePlus official billing example: seedance-1-0-pro 1080p 16:9 5s = $0.61.' },
  { id: 'seedance-fast-720p-5s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.0 Pro Fast', action: '720p - 5s', credits: 30, apiCost: 0.1, costQuality: 'estimated', note: 'BytePlus official rate: seedance-1-0-pro-fast $1.00/M tokens. 720p 16:9 5s ~= 102,960 tokens = $0.103.' },
  { id: 'seedance-fast-1080p-5s', category: 'video', provider: 'ByteDance', model: 'Seedance 1.0 Pro Fast', action: '1080p - 5s', credits: 55, apiCost: 0.24, costQuality: 'estimated', note: 'BytePlus official rate: seedance-1-0-pro-fast $1.00/M tokens. 1080p 16:9 5s ~= 244,800 tokens = $0.245.' },

  { id: 'kling-v3-pro-720p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 3.0 Pro', action: '720p - 5s with audio', credits: 195, apiCost: 0.84, costQuality: 'estimated', note: 'fal official: Kling 3.0 Pro with audio $0.168/s x 5s. Vronk 后端含音频 +30% credits。' },
  { id: 'kling-v3-pro-1080p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 3.0 Pro', action: '1080p - 5s with audio', credits: 273, apiCost: 0.84, costQuality: 'estimated', note: 'fal official: Kling 3.0 Pro with audio $0.168/s x 5s. Vronk 后端含音频 +30% credits。' },
  { id: 'kling-v3-std-720p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 3.0 Standard', action: '720p - 5s with audio', credits: 91, apiCost: 0.63, costQuality: 'estimated', note: 'fal official: Kling 3.0 Standard with audio $0.126/s x 5s. Vronk 后端含音频 +30% credits。' },
  { id: 'kling-v3-std-1080p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 3.0 Standard', action: '1080p - 5s with audio', credits: 143, apiCost: 0.63, costQuality: 'estimated', note: 'fal official: Kling 3.0 Standard with audio $0.126/s x 5s. Vronk 后端含音频 +30% credits。' },
  { id: 'kling-v26-720p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.6', action: '720p - 5s no audio', credits: 50, apiCost: 0.35, costQuality: 'estimated' },
  { id: 'kling-v26-1080p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.6', action: '1080p - 5s no audio', credits: 90, apiCost: 0.35, costQuality: 'estimated', note: 'fal official: Kling 2.6 Pro no audio $0.07/s x 5s.' },
  { id: 'kling-v26-audio-720p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.6', action: '720p - 5s with audio', credits: 65, apiCost: 0.7, costQuality: 'estimated', note: 'fal official: Kling 2.6 Pro with audio $0.14/s x 5s.' },
  { id: 'kling-v26-audio-1080p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.6', action: '1080p - 5s with audio', credits: 117, apiCost: 0.7, costQuality: 'estimated', note: 'fal official: Kling 2.6 Pro with audio $0.14/s x 5s.' },
  { id: 'kling-v25-pro-720p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.5 Turbo Pro', action: '720p - 5s', credits: 60, apiCost: 0.35, costQuality: 'estimated', note: 'fal official: Kling 2.5 Turbo Pro costs $0.35 for 5s.' },
  { id: 'kling-v25-pro-1080p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.5 Turbo Pro', action: '1080p - 5s', credits: 110, apiCost: 0.35, costQuality: 'estimated', note: 'fal official: Kling 2.5 Turbo Pro costs $0.35 for 5s.' },
  { id: 'kling-v25-std-720p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.5 Turbo Standard', action: '720p - 5s', credits: 30, apiCost: 0.21, costQuality: 'estimated', note: 'fal official: Kling 2.5 Turbo Standard costs $0.21 for 5s.' },
  { id: 'kling-v25-std-1080p-5s', category: 'video', provider: 'Kuaishou', model: 'Kling 2.5 Turbo Standard', action: '1080p - 5s', credits: 50, apiCost: 0.21, costQuality: 'estimated', note: 'fal official: Kling 2.5 Turbo Standard costs $0.21 for 5s.' },

  { id: 'veo31-720p-5s', category: 'video', provider: 'Google', model: 'Veo 3.1', action: '720p - 4s with audio', credits: 390, apiCost: 1.6, costQuality: 'estimated', note: 'Google official: Veo 3.1 Standard with audio $0.40/s. Vronk UI uses 4s for 720p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo31-1080p-5s', category: 'video', provider: 'Google', model: 'Veo 3.1', action: '1080p - 8s with audio', credits: 546, apiCost: 3.2, costQuality: 'estimated', note: 'Google official: Veo 3.1 Standard with audio $0.40/s. Vronk forces 8s for 1080p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo31-fast-720p-5s', category: 'video', provider: 'Google', model: 'Veo 3.1 Fast', action: '720p - 4s with audio', credits: 195, apiCost: 0.4, costQuality: 'estimated', note: 'Google official: Veo 3.1 Fast with audio $0.10/s for 720p. Vronk UI uses 4s for 720p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo31-fast-1080p-5s', category: 'video', provider: 'Google', model: 'Veo 3.1 Fast', action: '1080p - 8s with audio', credits: 273, apiCost: 0.96, costQuality: 'estimated', note: 'Google official: Veo 3.1 Fast with audio $0.12/s for 1080p. Vronk forces 8s for 1080p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo3-720p-5s', category: 'video', provider: 'Google', model: 'Veo 3.0', action: '720p - 4s with audio', credits: 312, apiCost: 1.6, costQuality: 'estimated', note: 'Google official: Veo 3 Standard with audio $0.40/s. Vronk UI uses 4s for 720p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo3-1080p-5s', category: 'video', provider: 'Google', model: 'Veo 3.0', action: '1080p - 8s with audio', credits: 429, apiCost: 3.2, costQuality: 'estimated', note: 'Google official: Veo 3 Standard with audio $0.40/s. Vronk forces 8s for 1080p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo3-fast-720p-5s', category: 'video', provider: 'Google', model: 'Veo 3.0 Fast', action: '720p - 4s with audio', credits: 156, apiCost: 0.4, costQuality: 'estimated', note: 'Google official: Veo 3 Fast with audio $0.10/s for 720p. Vronk UI uses 4s for 720p. Vronk 后端含音频 +30% credits。' },
  { id: 'veo3-fast-1080p-5s', category: 'video', provider: 'Google', model: 'Veo 3.0 Fast', action: '1080p - 8s with audio', credits: 221, apiCost: 0.96, costQuality: 'estimated', note: 'Google official: Veo 3 Fast with audio $0.12/s for 1080p. Vronk forces 8s for 1080p. Vronk 后端含音频 +30% credits。' },

  { id: 'motion-kling-v3-pro-720p-5s', category: 'motion', provider: 'Kuaishou', model: 'Kling 3.0 Pro Motion', action: '720p - 5s', credits: 35, apiCost: 0.4, costQuality: 'measured', note: '实测秒价：Kling 3.0 Pro Motion 720p $0.08/s x 5s = $0.40。' },
  { id: 'motion-kling-v3-pro-1080p-5s', category: 'motion', provider: 'Kuaishou', model: 'Kling 3.0 Pro Motion', action: '1080p - 5s', credits: 50, apiCost: 0.6, costQuality: 'measured', note: '实测秒价：Kling 3.0 Pro Motion 1080p $0.12/s x 5s = $0.60。' },
  { id: 'motion-kling-v26-720p-5s', category: 'motion', provider: 'Kuaishou', model: 'Kling 2.6 Motion', action: '720p - 5s', credits: 25, apiCost: 0.25, costQuality: 'measured', note: '实测秒价：Kling 2.6 Motion 720p $0.05/s x 5s = $0.25。' },
  { id: 'motion-kling-v26-1080p-5s', category: 'motion', provider: 'Kuaishou', model: 'Kling 2.6 Motion', action: '1080p - 5s', credits: 35, apiCost: 0.35, costQuality: 'measured', note: '实测秒价：Kling 2.6 Motion 1080p $0.07/s x 5s = $0.35。' },

  { id: 'gpt-image-2', category: 'image', provider: 'OpenAI', model: 'GPT Image 2', action: '1 image - measured average', credits: 10, apiCost: 0.08, costQuality: 'measured', note: 'Measured from OpenAI dashboard: Apr 27 $7.31 / 93 requests = $0.0786, Apr 30 $2.13 / 27 requests = $0.0789. Rounded to $0.08/request.' },
  { id: 'seedream-5-lite', category: 'image', provider: 'ByteDance', model: 'Seedream 5.0 Lite', action: '1 image', credits: 6, apiCost: 0.035, costQuality: 'measured', note: '供应商控制台截图：文生图和图生图都是 $0.035/张。' },
  { id: 'seedream-45', category: 'image', provider: 'ByteDance', model: 'Seedream 4.5', action: '1 image', credits: 5, apiCost: 0.04, costQuality: 'measured', note: '供应商控制台截图：文生图和图生图都是 $0.04/张。' },
  { id: 'seedream-40', category: 'image', provider: 'ByteDance', model: 'Seedream 4.0', action: '1 image', credits: 3, apiCost: 0.03, costQuality: 'measured', note: '供应商控制台截图：文生图和图生图都是 $0.03/张。' },
  { id: 'nanobanana-pro', category: 'image', provider: 'Google', model: 'Nano Banana Pro', action: '1 image - 1K/2K', credits: 7, apiCost: 0.134, costQuality: 'estimated', note: 'Google official: Gemini 3 Pro Image output $0.134 per 1K/2K image, plus approx $0.0011 per input image.' },
  { id: 'nanobanana-2', category: 'image', provider: 'Google', model: 'Nano Banana 2', action: '1 image - 1K', credits: 5, apiCost: 0.067, costQuality: 'estimated', note: 'Google official: Gemini 3.1 Flash Image output $0.067 per 1K image; 2K is $0.101.' },
  { id: 'nanobanana', category: 'image', provider: 'Google', model: 'Nano Banana', action: '1 image - 1K', credits: 2, apiCost: 0.039, costQuality: 'estimated', note: 'Google official: Gemini 2.5 Flash Image output $0.039 per image.' },

  { id: 'upscale-real-esrgan', category: 'upscale', provider: 'Replicate / Prodia', model: 'Real-ESRGAN Upscale', action: '1 upscale', credits: 15, apiCost: 0.0022, costQuality: 'estimated', note: 'Replicate model page estimate: approximately $0.0022/run, varies by input.' },
  { id: 'upscale-gpt-image-2', category: 'upscale', provider: 'OpenAI', model: 'GPT Image 2 Upscale', action: '1 upscale', credits: 10, apiCost: 0.08, costQuality: 'measured', note: '按 GPT Image 2 同样实测平均成本计算：$0.08/次。' },
]

const categoryOrder: Record<Exclude<Category, 'all'>, number> = {
  image: 0,
  video: 1,
  motion: 2,
  upscale: 3,
}

const modelOrder: Record<string, number> = {
  'gpt-image-2': 0,
  'seedream-5-lite': 1,
  'seedream-45': 2,
  'seedream-40': 3,
  'nanobanana-2': 4,
  'nanobanana-pro': 5,
  nanobanana: 6,

  'vronk-video-720p-5s': 100,
  'seedance-15-720p-5s': 110,
  'seedance-15-1080p-5s': 111,
  'seedance-15-720p-10s': 112,
  'seedance-15-1080p-10s': 113,
  'seedance-10-720p-5s': 120,
  'seedance-10-1080p-5s': 121,
  'seedance-fast-720p-5s': 130,
  'seedance-fast-1080p-5s': 131,
  'kling-v3-pro-720p-5s': 140,
  'kling-v3-pro-1080p-5s': 141,
  'kling-v3-std-720p-5s': 150,
  'kling-v3-std-1080p-5s': 151,
  'kling-v26-720p-5s': 160,
  'kling-v26-1080p-5s': 161,
  'kling-v26-audio-720p-5s': 162,
  'kling-v26-audio-1080p-5s': 163,
  'kling-v25-pro-720p-5s': 170,
  'kling-v25-pro-1080p-5s': 171,
  'kling-v25-std-720p-5s': 180,
  'kling-v25-std-1080p-5s': 181,
  'veo31-720p-5s': 190,
  'veo31-1080p-5s': 191,
  'veo31-fast-720p-5s': 200,
  'veo31-fast-1080p-5s': 201,
  'veo3-720p-5s': 210,
  'veo3-1080p-5s': 211,
  'veo3-fast-720p-5s': 220,
  'veo3-fast-1080p-5s': 221,

  'motion-kling-v3-pro-720p-5s': 300,
  'motion-kling-v3-pro-1080p-5s': 301,
  'motion-kling-v26-720p-5s': 310,
  'motion-kling-v26-1080p-5s': 311,

  'upscale-real-esrgan': 400,
  'upscale-gpt-image-2': 401,
}

function sortModelsByFeatureOrder(a: VronkModel, b: VronkModel) {
  const categoryDelta = categoryOrder[a.category] - categoryOrder[b.category]
  if (categoryDelta !== 0) return categoryDelta
  return (modelOrder[a.id] ?? 9999) - (modelOrder[b.id] ?? 9999)
}

function pricePerCredit(plan: Plan) {
  return plan.monthlyPriceMyr / plan.credits
}

function formatUsd(value: number | null | undefined, digits = 3) {
  if (value == null || !Number.isFinite(value)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function formatMyr(value: number | null | undefined, digits = 2) {
  if (value == null || !Number.isFinite(value)) return '-'
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function usdToMyr(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return null
  return value * USD_TO_MYR_RATE
}

function formatPercent(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return '-'
  return `${(value * 100).toFixed(1)}%`
}

function costQualityLabel(quality: CostQuality) {
  if (quality === 'measured') return '实测'
  if (quality === 'estimated') return '估算'
  return '成本待补'
}

function categoryLabel(category: Category) {
  if (category === 'all') return '全部'
  if (category === 'image') return '图像'
  if (category === 'video') return '视频'
  if (category === 'motion') return '动作模仿'
  return '放大'
}

function actionLabel(action: string) {
  return action
    .replace('1 image - measured average', '1 张图片 - 实测平均')
    .replace('1 image - 1K/2K', '1 张图片 - 1K/2K')
    .replace('1 image - 1K', '1 张图片 - 1K')
    .replace('1 image', '1 张图片')
    .replace('1 upscale', '1 次放大')
    .replace('with audio', '含音频')
    .replace('no audio', '无音频')
    .replaceAll('s', ' 秒')
}

function noteLabel(note: string) {
  return note
    .replace('xAI 10s = $0.70, prorated to 5s', 'xAI 10 秒 = $0.70，按 5 秒折算。')
    .replaceAll('BytePlus official formula:', 'BytePlus 官方公式：')
    .replaceAll('BytePlus official billing example:', 'BytePlus 官方计费示例：')
    .replaceAll('BytePlus official rate:', 'BytePlus 官方费率：')
    .replaceAll('Google official:', 'Google 官方价格：')
    .replaceAll('fal official:', 'fal 官方价格：')
    .replaceAll('Replicate model page estimate:', 'Replicate 模型页面估算：')
    .replaceAll('Measured from OpenAI dashboard:', '根据 OpenAI dashboard 实测：')
    .replaceAll('Provider console screenshot:', '供应商控制台截图：')
    .replaceAll('width x height x fps x duration', '宽 x 高 x 帧率 x 秒数')
    .replaceAll('token ~=', 'token 约等于')
    .replaceAll('without audio', '无音频')
    .replaceAll('with audio', '含音频')
    .replaceAll('motion control', '动作模仿')
    .replaceAll('Image output', '图片输出')
    .replaceAll('requests', '次请求')
    .replaceAll('approximately', '约')
    .replaceAll('costs', '成本')
    .replaceAll('prorated', '按比例折算')
    .replaceAll('for 720p', '用于 720p')
    .replaceAll('for 1080p', '用于 1080p')
    .replaceAll('Vronk UI uses', 'Vronk UI 使用')
    .replaceAll('Vronk forces', 'Vronk 固定为')
    .replaceAll('per input image', '每张输入图')
    .replaceAll('per image', '每张图')
    .replaceAll('per 1K/2K image', '每张 1K/2K 图')
    .replaceAll('per 1K image', '每张 1K 图')
    .replaceAll('plus approx', '另加约')
    .replaceAll('Rounded to', '四舍五入为')
    .replaceAll('varies by input', '会随输入变化')
    .replaceAll('/request', '/次')
    .replaceAll('/run', '/次')
    .replaceAll('/s', '/秒')
    .replaceAll(' 10s', ' 10 秒')
    .replaceAll(' 8s', ' 8 秒')
    .replaceAll(' 5s', ' 5 秒')
    .replaceAll(' 4s', ' 4 秒')
    .replaceAll('is', '为')
}

function tone(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return 'neutral'
  if (value >= 0.6) return 'good'
  if (value >= 0.35) return 'ok'
  if (value >= 0) return 'warn'
  return 'bad'
}

function deltaTone(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return 'neutral'
  if (value >= 0) return 'good'
  return 'bad'
}

function getPlanEconomics(model: VronkModel, plan: Plan) {
  const revenueMyr = model.credits * pricePerCredit(plan)
  const revenueUsd = revenueMyr / USD_TO_MYR_RATE
  const affiliateCommissionMyr = revenueMyr * AFFILIATE_COMMISSION_RATE
  const affiliateCommissionUsd = revenueUsd * AFFILIATE_COMMISSION_RATE
  const revenueAfterMarginMyr = revenueMyr * (1 - plan.targetMargin)
  const revenueAfterMarginAndAffiliateMyr = revenueMyr * (1 - plan.targetMargin - AFFILIATE_COMMISSION_RATE)
  const maxApiCostForTarget = revenueUsd * (1 - plan.targetMargin)
  const profit = model.apiCost == null ? null : revenueUsd - model.apiCost
  const margin = profit == null || revenueUsd <= 0 ? null : profit / revenueUsd
  const netProfitAfterAffiliate = profit == null ? null : profit - affiliateCommissionUsd
  const netMarginAfterAffiliate = netProfitAfterAffiliate == null || revenueUsd <= 0 ? null : netProfitAfterAffiliate / revenueUsd
  const targetGap = margin == null ? null : margin - plan.targetMargin
  const passesTarget = targetGap == null ? null : targetGap >= 0

  return { revenueMyr, revenueUsd, affiliateCommissionMyr, affiliateCommissionUsd, revenueAfterMarginMyr, revenueAfterMarginAndAffiliateMyr, maxApiCostForTarget, profit, margin, netMarginAfterAffiliate, targetGap, passesTarget }
}

function categoryIcon(category: Category) {
  if (category === 'video') return <Video size={15} />
  if (category === 'motion') return <Zap size={15} />
  if (category === 'image') return <ImageIcon size={15} />
  if (category === 'upscale') return <TrendingUp size={15} />
  return <SlidersHorizontal size={15} />
}

export default function CreditPricingDashboard() {
  const [category, setCategory] = useState<Category>('all')

  const rows = useMemo(() => {
    return vronkModels
      .filter((model) => category === 'all' || model.category === category)
      .slice()
      .sort(sortModelsByFeatureOrder)
  }, [category])

  return (
    <>
      <NextSeo title="Vronk AI Credit 成本与利润率 | 内部" noindex nofollow />
      <main className="pricing-dashboard">
        <header className="dashboard-top">
          <div className="lock-chip"><Lock size={14} /> 内部定价仪表盘</div>
          <div className="category-tabs">
            {(['all', 'image', 'video', 'motion', 'upscale'] as Category[]).map((item) => (
              <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} type="button" key={item}>
                {categoryIcon(item)} {categoryLabel(item)}
              </button>
            ))}
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <p className="eyebrow">Vronk AI 满额使用定价</p>
            <h1>模型成本与订阅利润率仪表盘</h1>
            <p>
              这个页面假设用户把每月 credits 全部用完。配套收入使用马币月付价格，再按汇率折成 USD 对比 API 成本，并预留 20% affiliate 佣金空间。
            </p>
          </div>
          <div className="target-card">
            <Target size={22} />
            <span>当前毛利目标</span>
            <strong>70 / 60 / 50 / 40</strong>
            <small>页面同时显示扣除 20% affiliate 后的模型成本预算</small>
            <small>汇率假设：1 USD = RM{USD_TO_MYR_RATE.toFixed(2)}，建议每 {EXCHANGE_RATE_REFRESH_DAYS} 天刷新一次</small>
          </div>
        </section>

        <section className="plan-grid">
          {plans.map((plan) => {
            const monthlyPriceUsd = plan.monthlyPriceMyr / USD_TO_MYR_RATE
            const directCostBudgetUsd = monthlyPriceUsd * (1 - plan.targetMargin)
            const revenueAfterMarginMyr = plan.monthlyPriceMyr * (1 - plan.targetMargin)
            const revenueAfterMarginAndAffiliateMyr = plan.monthlyPriceMyr * (1 - plan.targetMargin - AFFILIATE_COMMISSION_RATE)
            return (
              <article className="plan-card" key={plan.id}>
                <div>
                  <span>{plan.name}</span>
                  <strong>{formatMyr(plan.monthlyPriceMyr, 0)}</strong>
                </div>
                <dl>
                  <div><dt>Credits</dt><dd>{plan.credits.toLocaleString()}</dd></div>
                  <div><dt>RM 成本预算</dt><dd>{formatMyr(revenueAfterMarginMyr, 2)}</dd></div>
                  <div><dt>扣 affiliate 后成本预算</dt><dd>{formatMyr(revenueAfterMarginAndAffiliateMyr, 2)}</dd></div>
                  <div><dt>单 credit 收入</dt><dd>{formatMyr(pricePerCredit(plan), 4)}</dd></div>
                  <div><dt>毛利目标</dt><dd>{formatPercent(plan.targetMargin)}</dd></div>
                  <div><dt>最高 API 成本</dt><dd>{formatUsd(directCostBudgetUsd, 2)}</dd></div>
                </dl>
              </article>
            )
          })}
        </section>

        <section className="matrix-panel">
          <div className="matrix-toolbar">
            <div>
              <p className="eyebrow">满额使用模型矩阵</p>
              <h2>模型 credits、API 成本与配套利润率</h2>
            </div>
            <small>公式：先用马币算收入，再以 1 USD = RM{USD_TO_MYR_RATE.toFixed(2)} 折成 USD。毛利率 = (USD 收入 - API 成本) / USD 收入。</small>
          </div>

          <div className="table-card">
            <div className="table-row table-head">
              <span>模型 / 动作</span>
              <span>Credits</span>
              <span>已知 API 成本</span>
              {plans.map((plan) => <span key={plan.id}>{plan.name}</span>)}
            </div>

            {rows.map((model) => (
              <div className="table-row" key={model.id}>
                <span className="model-cell">
                  <strong>{model.model}</strong>
                  <small>{model.provider} - {actionLabel(model.action)} - {categoryLabel(model.category)}</small>
                  {model.note ? <small>{noteLabel(model.note)}</small> : null}
                </span>
                <strong>{model.credits} credits</strong>
                <span className={'cost-pill ' + model.costQuality}>
                  {model.apiCost == null ? '待补' : formatUsd(model.apiCost, 3)}
                  {model.apiCost != null ? <small>约 {formatMyr(usdToMyr(model.apiCost), 3)}</small> : null}
                  <small>{costQualityLabel(model.costQuality)}</small>
                </span>
                {plans.map((plan) => {
                  const economics = getPlanEconomics(model, plan)
                  return (
                    <span className="plan-margin-cell" key={plan.id}>
                      <strong className={economics.margin == null ? 'neutral' : deltaTone(economics.targetGap)}>
                        {economics.margin == null ? '待补' : formatPercent(economics.margin)}
                      </strong>
                      <small>{formatMyr(economics.revenueAfterMarginMyr, 3)} 成本预算</small>
                      <small>{formatMyr(economics.revenueAfterMarginAndAffiliateMyr, 3)} 扣 affiliate 后成本预算</small>
                      {economics.netMarginAfterAffiliate != null ? <small>扣 affiliate 后 {formatPercent(economics.netMarginAfterAffiliate)}</small> : null}
                      <small>目标最高 API 成本 {formatUsd(economics.maxApiCostForTarget, 3)}</small>
                      {economics.targetGap != null ? <small className={deltaTone(economics.targetGap)}>{economics.targetGap >= 0 ? '+' : ''}{formatPercent(economics.targetGap)} 对比目标</small> : null}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </section>

        <section className="notes-panel">
          <article>
            <ShieldCheck size={18} />
            <h3>满额使用假设</h3>
            <p>每个配套都按用户把全部月度 credits 用在同一个模型动作来计算。这样可以看到该动作在最保守情况下的利润率。</p>
          </article>
          <article>
            <DollarSign size={18} />
            <h3>待补成本</h3>
            <p>还没有 API 成本的行，仍会显示每个利润目标允许的最高模型成本。之后补上成本，利润率会自动变成有效数据。</p>
          </article>
          <article>
            <CheckCircle2 size={18} />
            <h3>目标逻辑</h3>
            <p>当前毛利目标：Starter 70%、Plus 60%、Premier 50%、Ultra 40%。页面显示的是扣掉目标 margin 后可用于模型成本的 RM 预算，下一行则是再扣 affiliate 后的预算。</p>
          </article>
        </section>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          background: #071018;
          color: #eef6ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .pricing-dashboard * { box-sizing: border-box; }

        .pricing-dashboard {
          min-height: 100vh;
          padding: 96px 24px 24px;
          background:
            linear-gradient(180deg, rgba(20, 184, 166, 0.14), transparent 420px),
            radial-gradient(circle at 80% 0%, rgba(99, 102, 241, 0.16), transparent 360px),
            #071018;
        }

        .dashboard-top,
        .hero-panel,
        .plan-grid,
        .matrix-panel,
        .notes-panel {
          width: min(1540px, 100%);
          margin-inline: auto;
        }

        .dashboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .lock-chip,
        .category-tabs,
        .hero-panel,
        .target-card,
        .plan-card,
        .matrix-panel,
        .notes-panel article {
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(10, 18, 30, 0.88);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.25);
        }

        .lock-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          border-radius: 999px;
          padding: 8px 12px;
          color: #bdeee8;
          font-size: 13px;
        }

        .category-tabs {
          display: inline-flex;
          gap: 6px;
          border-radius: 16px;
          padding: 5px;
        }

        .pricing-dashboard button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 12px;
          padding: 10px 14px;
          color: #aebccd;
          background: transparent;
          cursor: pointer;
          font: inherit;
        }

        .pricing-dashboard button.active {
          color: #fff;
          background: #1f3442;
        }

        .hero-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 24px;
          align-items: center;
          border-radius: 26px;
          padding: 32px;
        }

        .eyebrow,
        .model-cell small,
        .cost-pill small,
        .plan-card span,
        .plan-card dt,
        .plan-card dd,
        .matrix-toolbar small,
        .notes-panel p,
        .target-card small,
        .target-card span {
          color: #91a5bb;
        }

        .eyebrow,
        .model-cell small,
        .cost-pill small,
        .plan-card dt,
        .plan-card dd,
        .matrix-toolbar small,
        .target-card small,
        .target-card span {
          font-size: 12px;
        }

        .hero-panel h1,
        .hero-panel p,
        .matrix-panel h2,
        .notes-panel h3,
        .notes-panel p,
        .plan-card dl {
          margin: 0;
        }

        .hero-panel h1 {
          margin: 10px 0 14px;
          font-size: clamp(34px, 4.2vw, 58px);
          line-height: 1.04;
          letter-spacing: 0;
        }

        .hero-panel p,
        .notes-panel p {
          color: #bed0e4;
          line-height: 1.65;
        }

        .target-card {
          display: grid;
          gap: 8px;
          border-radius: 20px;
          padding: 20px;
        }

        .target-card svg,
        .notes-panel svg {
          color: #5eead4;
        }

        .target-card strong {
          font-size: 28px;
        }

        .plan-grid {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .plan-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .plan-card {
          border-radius: 18px;
          padding: 16px;
        }

        .plan-card {
          display: grid;
          gap: 16px;
        }

        .plan-card > div {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }

        .plan-card > div strong {
          font-size: 26px;
        }

        .plan-card dl {
          display: grid;
          gap: 10px;
        }

        .plan-card dl div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px solid rgba(148, 163, 184, 0.12);
          padding-top: 10px;
        }

        .plan-card dd {
          color: #fff;
          font-weight: 700;
        }

        .matrix-panel {
          margin-top: 18px;
          border-radius: 24px;
          padding: 20px;
        }

        .matrix-toolbar {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .matrix-toolbar h2 {
          margin-top: 4px;
          font-size: 22px;
        }

        .table-card {
          overflow-x: auto;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 16px;
          background: rgba(2, 6, 23, 0.24);
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.45fr 0.56fr 0.72fr repeat(4, 0.9fr);
          gap: 12px;
          align-items: center;
          min-width: 1380px;
          padding: 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          color: #dce8fb;
        }

        .table-row:last-child { border-bottom: 0; }

        .table-head {
          position: sticky;
          top: 0;
          z-index: 1;
          color: #91a2bc;
          background: rgba(15, 23, 42, 0.96);
          font-size: 12px;
          text-transform: uppercase;
        }

        .model-cell strong,
        .table-row strong {
          color: #fff;
        }

        .model-cell small,
        .cost-pill small,
        .plan-margin-cell small {
          display: block;
          margin-top: 3px;
        }

        .cost-pill {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
          width: max-content;
          min-width: 96px;
          border-radius: 12px;
          padding: 7px 9px;
          background: rgba(148, 163, 184, 0.08);
        }

        .cost-pill.measured {
          color: #86efac;
          background: rgba(34, 197, 94, 0.1);
        }

        .cost-pill.estimated {
          color: #fde68a;
          background: rgba(234, 179, 8, 0.1);
        }

        .cost-pill.pending {
          color: #cbd5e1;
          background: rgba(148, 163, 184, 0.08);
        }

        .plan-margin-cell {
          display: grid;
          gap: 2px;
        }

        .plan-margin-cell strong {
          font-size: 16px;
        }

        .plan-margin-cell small {
          color: #91a5bb;
          font-size: 11px;
        }

        .good { color: #62f59b !important; }
        .ok { color: #93c5fd !important; }
        .warn { color: #fde68a !important; }
        .bad { color: #ff8b8b !important; }
        .neutral { color: #cbd5e1 !important; }

        .notes-panel {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .notes-panel article {
          border-radius: 18px;
          padding: 18px;
        }

        .notes-panel svg {
          margin-bottom: 12px;
        }

        .notes-panel h3 {
          margin-bottom: 8px;
          font-size: 16px;
        }

        @media (max-width: 1080px) {
          .hero-panel,
          .plan-grid,
          .notes-panel {
            grid-template-columns: 1fr;
          }

          .matrix-toolbar,
          .dashboard-top {
            align-items: stretch;
            flex-direction: column;
          }

          .category-tabs {
            width: 100%;
            overflow-x: auto;
          }

          .category-tabs button {
            flex: 1;
            min-width: max-content;
          }
        }

        @media (max-width: 720px) {
          .pricing-dashboard {
            padding: 86px 14px 14px;
          }

          .hero-panel,
          .matrix-panel {
            border-radius: 18px;
            padding: 18px;
          }

          .hero-panel h1 {
            font-size: 34px;
          }
        }
      `}</style>
    </>
  )
}
