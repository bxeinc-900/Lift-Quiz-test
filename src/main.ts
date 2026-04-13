import './style.css'
import { questions, calculateExposure } from './quiz'

const app = document.querySelector<HTMLDivElement>('#app')!

// --- Global State ---
let currentState: 'hero' | 'quiz' | 'results' = 'hero'
let currentQuestionIndex = 0
let scores: number[] = []
let activeCalcTab: 'tax' | 'income' | 'side' | 'risk' = 'tax'

// Calculator Inputs State
let calcData = {
  balance: 500000,
  withdrawal: 40000,
  bracket: 22
}

// --- Global Fail-Safe Handlers ---
// @ts-ignore
window.startQuiz = () => {
  currentState = 'quiz'
  currentQuestionIndex = 0
  scores = []
  render()
  window.scrollTo(0, 0)
}

// @ts-ignore
window.openBookingModal = () => {
  const modal = document.querySelector('#booking-modal')
  if (modal) {
    modal.classList.add('active')
    const iframe = modal.querySelector('iframe') as HTMLIFrameElement
    if (iframe) iframe.src = iframe.src
  }
}

// @ts-ignore
window.openMethodModal = () => {
  const modal = document.querySelector('#method-modal')
  if (modal) modal.classList.add('active')
}

// @ts-ignore
window.closeModal = (id: string) => {
  const modal = document.querySelector(`#${id}`)
  if (modal) modal.classList.remove('active')
}

// @ts-ignore
window.setActiveTab = (tab: 'tax' | 'income' | 'side' | 'risk') => {
  activeCalcTab = tab
  render()
}

// Expose calcData and render globally so inline onchange handlers in innerHTML can access them
// @ts-ignore
window.calcData = calcData
// @ts-ignore
window.render = render

