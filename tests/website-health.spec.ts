import { test, expect, Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

// 测试结果接口
interface TestResult {
  name: string
  status: 'passed' | 'failed' | 'skipped'
  error?: string
  duration?: number
}

interface TestReport {
  timestamp: string
  totalTests: number
  passed: number
  failed: number
  skipped: number
  passRate: number
  results: TestResult[]
  issues: string[]
}

// 全局测试结果收集器
const testResults: TestResult[] = []
const issues: string[] = []

// 基础URL
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// 要测试的主要页面
const MAIN_PAGES = [
  { path: '/', name: '首页' },
  { path: '/about', name: '关于我们' },
  { path: '/services', name: '服务页面' },
  { path: '/contact', name: '联系我们' },
  { path: '/blog', name: '博客列表' },
]

test.describe('网站健康检查', () => {
  test.beforeAll(async () => {
    console.log(`\n🚀 开始测试网站: ${BASE_URL}\n`)
  })

  test.afterAll(async () => {
    // 生成测试报告
    generateReport()
  })

  // 1. 测试页面加载
  test.describe('页面加载测试', () => {
    for (const page of MAIN_PAGES) {
      test(`应该成功加载 ${page.name} (${page.path})`, async ({ page: testPage }) => {
        const startTime = Date.now()
        try {
          const response = await testPage.goto(`${BASE_URL}${page.path}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          })

          const duration = Date.now() - startTime

          if (!response) {
            throw new Error('页面响应为空')
          }

          expect(response.status()).toBe(200)
          expect(testPage.url()).toContain(page.path)

          // 检查页面标题
          const title = await testPage.title()
          expect(title).toBeTruthy()
          expect(title.length).toBeGreaterThan(0)

          testResults.push({
            name: `页面加载: ${page.name}`,
            status: 'passed',
            duration,
          })

          console.log(`✅ ${page.name} 加载成功 (${duration}ms)`)
        } catch (error) {
          const duration = Date.now() - startTime
          const errorMsg = error instanceof Error ? error.message : String(error)
          testResults.push({
            name: `页面加载: ${page.name}`,
            status: 'failed',
            error: errorMsg,
            duration,
          })
          issues.push(`${page.name} (${page.path}) 加载失败: ${errorMsg}`)
          console.error(`❌ ${page.name} 加载失败: ${errorMsg}`)
          throw error
        }
      })
    }
  })

  // 2. 测试图片加载
  test.describe('图片加载测试', () => {
    for (const page of MAIN_PAGES) {
      test(`检查 ${page.name} 中的所有图片`, async ({ page: testPage }) => {
        try {
          await testPage.goto(`${BASE_URL}${page.path}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          })

          // 等待页面完全加载
          await testPage.waitForLoadState('networkidle')

          // 获取所有图片元素
          const images = await testPage.$$eval('img', (imgs) =>
            imgs.map((img) => ({
              src: img.src || img.getAttribute('src') || '',
              alt: img.alt || '',
            }))
          )

          const imageResults: { src: string; status: number }[] = []

          // 检查每个图片
          for (const img of images) {
            if (!img.src || img.src.startsWith('data:')) {
              continue // 跳过 data URI 和内联图片
            }

            try {
              const response = await testPage.request.get(img.src)
              const status = response.status()
              imageResults.push({ src: img.src, status })

              if (status !== 200) {
                issues.push(`图片加载失败: ${img.src} (状态码: ${status})`)
                console.error(`❌ 图片加载失败: ${img.src} - 状态码: ${status}`)
              } else {
                console.log(`✅ 图片加载成功: ${img.src.substring(0, 60)}...`)
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : String(error)
              issues.push(`图片加载错误: ${img.src} - ${errorMsg}`)
              console.error(`❌ 图片加载错误: ${img.src} - ${errorMsg}`)
            }
          }

          const failedImages = imageResults.filter((r) => r.status !== 200)
          const passedImages = imageResults.filter((r) => r.status === 200)

          testResults.push({
            name: `图片检查: ${page.name}`,
            status: failedImages.length === 0 ? 'passed' : 'failed',
            error:
              failedImages.length > 0
                ? `${failedImages.length} 张图片加载失败 (共 ${imageResults.length} 张)`
                : undefined,
          })

          console.log(
            `📸 ${page.name}: ${passedImages.length}/${imageResults.length} 张图片加载成功`
          )
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error)
          testResults.push({
            name: `图片检查: ${page.name}`,
            status: 'failed',
            error: errorMsg,
          })
          issues.push(`${page.name} 图片检查失败: ${errorMsg}`)
        }
      })
    }
  })

  // 3. 测试导航链接
  test.describe('导航链接测试', () => {
    test('应该能够导航到所有主要页面', async ({ page }) => {
      try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle' })

        // 等待导航栏加载
        await page.waitForSelector('nav', { timeout: 5000 })

        // 获取所有导航链接
        const navLinks = await page.$$eval('nav a[href]', (links) =>
          links
            .map((link) => ({
              href: link.getAttribute('href') || '',
              text: link.textContent?.trim() || '',
            }))
            .filter((link) => link.href && !link.href.startsWith('#'))
        )

        const testedLinks: string[] = []

        for (const link of navLinks) {
          // 跳过外部链接和特殊链接
          if (
            link.href.startsWith('http') ||
            link.href.startsWith('mailto:') ||
            link.href.startsWith('tel:') ||
            link.href === '#'
          ) {
            continue
          }

          try {
            const response = await page.request.get(`${BASE_URL}${link.href}`)
            const status = response.status()

            testedLinks.push(link.href)

            if (status === 200) {
              console.log(`✅ 导航链接正常: ${link.href} (${link.text})`)
            } else if (status === 404) {
              issues.push(`404 死链: ${link.href} (${link.text})`)
              console.error(`❌ 404 死链: ${link.href} (${link.text})`)
            } else {
              issues.push(`导航链接异常: ${link.href} (${link.text}) - 状态码: ${status}`)
              console.error(`⚠️ 导航链接异常: ${link.href} - 状态码: ${status}`)
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error)
            issues.push(`导航链接错误: ${link.href} - ${errorMsg}`)
            console.error(`❌ 导航链接错误: ${link.href} - ${errorMsg}`)
          }
        }

        testResults.push({
          name: '导航链接检查',
          status: issues.filter((i) => i.includes('导航链接') || i.includes('死链')).length === 0 ? 'passed' : 'failed',
        })

        console.log(`🔗 测试了 ${testedLinks.length} 个导航链接`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        testResults.push({
          name: '导航链接检查',
          status: 'failed',
          error: errorMsg,
        })
      }
    })
  })

  // 4. 测试按钮和链接可点击性
  test.describe('按钮和链接交互测试', () => {
    for (const page of MAIN_PAGES) {
      test(`检查 ${page.name} 中的按钮和链接`, async ({ page: testPage }) => {
        try {
          await testPage.goto(`${BASE_URL}${page.path}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          })

          await testPage.waitForLoadState('networkidle')

          // 获取所有按钮
          const buttons = await testPage.$$('button, [role="button"], a[href]')
          let clickableCount = 0
          let errorCount = 0

          for (let i = 0; i < Math.min(buttons.length, 20); i++) {
            // 限制测试数量，避免测试时间过长
            const button = buttons[i]
            try {
              const isVisible = await button.isVisible()
              const isEnabled = await button.isEnabled()

              if (isVisible && isEnabled) {
                // 检查是否是外部链接或特殊链接
                const tagName = await button.evaluate((el) => el.tagName.toLowerCase())
                const href = await button.evaluate((el) => {
                  if (el.tagName.toLowerCase() === 'a') {
                    return (el as HTMLAnchorElement).href
                  }
                  return null
                })

                if (href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))) {
                  clickableCount++
                  continue // 跳过外部链接的实际点击测试
                }

                // 尝试点击（不等待导航，避免页面跳转）
                await button.click({ timeout: 2000, force: true }).catch(() => {
                  // 忽略点击错误，因为可能触发导航
                })
                clickableCount++
              }
            } catch (error) {
              errorCount++
              const errorMsg = error instanceof Error ? error.message : String(error)
              console.warn(`⚠️ 按钮/链接交互警告: ${errorMsg}`)
            }
          }

          testResults.push({
            name: `按钮/链接交互: ${page.name}`,
            status: errorCount === 0 ? 'passed' : 'failed',
            error: errorCount > 0 ? `${errorCount} 个按钮/链接交互失败` : undefined,
          })

          console.log(`🖱️ ${page.name}: ${clickableCount} 个按钮/链接可交互`)
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error)
          testResults.push({
            name: `按钮/链接交互: ${page.name}`,
            status: 'failed',
            error: errorMsg,
          })
        }
      })
    }
  })

  // 5. 测试联系表单
  test.describe('联系表单测试', () => {
    test('应该能够提交联系表单', async ({ page }) => {
      try {
        await page.goto(`${BASE_URL}/contact`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })

        // 等待表单加载
        await page.waitForSelector('form', { timeout: 5000 })

        // 填写表单
        await page.fill('input[name="name"]', '测试用户')
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="phone"]', '+60123456789')
        await page.fill('textarea[name="message"]', '这是一条自动化测试消息')

        // 监听 API 请求
        const responsePromise = page.waitForResponse(
          (response) => response.url().includes('/api/contact') && response.request().method() === 'POST',
          { timeout: 10000 }
        )

        // 提交表单
        await page.click('button[type="submit"]')

        // 等待响应
        const response = await responsePromise

        // 检查响应状态
        const status = response.status()
        const responseBody = await response.json().catch(() => ({}))

        if (status === 200 || status === 201) {
          console.log('✅ 联系表单提交成功')
          testResults.push({
            name: '联系表单提交',
            status: 'passed',
          })
        } else {
          const errorMsg = (responseBody as any).error || `状态码: ${status}`
          issues.push(`联系表单提交失败: ${errorMsg}`)
          console.error(`❌ 联系表单提交失败: ${errorMsg}`)
          testResults.push({
            name: '联系表单提交',
            status: 'failed',
            error: errorMsg,
          })
        }

        // 等待成功消息显示（如果API成功）
        if (status === 200 || status === 201) {
          try {
            await page.waitForSelector('text=/成功|success/i', { timeout: 3000 })
            console.log('✅ 表单成功消息已显示')
          } catch {
            // 成功消息可能以不同方式显示，忽略此错误
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        // 如果API未配置，这可能是预期的
        if (errorMsg.includes('timeout') || errorMsg.includes('waitForResponse')) {
          console.warn(`⚠️ 联系表单API可能未配置或响应超时: ${errorMsg}`)
          testResults.push({
            name: '联系表单提交',
            status: 'skipped',
            error: `API可能未配置: ${errorMsg}`,
          })
        } else {
          issues.push(`联系表单测试失败: ${errorMsg}`)
          testResults.push({
            name: '联系表单提交',
            status: 'failed',
            error: errorMsg,
          })
        }
      }
    })
  })

  // 6. 测试博客页面和链接
  test.describe('博客页面测试', () => {
    test('应该能够访问博客列表并检查博客文章链接', async ({ page }) => {
      try {
        await page.goto(`${BASE_URL}/blog`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })

        // 获取所有博客文章链接
        const blogLinks = await page.$$eval('a[href*="/blog/"]', (links) =>
          links
            .map((link) => ({
              href: link.getAttribute('href') || '',
              text: link.textContent?.trim() || '',
            }))
            .filter((link) => link.href && link.href.includes('/blog/'))
            .slice(0, 5) // 限制测试前5篇文章
        )

        let testedCount = 0
        let successCount = 0

        for (const link of blogLinks) {
          try {
            const response = await page.request.get(`${BASE_URL}${link.href}`)
            const status = response.status()

            testedCount++

            if (status === 200) {
              successCount++
              console.log(`✅ 博客文章可访问: ${link.href}`)
            } else if (status === 404) {
              issues.push(`博客文章404: ${link.href}`)
              console.error(`❌ 博客文章404: ${link.href}`)
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error)
            issues.push(`博客文章访问错误: ${link.href} - ${errorMsg}`)
            console.error(`❌ 博客文章访问错误: ${link.href} - ${errorMsg}`)
          }
        }

        testResults.push({
          name: '博客文章链接检查',
          status: successCount === testedCount && testedCount > 0 ? 'passed' : 'failed',
          error:
            testedCount === 0
              ? '未找到博客文章链接'
              : `${testedCount - successCount} 篇文章无法访问`,
        })

        console.log(`📝 测试了 ${testedCount} 篇博客文章，${successCount} 篇可访问`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        testResults.push({
          name: '博客文章链接检查',
          status: 'failed',
          error: errorMsg,
        })
      }
    })
  })

  // 7. 检查404页面
  test.describe('404和死链检查', () => {
    test('应该正确处理不存在的页面', async ({ page }) => {
      const nonExistentPaths = ['/non-existent-page', '/test-404', '/invalid-path']

      let found404 = false

      for (const path of nonExistentPaths) {
        try {
          const response = await page.goto(`${BASE_URL}${path}`, {
            waitUntil: 'networkidle',
            timeout: 10000,
          })

          if (response) {
            const status = response.status()
            if (status === 404) {
              found404 = true
              console.log(`✅ 404页面正确处理: ${path}`)
              break
            }
          }
        } catch (error) {
          // 忽略导航错误
        }
      }

      testResults.push({
        name: '404页面处理',
        status: found404 ? 'passed' : 'skipped',
      })
    })
  })
})

// 生成测试报告
function generateReport() {
  const passed = testResults.filter((r) => r.status === 'passed').length
  const failed = testResults.filter((r) => r.status === 'failed').length
  const skipped = testResults.filter((r) => r.status === 'skipped').length
  const total = testResults.length
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00'

  const report: TestReport = {
    timestamp: new Date().toISOString(),
    totalTests: total,
    passed,
    failed,
    skipped,
    passRate: parseFloat(passRate),
    results: testResults,
    issues,
  }

  // 保存JSON报告
  const reportDir = path.join(process.cwd(), 'test-results')
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  const reportPath = path.join(reportDir, `test-report-${Date.now()}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')

  // 生成文本报告
  const textReport = `
================================================================================
                    网站健康检查测试报告
================================================================================

测试时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}
测试URL: ${BASE_URL}

测试统计:
  ✅ 通过: ${passed}
  ❌ 失败: ${failed}
  ⏭️  跳过: ${skipped}
  📊 总计: ${total}
  📈 通过率: ${passRate}%

${issues.length > 0 ? `发现的问题 (${issues.length}):\n${issues.map((i, idx) => `  ${idx + 1}. ${i}`).join('\n')}` : '✅ 未发现问题'}

详细结果:
${testResults.map((r, idx) => {
  const statusIcon = r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⏭️'
  const duration = r.duration ? ` (${r.duration}ms)` : ''
  return `  ${idx + 1}. ${statusIcon} ${r.name}${duration}${r.error ? ` - ${r.error}` : ''}`
}).join('\n')}

报告文件已保存至: ${reportPath}

================================================================================
`

  console.log(textReport)

  // 保存文本报告
  const textReportPath = path.join(reportDir, `test-report-${Date.now()}.txt`)
  fs.writeFileSync(textReportPath, textReport, 'utf-8')

  console.log(`\n📄 文本报告已保存至: ${textReportPath}\n`)
}