// --- Initialization ---
function initModals() {
  if (!document.querySelector('#booking-modal')) {
    const booking = document.createElement('div')
    booking.className = 'modal-overlay'
    booking.id = 'booking-modal'
    booking.innerHTML = `
      <div class="modal-content glass">
        <button class="modal-close" onclick="window.closeModal('booking-modal')">&times;</button>
        <div class="modal-header">
          <h2 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Schedule a Strategy Session</h2>
          <p style="color: #8892B0; font-size: 0.9rem;">Select an available time for your complimentary retirement analysis.</p>
        </div>
        <div class="modal-body">
          <iframe src="https://links.wealthvids.com/widget/booking/LwAMMZIaCleIBD0dAVLC" style="width: 100%; height: 700px; border:none; overflow: auto;" id="LwAMMZIaCleIBD0dAVLC_1776035780550"></iframe>
        </div>
        <div style="padding: 1rem 2rem 2rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
          <p style="font-size: 0.75rem; color: #495670; line-height: 1.5;">
            This is a complimentary educational consultation. No products will be sold during this call. 
            Results discussed are hypothetical and for illustrative purposes only. 
            Past performance of any financial strategy does not guarantee future results.
          </p>
        </div>
      </div>
    `
    document.body.appendChild(booking)
    booking.addEventListener('click', (e) => { if (e.target === booking) (window as any).closeModal('booking-modal') })
  }

  if (!document.querySelector('#method-modal')) {
    const method = document.createElement('div')
    method.className = 'modal-overlay'
    method.id = 'method-modal'
    method.innerHTML = `
      <div class="modal-content glass" style="max-width: 700px;">
        <button class="modal-close" onclick="window.closeModal('method-modal')">&times;</button>
        <div class="modal-header">
          <div class="glass-pill" style="margin-bottom: 1rem;">EDUCATIONAL OVERVIEW</div>
          <h2 class="text-gold" style="font-size: 2rem; margin-bottom: 0.5rem;">The LIFT Method</h2>
          <p style="color: #8892B0; font-size: 1rem;">A framework for maximizing net spendable retirement income.</p>
        </div>
        <div class="modal-body" style="min-height: auto; padding: 1rem 2rem 2rem;">
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.05);">
              <h3 style="color: #E6F1FF; font-size: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                <span class="text-gold" style="font-size: 1.5rem;">01.</span> The Tax-Deferred Account Trade-Off
              </h3>
              <p style="color: #8892B0; line-height: 1.6; font-size: 0.95rem;">
                Traditional 401(k) and IRA accounts defer taxes—but do not eliminate them. Every withdrawal is taxed as ordinary income at whatever rate applies <em>at the time of withdrawal</em>. Since future tax rates are set by Congress and may change, your after-tax income in retirement may differ significantly from projections.
              </p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
               <div style="background: rgba(85, 166, 119, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(85, 166, 119, 0.1);">
                  <h4 class="value-green" style="margin-bottom: 0.5rem;">Leverage</h4>
                  <p style="font-size: 0.85rem; line-height: 1.5;">Using properly structured IUL policies to allow capital to earn index-linked interest while simultaneously serving as collateral for tax-free policy loans.</p>
               </div>
               <div style="background: rgba(255, 226, 89, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 226, 89, 0.1);">
                  <h4 class="text-gold" style="margin-bottom: 0.5rem;">Net Spendable Income</h4>
                  <p style="font-size: 0.85rem; line-height: 1.5;">The focus is on the income you actually keep after all taxes and fees — not the gross account balance.</p>
               </div>
            </div>
            <div style="background: rgba(2, 12, 27, 0.5); border-radius: 8px; padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.05); font-size: 0.8rem; color: #495670; line-height: 1.5;">
              <strong style="color: #8892B0;">Important Disclosure:</strong> IUL policies involve insurance charges, fees, and costs that reduce their value. Policy loans, if not repaid, can reduce the death benefit and may cause the policy to lapse. This is a general educational overview and not a recommendation for any specific product. Results vary based on individual circumstances, health status, and policy terms. Always consult a licensed, qualified financial professional before making any financial decisions.
            </div>
            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
              <p style="font-size: 1.1rem; color: #E6F1FF; margin-bottom: 1.5rem;">Take the assessment to see your personalized analysis.</p>
              <button class="btn btn-primary" onclick="window.startQuiz(); window.closeModal('method-modal');" style="width: 100%;">START THE ASSESSMENT</button>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(method)
    method.addEventListener('click', (e) => { if (e.target === method) (window as any).closeModal('method-modal') })
  }
}

// --- Render Logic ---
function render() {
  app.innerHTML = ''

  const header = document.createElement('header')
  header.className = 'glass'
  header.style.cssText = 'position: fixed; width: 100%; top: 0; z-index: 100; padding: 1rem 0;'
  header.innerHTML = `
    <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
      <div style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.025em;" class="text-gold">
        AFI GROUP <span style="color: #E6F1FF; font-weight: 400; font-size: 0.9rem; margin-left: 0.5rem; opacity: 0.6;">RETIREMENT STRATEGIES</span>
      </div>
      <button class="btn btn-outline" onclick="window.openBookingModal()" style="padding: 0.5rem 1rem; font-size: 0.875rem;">SCHEDULE CONSULTATION</button>
    </div>
  `
  app.appendChild(header)

  const main = document.createElement('main')
  main.style.marginTop = '6rem'
  main.style.position = 'relative'
  main.style.zIndex = '50'
  app.appendChild(main)

  if (currentState === 'hero') {
    main.appendChild(renderHero())
  } else if (currentState === 'quiz') {
    main.appendChild(renderQuiz())
  } else if (currentState === 'results') {
    main.appendChild(renderResults())
  }

  const footer = document.createElement('footer')
  footer.style.cssText = 'padding: 4rem 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: auto; position: relative; z-index: 50;'
  footer.innerHTML = `
    <div class="container" style="text-align: center;">
      <p style="color: #8892B0; font-size: 0.875rem; margin-bottom: 0.75rem;">
        © 2026 The LIFT Method | <a href="https://wealthvids.com" target="_blank" style="color: #8892B0;">wealthvids.com</a> | AFI Group
      </p>
      <p style="font-size: 0.8rem; color: #8892B0; margin-bottom: 1.5rem;">
        <a href="/privacy-policy" target="_blank" style="color: #64FFDA; text-decoration: none;">Privacy Policy</a>
      </p>
      <div class="footer-disclaimer">
        <p><strong>Educational Content Disclaimer:</strong> The information on this website is for educational and informational purposes only and does not constitute financial, tax, legal, or investment advice. Results shown in calculators are hypothetical illustrations only and do not represent actual past or future performance of any financial product or strategy. Individual results will vary based on many factors including age, health, tax situation, income, and market conditions.</p>
        <p style="margin-top: 0.75rem;"><strong>IUL Disclosure:</strong> Indexed Universal Life (IUL) insurance is a life insurance product, not a securities or investment product. IUL policies include insurance charges and fees that reduce cash value accumulation. Policy loans reduce the death benefit and cash value. If a policy lapses with an outstanding loan, adverse tax consequences may result. Not all individuals will qualify for coverage. Always consult with a licensed insurance professional and independent tax advisor.</p>
        <p style="margin-top: 0.75rem;"><strong>Not Affiliated with Facebook:</strong> This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</p>
        <p style="margin-top: 0.75rem;"><strong>No Guarantee of Results:</strong> Any income or return projections are illustrative only. The LIFT Method and AFI Group do not guarantee any specific financial outcome. Consult a qualified, licensed financial advisor before making any financial decisions.</p>
      </div>
    </div>
  `
  app.appendChild(footer)
}

function renderHero() {
  const section = document.createElement('section')
  section.className = 'hero container animate-fade-in'
  section.style.position = 'relative'
  section.style.zIndex = '100'
  section.innerHTML = `
    <div class="glass-pill">RETIREMENT RISK ANALYSIS</div>
    <h1>Is Your Retirement Plan <br/> <span class="text-gold">Maximizing What You Keep?</span></h1>
    <p>
      Most retirement accounts defer taxes — they don't eliminate them. 
      Discover how the LIFT Method focuses on maximizing your net spendable income in retirement.
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; z-index: 101;">
      <button id="start-quiz-btn" class="btn btn-primary" onclick="window.startQuiz()" style="cursor: pointer; position: relative; z-index: 102;">START FREE ASSESSMENT</button>
      <button id="learn-method-btn" class="btn btn-outline" onclick="window.openMethodModal()" style="cursor: pointer; position: relative; z-index: 102;">LEARN THE METHOD</button>
    </div>
    <p style="font-size: 0.8rem; color: #495670; margin-top: 2rem;">
      For educational purposes only. This assessment does not constitute financial advice.
    </p>
  `
  return section
}

function renderQuiz() {
  const q = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / questions.length) * 100
  const section = document.createElement('section')
  section.className = 'container animate-fade-in'
  section.innerHTML = `
    <div class="quiz-container glass">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-size: 0.85rem; color: #8892B0;">Question ${currentQuestionIndex + 1} of ${questions.length}</span>
        <span style="font-size: 0.85rem; color: #64FFDA;">Educational Assessment</span>
      </div>
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width: ${progress}%"></div>
      </div>
      <div class="quiz-question">${q.text}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">${opt.text}</button>
        `).join('')}
      </div>
    </div>
  `
  section.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt((e.target as HTMLElement).dataset.index!)
      scores.push(q.options[index].score)
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++
        render()
      } else {
        currentState = 'results'
        render()
      }
    })
  })
  return section
}

function renderResults() {
  const exposure = calculateExposure(scores)
  const section = document.createElement('section')
  section.className = 'container animate-fade-in'

  // Determine exposure color for visual indicator
  const exposureColor = exposure.includes('Critical') ? '#F44336' : exposure.includes('Moderate') ? '#FF9800' : '#4CAF50'

  section.innerHTML = `
    <div class="results-header">
      <div class="glass-pill" style="border-color: ${exposureColor}; color: ${exposureColor};">RETIREMENT ANALYSIS RESULTS</div>
      <h1 style="font-size: 3.5rem;">Risk Profile: <span style="color: ${exposureColor};">${exposure}</span></h1>
      <p style="margin-top: 1rem; max-width: 800px; margin-left: auto; margin-right: auto;">
        Based on your responses, here is your personalized retirement risk analysis. 
        Watch the overview video and use the calculators below to explore potential scenarios.
      </p>
      <p style="font-size: 0.8rem; color: #495670; margin-top: 1rem; max-width: 700px; margin-left: auto; margin-right: auto;">
        <em>Results are based on your self-reported answers and are for illustrative and educational purposes only. This is not a formal financial assessment. Consult a licensed advisor for personalized guidance.</em>
      </p>
    </div>

    <div class="video-container">
      <div class="wistia_embed wistia_async_23c4x4wrb1 videoFoam=true" style="height:100%;position:absolute;top:0;left:0;width:100%">
        <div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;">
          <img src="https://fast.wistia.com/embed/medias/23c4x4wrb1/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" onload="this.parentNode.style.opacity=1;" />
        </div>
      </div>
    </div>

    <section class="calculator-section">
      <div style="text-align: center; margin-bottom: 3rem;">
        <div style="height: 2px; width: 60px; background: hsl(var(--accent)); margin: 0 auto 1.5rem;"></div>
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Illustrative Retirement Calculators</h2>
        <p style="color: #8892B0;">Enter your numbers to explore hypothetical scenarios. For illustrative purposes only.</p>
      </div>

      <div class="calc-tabs">
        <button class="calc-tab ${activeCalcTab === 'tax' ? 'active' : ''}" onclick="window.setActiveTab('tax')">Tax Exposure</button>
        <button class="calc-tab ${activeCalcTab === 'income' ? 'active' : ''}" onclick="window.setActiveTab('income')">Income Gap</button>
        <button class="calc-tab ${activeCalcTab === 'side' ? 'active' : ''}" onclick="window.setActiveTab('side')">Side-by-Side</button>
        <button class="calc-tab ${activeCalcTab === 'risk' ? 'active' : ''}" onclick="window.setActiveTab('risk')">Risk Scenario</button>
      </div>

      <div class="calc-card glass">
        ${renderActiveCalculator()}
      </div>
      <p style="font-size: 0.75rem; color: #495670; text-align: center; margin-top: 1.5rem; line-height: 1.5;">
        ⚠️ Calculator results are hypothetical illustrations only. They assume constant tax rates and do not account for investment fees, inflation, state taxes, required minimum distributions, or other factors that affect actual retirement income. Past performance does not guarantee future results.
      </p>
    </section>

    <div style="padding: 4rem 0;">
      <div class="cta-banner glass" style="padding: 4rem 2rem; border: 1px solid rgba(255, 226, 89, 0.2); background: radial-gradient(circle at top right, rgba(255, 226, 89, 0.05), transparent);">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <div class="glass-pill" style="margin-bottom: 2rem;">NEXT STEP: PERSONALIZED ANALYSIS</div>
          <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2;">See How the LIFT Method <span class="text-gold">Applies to Your Situation</span></h2>

          <div style="background: rgba(2, 12, 27, 0.6); border-radius: 12px; padding: 2rem; margin: 2.5rem 0; border: 1px solid rgba(255, 255, 255, 0.05); text-align: left;">
            <p style="color: #CCD6F6; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
              Based on your assessment, there may be meaningful opportunities to improve your retirement income strategy. A complimentary strategy session will explore your specific situation in detail and identify any areas where your current approach may be leaving money on the table.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
              <div>
                <span style="display: block; font-size: 0.75rem; color: #8892B0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">Session Type</span>
                <span class="value-green" style="font-weight: 700;">Complimentary</span>
              </div>
              <div>
                <span style="display: block; font-size: 0.75rem; color: #8892B0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">Duration</span>
                <span style="color: #E6F1FF; font-weight: 700;">30–45 Minutes</span>
              </div>
              <div>
                <span style="display: block; font-size: 0.75rem; color: #8892B0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">Commitment</span>
                <span class="text-gold" style="font-weight: 700;">Zero Obligation</span>
              </div>
            </div>
          </div>

          <button class="btn btn-primary" onclick="window.openBookingModal()" style="padding: 1.5rem 4rem; font-size: 1.2rem;">SCHEDULE YOUR COMPLIMENTARY CALL</button>
          <p style="margin-top: 1.5rem; color: #8892B0; font-size: 0.85rem;">No products will be sold. This is a complimentary educational consultation only.</p>
        </div>
      </div>
    </div>
  `
  return section
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function renderActiveCalculator() {
  if (activeCalcTab === 'tax') {
    const annualTaxes = calcData.withdrawal * (calcData.bracket / 100)
    const netIncome = calcData.withdrawal - annualTaxes
    const totalTaxes25yr = annualTaxes * 25
    // Effective rate illustration: marginal bracket applied to full withdrawal.
    // Real tax would be lower due to standard deduction; we note this in the disclaimer.
    const withdrawalRate = ((annualTaxes / calcData.withdrawal) * 100).toFixed(1)

    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
        <div>
          <h3 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Your Inputs</h3>
          <div style="margin-bottom: 2rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Current retirement balance</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--accent));">$</span>
              <input type="number" value="${calcData.balance}" onchange="window.calcData.balance = Number(this.value); window.render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 1rem 1rem 2rem; border-radius: 8px; color: #fff; font-size: 1rem;">
            </div>
          </div>
          <div style="margin-bottom: 2rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Annual withdrawal amount</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--accent));">$</span>
              <input type="number" value="${calcData.withdrawal}" onchange="window.calcData.withdrawal = Number(this.value); window.render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 1rem 1rem 2rem; border-radius: 8px; color: #fff; font-size: 1rem;">
            </div>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Assumed tax bracket in retirement</label>
            <select onchange="window.calcData.bracket = Number(this.value); window.render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; color: #fff; font-size: 1rem;">
              <option value="12" ${calcData.bracket === 12 ? 'selected' : ''}>12% — Up to $47,150 (single) / $94,300 (married)</option>
              <option value="22" ${calcData.bracket === 22 ? 'selected' : ''}>22% — Up to $100,525 (single) / $201,050 (married)</option>
              <option value="24" ${calcData.bracket === 24 ? 'selected' : ''}>24% — Up to $191,950 (single) / $383,900 (married)</option>
              <option value="32" ${calcData.bracket === 32 ? 'selected' : ''}>32% — Up to $243,725 (single) / $487,450 (married)</option>
              <option value="37" ${calcData.bracket === 37 ? 'selected' : ''}>37% — Above $609,350 (single) / $731,200 (married)</option>
            </select>
          </div>
          <p style="font-size: 0.75rem; color: #495670; line-height: 1.4;">2026 federal marginal income tax brackets shown for reference. Tax rates are set by Congress and subject to change. This illustration applies your selected bracket to the full withdrawal — actual taxes may be lower due to standard deductions. State income taxes not included.</p>
        </div>
        <div class="result-display">
          <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(244, 67, 54, 0.08); border: 1px solid rgba(244, 67, 54, 0.15); border-radius: 12px;">
            <div class="result-label">ESTIMATED ANNUAL TAX ON WITHDRAWALS</div>
            <div class="result-value value-red">$${fmt(annualTaxes)}</div>
            <p style="font-size: 0.8rem; margin-top: 0.25rem; opacity: 0.7;">${withdrawalRate}% of $${fmt(calcData.withdrawal)} withdrawal (marginal rate)</p>
          </div>
          <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(85, 166, 119, 0.08); border: 1px solid rgba(85, 166, 119, 0.15); border-radius: 12px;">
            <div class="result-label">ESTIMATED NET ANNUAL INCOME</div>
            <div class="result-value value-green">$${fmt(netIncome)}</div>
            <p style="font-size: 0.8rem; margin-top: 0.25rem; opacity: 0.7;">After estimated federal income tax only</p>
          </div>
          <div style="padding: 1.5rem; background: rgba(244, 67, 54, 0.05); border: 1px solid rgba(244, 67, 54, 0.1); border-radius: 12px;">
            <div class="result-label">HYPOTHETICAL TOTAL TAX OVER 25 YEARS</div>
            <div class="result-value value-red" style="font-size: 2rem;">$${fmt(totalTaxes25yr)}</div>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; color: #495670;">Assumes same withdrawal and same tax bracket each year. No RMDs, no state tax, no inflation adjustment.</p>
          </div>
        </div>
      </div>
    `
  }

  if (activeCalcTab === 'income') {
    // Inflation: 3% over 20 years = 1.03^20 = ~1.806 multiplier
    const inflationMultiplier = Math.pow(1.03, 20)
    // Gross withdrawal needed in year 20 to maintain same purchasing power after taxes
    const grossNeededYear20 = (calcData.withdrawal * inflationMultiplier) / (1 - calcData.bracket / 100)
    const inflationOnlyGap = Math.round(calcData.withdrawal * (inflationMultiplier - 1))
    const taxDragToday = Math.round(calcData.withdrawal * (calcData.bracket / 100))

    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
        <div>
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">The Income Gap Illustration</h3>
          <p style="color: #8892B0; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6;">How much more will you need to withdraw in 20 years just to keep the same take-home income — accounting for inflation and taxes?</p>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Annual net income you want in retirement</label>
            <div style="position: relative;">
               <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--accent));">$</span>
               <input type="number" value="${calcData.withdrawal}" onchange="window.calcData.withdrawal = Number(this.value); window.render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 1rem 1rem 2rem; border-radius: 8px; color: #fff; font-size: 1rem;">
            </div>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Assumed tax bracket in retirement</label>
            <select onchange="window.calcData.bracket = Number(this.value); window.render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; color: #fff; font-size: 1rem;">
              <option value="12" ${calcData.bracket === 12 ? 'selected' : ''}>12%</option>
              <option value="22" ${calcData.bracket === 22 ? 'selected' : ''}>22%</option>
              <option value="24" ${calcData.bracket === 24 ? 'selected' : ''}>24%</option>
              <option value="32" ${calcData.bracket === 32 ? 'selected' : ''}>32%</option>
              <option value="37" ${calcData.bracket === 37 ? 'selected' : ''}>37%</option>
            </select>
          </div>
          <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 1rem; font-size: 0.8rem; color: #495670; line-height: 1.5;">
            Assumptions: 3% annual inflation compounded over 20 years (1.03²⁰ ≈ 1.81×). Tax applied at your selected bracket to the full withdrawal. State taxes not included.
          </div>
        </div>
        <div class="result-display">
          <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: rgba(244, 67, 54, 0.08); border: 1px solid rgba(244, 67, 54, 0.15); border-radius: 12px;">
            <div class="result-label">ANNUAL TAX DRAG (TODAY)</div>
            <div class="result-value value-red">$${fmt(taxDragToday)}</div>
            <p style="font-size: 0.75rem; margin-top: 0.25rem; color: #495670;">${calcData.bracket}% marginal rate on $${fmt(calcData.withdrawal)} withdrawal</p>
          </div>
          <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: rgba(244, 67, 54, 0.05); border: 1px solid rgba(244, 67, 54, 0.1); border-radius: 12px;">
            <div class="result-label">INFLATION GAP AFTER 20 YEARS</div>
            <div class="result-value value-red">+$${fmt(inflationOnlyGap)}/yr</div>
            <p style="font-size: 0.75rem; margin-top: 0.25rem; color: #495670;">Additional income needed just to match inflation (3% × 20 yrs)</p>
          </div>
          <div style="padding: 1.5rem; background: rgba(255, 226, 89, 0.05); border: 1px solid rgba(255, 226, 89, 0.15); border-radius: 12px;">
            <div class="result-label text-gold">GROSS WITHDRAWAL NEEDED IN YEAR 20</div>
            <div class="result-value">$${fmt(grossNeededYear20)}</div>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; color: #495670;">To net same purchasing power as $${fmt(calcData.withdrawal)} today, after ${calcData.bracket}% tax + 3% inflation × 20 yrs</p>
          </div>
        </div>
      </div>
    `
  }

  if (activeCalcTab === 'side') {
    return `
      <div>
        <h3 style="text-align: center; margin-bottom: 2rem; font-size: 1.25rem;">Hypothetical Comparison: Traditional 401(k) vs. LIFT Strategy</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div style="padding: 2rem; background: rgba(244, 67, 54, 0.05); border: 1px solid rgba(244, 67, 54, 0.1); border-radius: 12px;">
            <h3 class="value-red" style="margin-bottom: 1.5rem;">Traditional 401(k) / IRA</h3>
            <ul style="list-style: none; color: #8892B0; font-size: 0.95rem; line-height: 2;">
              <li>⚠️ All withdrawals taxed as ordinary income</li>
              <li>⚠️ Subject to Required Minimum Distributions (RMDs) at age 73+</li>
              <li>⚠️ 100% exposed to market downturns</li>
              <li>⚠️ Tax rate set by Congress — subject to change</li>
              <li>⚠️ No death benefit</li>
            </ul>
          </div>
          <div style="padding: 2rem; background: rgba(85, 166, 119, 0.05); border: 1px solid rgba(85, 166, 119, 0.2); border-radius: 12px; border-left: 4px solid hsl(var(--accent));">
            <h3 class="value-green" style="margin-bottom: 1.5rem;">LIFT Strategy (IUL-Based)</h3>
            <ul style="list-style: none; color: #ccd6f6; font-size: 0.95rem; line-height: 2;">
              <li>✅ Policy loans can be tax-free (if structured properly)</li>
              <li>✅ No RMD requirements</li>
              <li>✅ Indexed growth with 0% floor on downturns*</li>
              <li>✅ Death benefit provides legacy protection</li>
              <li>✅ No contribution limits after funding phase</li>
            </ul>
          </div>
        </div>
        <div style="background: rgba(2, 12, 27, 0.5); border-radius: 8px; padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.05); font-size: 0.75rem; color: #495670; line-height: 1.5;">
          *The 0% floor applies to the index-linked interest crediting rate, not to the total cash value which is reduced by ongoing policy charges and fees. Tax-free loans assume the policy remains in force and does not lapse. This comparison is a simplified illustration. Actual results depend on policy structure, carrier, health classification, and many other factors. This is not a recommendation to purchase any specific product.
        </div>
      </div>
    `
  }

  if (activeCalcTab === 'risk') {
    const crashValue = Math.round(calcData.balance * 0.8)
    const crashLoss = calcData.balance - crashValue
    const taxDragAnnual = Math.round(calcData.withdrawal * (calcData.bracket / 100))
    // After a crash, the 401k holder must still withdraw — but from a shrunken pool
    // Years to recovery at 7% average annual return
    const yearsToRecover = Math.ceil(Math.log(calcData.balance / crashValue) / Math.log(1.07))
    // If withdrawing during recovery, the hole is deeper — illustrative only
    const effectiveLossWithWithdrawal = Math.round(crashLoss + (calcData.withdrawal * yearsToRecover))

    return `
      <div>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem;">
          <div style="text-align: center; padding: 0.5rem 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <span style="font-size: 0.75rem; color: #8892B0; display: block;">BALANCE</span>
            <span style="font-weight: 700; color: #E6F1FF;">$${fmt(calcData.balance)}</span>
          </div>
          <div style="text-align: center; padding: 0.5rem 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <span style="font-size: 0.75rem; color: #8892B0; display: block;">ANNUAL WITHDRAWAL</span>
            <span style="font-weight: 700; color: #E6F1FF;">$${fmt(calcData.withdrawal)}</span>
          </div>
          <div style="text-align: center; padding: 0.5rem 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <span style="font-size: 0.75rem; color: #8892B0; display: block;">TAX BRACKET</span>
            <span style="font-weight: 700; color: #E6F1FF;">${calcData.bracket}%</span>
          </div>
        </div>
        <div style="margin-bottom: 1rem; text-align: center;">
          <label style="color: #8892B0; font-size: 0.85rem; margin-right: 1rem;">Change balance:</label>
          <input type="number" value="${calcData.balance}" onchange="window.calcData.balance = Number(this.value); window.render()" style="background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 8px; color: #fff; font-size: 0.9rem; width: 180px;">
          <label style="color: #8892B0; font-size: 0.85rem; margin-left: 1rem; margin-right: 1rem;">Tax bracket:</label>
          <select onchange="window.calcData.bracket = Number(this.value); window.render()" style="background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 8px; color: #fff; font-size: 0.9rem;">
            <option value="12" ${calcData.bracket === 12 ? 'selected' : ''}>12%</option>
            <option value="22" ${calcData.bracket === 22 ? 'selected' : ''}>22%</option>
            <option value="24" ${calcData.bracket === 24 ? 'selected' : ''}>24%</option>
            <option value="32" ${calcData.bracket === 32 ? 'selected' : ''}>32%</option>
            <option value="37" ${calcData.bracket === 37 ? 'selected' : ''}>37%</option>
          </select>
        </div>
        <h3 style="text-align: center; margin-bottom: 1rem; font-size: 1.25rem;">Hypothetical Sequence of Returns Risk Scenario</h3>
        <p style="text-align: center; color: #8892B0; margin-bottom: 2rem; font-size: 0.9rem; line-height: 1.5;">A 20% market decline early in retirement is particularly damaging because you are selling depreciated assets to fund withdrawals — preventing full recovery.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;">
          <div style="padding: 1.5rem; background: rgba(244, 67, 54, 0.08); border: 1px solid rgba(244, 67, 54, 0.2); border-radius: 12px;">
            <div class="result-label">TRADITIONAL ACCOUNT AFTER 20% CRASH</div>
            <div class="result-value value-red">$${fmt(crashValue)}</div>
            <p style="font-size: 0.85rem; margin-top: 0.75rem; color: #8892B0;">Immediate loss: $${fmt(crashLoss)}</p>
            <p style="font-size: 0.85rem; color: #8892B0;">Assumed recovery time (7%/yr avg): ~${yearsToRecover} years</p>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; color: #F44336;">Effective loss including withdrawals during recovery: ~$${fmt(effectiveLossWithWithdrawal)}</p>
          </div>
          <div style="padding: 1.5rem; background: rgba(85, 166, 119, 0.08); border: 1px solid rgba(85, 166, 119, 0.2); border-radius: 12px;">
            <div class="result-label">IUL WITH 0% FLOOR — AFTER SAME CRASH*</div>
            <div class="result-value value-green">$${fmt(calcData.balance)}</div>
            <p style="font-size: 0.85rem; margin-top: 0.75rem; color: #8892B0;">Index interest credited: $0 (floored at 0%, not negative)</p>
            <p style="font-size: 0.85rem; color: #8892B0;">Cash value reduced by ongoing policy charges</p>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; color: #4CAF50;">No recovery period required — no market loss applied</p>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
          <div style="padding: 1.25rem; background: rgba(255, 226, 89, 0.05); border: 1px solid rgba(255, 226, 89, 0.1); border-radius: 12px;">
            <div class="result-label text-gold">ANNUAL TAX ON WITHDRAWALS</div>
            <div class="result-value" style="font-size: 1.75rem;">$${fmt(taxDragAnnual)}/yr</div>
            <p style="font-size: 0.75rem; margin-top: 0.25rem; color: #495670;">From 401k at ${calcData.bracket}% bracket</p>
          </div>
          <div style="padding: 1.25rem; background: rgba(100, 255, 218, 0.05); border: 1px solid rgba(100, 255, 218, 0.1); border-radius: 12px;">
            <div class="result-label" style="color: #64FFDA;">TAX ON IUL POLICY LOANS</div>
            <div class="result-value" style="font-size: 1.75rem; color: #64FFDA;">$0/yr*</div>
            <p style="font-size: 0.75rem; margin-top: 0.25rem; color: #495670;">Policy loans are not taxable income if policy stays in force</p>
          </div>
        </div>
        <div style="background: rgba(2, 12, 27, 0.5); border-radius: 8px; padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.05); font-size: 0.75rem; color: #495670; line-height: 1.5;">
          *Hypothetical scenarios only. The 0% floor applies to indexed interest crediting only — ongoing policy charges, cost of insurance, and admin fees are still deducted from cash value. Policy loans reduce death benefit. If the policy lapses with an outstanding loan balance, the loan amount may become taxable income. Recovery time estimate assumes 7% average annual return with no further withdrawals during recovery — actual recovery scenarios depend on withdrawal rate, sequence, and market returns. This is not a guarantee of any outcome.
        </div>
      </div>
    `
  }
  return ''
}

initModals()
render()
