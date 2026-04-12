import './style.css'
import { questions, calculateExposure } from './quiz'

const app = document.querySelector<HTMLDivElement>('#app')!

// --- State Management ---
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

// --- Render Functions ---

function render() {
  app.innerHTML = ''
  
  // Header
  const header = document.createElement('header')
  header.className = 'glass'
  header.style.cssText = 'position: fixed; width: 100%; top: 0; z-index: 50; padding: 1rem 0;'
  header.innerHTML = `
    <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
      <div style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.025em;" class="text-gold">
        AFI GROUP <span style="color: #E6F1FF; font-weight: 400; font-size: 0.9rem; margin-left: 0.5rem; opacity: 0.6;">INVESTIGATIONS</span>
      </div>
      <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">STRATEGY SESSION</button>
    </div>
  `
  app.appendChild(header)

  const main = document.createElement('main')
  main.style.marginTop = '6rem'
  app.appendChild(main)

  if (currentState === 'hero') {
    main.appendChild(renderHero())
  } else if (currentState === 'quiz') {
    main.appendChild(renderQuiz())
  } else if (currentState === 'results') {
    main.appendChild(renderResults())
  }

  // Footer
  const footer = document.createElement('footer')
  footer.style.cssText = 'padding: 4rem 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: auto;'
  footer.innerHTML = `
    <div class="container" style="text-align: center;">
      <p style="color: #8892B0; font-size: 0.875rem; margin-bottom: 1rem;">
        © 2026 The LIFT Method | wealthvids.com | AFI Group
      </p>
      <div style="font-size: 0.75rem; color: #495670; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        Disclaimer: This is for educational purposes only. Financial decisions should be made with a certified professional. 
        Taxes and market risks are subject to individual circumstances. Indexed Universal Life policies involve fees and costs.
      </div>
    </div>
  `
  app.appendChild(footer)

  // Attach Header CTA Listener
  header.querySelector('.btn-outline')?.addEventListener('click', openBookingModal)

  // Attach Learn Method Listener
  if (currentState === 'hero') {
    main.querySelector('#learn-method')?.addEventListener('click', openMethodModal)
  }

  // Add Modals to page if not present
  if (!document.querySelector('#booking-modal')) {
    document.body.appendChild(renderBookingModal())
  }
  if (!document.querySelector('#method-modal')) {
    document.body.appendChild(renderMethodModal())
  }
}

function openBookingModal() {
  const modal = document.querySelector('#booking-modal')
  if (modal) modal.classList.add('active')
  // Ensure the iframe fits correctly
  const iframe = document.querySelector('#booking-modal iframe') as HTMLIFrameElement
  if (iframe) {
    iframe.src = iframe.src // Refresh if needed for resizing
  }
}

function closeBookingModal() {
  const modal = document.querySelector('#booking-modal')
  if (modal) modal.classList.remove('active')
}

function openMethodModal() {
  const modal = document.querySelector('#method-modal')
  if (modal) modal.classList.add('active')
}

function closeMethodModal() {
  const modal = document.querySelector('#method-modal')
  if (modal) modal.classList.remove('active')
}

function renderMethodModal() {
  const div = document.createElement('div')
  div.className = 'modal-overlay'
  div.id = 'method-modal'
  div.innerHTML = `
    <div class="modal-content glass" style="max-width: 700px;">
      <button class="modal-close">&times;</button>
      <div class="modal-header">
        <div class="glass-pill" style="margin-bottom: 1rem;">STRATEGY BRIEFING</div>
        <h2 class="text-gold" style="font-size: 2rem; margin-bottom: 0.5rem;">The LIFT Method</h2>
        <p style="color: #8892B0; font-size: 1rem;">Surgically removing the 'Silent Partners' from your retirement.</p>
      </div>
      <div class="modal-body" style="min-height: auto; padding: 1rem 2rem 3rem;">
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          
          <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.05);">
            <h3 style="color: #E6F1FF; font-size: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
              <span class="text-gold" style="font-size: 1.5rem;">01.</span> The 401(k) "Tax Time Bomb"
            </h3>
            <p style="color: #8892B0; line-height: 1.6; font-size: 0.95rem;">
              The government and Wall Street have a "silent partner" in your 401(k). Every dollar you withdraw is taxed as ordinary income—and the IRS gets to decide their share <span class="value-red" style="font-weight: 600;">after</span> you've already done the work.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
             <div style="background: rgba(85, 166, 119, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(85, 166, 119, 0.1);">
                <h4 class="value-green" style="margin-bottom: 0.5rem;">The Multiplier</h4>
                <p style="font-size: 0.85rem; line-height: 1.5;">Using <strong>Leverage</strong> to multiply your capital's impact without taking on additional market risk.</p>
             </div>
             <div style="background: rgba(255, 226, 89, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 226, 89, 0.1);">
                <h4 class="text-gold" style="margin-bottom: 0.5rem;">Net Spendable</h4>
                <p style="font-size: 0.85rem; line-height: 1.5;">Focusing entirely on <strong>Net Spendable Income</strong>—how much you keep after the IRS takes their cut.</p>
             </div>
          </div>

          <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
            <p style="font-size: 1.1rem; color: #E6F1FF; margin-bottom: 1.5rem;">Ready to see your forensic report?</p>
            <button id="modal-start-quiz" class="btn btn-primary" style="width: 100%;">START THE ASSESSMENT</button>
          </div>

        </div>
      </div>
    </div>
  `
  
  div.querySelector('.modal-close')?.addEventListener('click', closeMethodModal)
  div.addEventListener('click', (e) => {
    if (e.target === div) closeMethodModal()
  })

  div.querySelector('#modal-start-quiz')?.addEventListener('click', () => {
    closeMethodModal()
    currentState = 'quiz'
    render()
  })
  
  return div
}

function renderBookingModal() {
  const div = document.createElement('div')
  div.className = 'modal-overlay'
  div.id = 'booking-modal'
  div.innerHTML = `
    <div class="modal-content glass">
      <button class="modal-close">&times;</button>
      <div class="modal-header">
        <h2 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Secure Your Strategy Session</h2>
        <p style="color: #8892B0; font-size: 0.9rem;">Select an available time for your forensic analysis below.</p>
      </div>
      <div class="modal-body">
        <iframe src="https://links.wealthvids.com/widget/booking/LwAMMZIaCleIBD0dAVLC" style="width: 100%; height: 700px; border:none; overflow: auto;" id="LwAMMZIaCleIBD0dAVLC_1776035780550"></iframe>
      </div>
    </div>
  `
  
  div.querySelector('.modal-close')?.addEventListener('click', closeBookingModal)
  div.addEventListener('click', (e) => {
    if (e.target === div) closeBookingModal()
  })
  
  return div
}

function renderHero() {
  const section = document.createElement('section')
  section.className = 'hero container animate-fade-in'
  section.innerHTML = `
    <div class="glass-pill">URGENT INVESTIGATION: 2026 TAX SUNSET</div>
    <h1>Is Your Retirement Plan a <br/> <span class="text-gold">Tax Time Bomb?</span></h1>
    <p>
      The government and Wall Street have a "silent partner" in your 401(k). 
      Discover how the LIFT Method surgically removes market and tax risk to protect your net spendable income.
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button id="start-quiz" class="btn btn-primary" onclick="window.startQuiz()">START ASSESSMENT</button>
      <button id="learn-method" class="btn btn-outline">LEARN THE METHOD</button>
    </div>
  `
  return section
}

// @ts-ignore
window.startQuiz = () => {
  console.log('Global window.startQuiz triggered')
  currentState = 'quiz'
  render()
}

function renderQuiz() {
  const q = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / questions.length) * 100
  
  const section = document.createElement('section')
  section.className = 'container animate-fade-in'
  section.innerHTML = `
    <div class="quiz-container glass">
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
  
  let resultsHTML = `
    <div class="results-header">
      <div class="glass-pill" style="border-color: #F44336; color: #F44336;">PRIVATE INVESTIGATION REPORT</div>
      <h1 style="font-size: 3.5rem;">Analysis Status: <span class="text-gold">${exposure}</span></h1>
      <p style="margin-top: 1rem; max-width: 800px; margin-left: auto; margin-right: auto;">
        Our investigation shows significant vulnerabilities in your current retirement architecture. 
        Watch the briefing and use the personal calculators below to see the impact.
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
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Your Personal Retirement Calculators</h2>
        <p style="color: #8892B0;">Enter your numbers. See the real impact.</p>
      </div>

      <div class="calc-tabs">
        <button class="calc-tab ${activeCalcTab === 'tax' ? 'active' : ''}" data-tab="tax">Tax exposure</button>
        <button class="calc-tab ${activeCalcTab === 'income' ? 'active' : ''}" data-tab="income">Income gap</button>
        <button class="calc-tab ${activeCalcTab === 'side' ? 'active' : ''}" data-tab="side">Side-by-side</button>
        <button class="calc-tab ${activeCalcTab === 'risk' ? 'active' : ''}" data-tab="risk">Risk score</button>
      </div>

      <div class="calc-card glass">
        ${renderActiveCalculator()}
      </div>
    </section>

    <div style="text-align: center; padding: 6rem 0;">
    <div class="cta-banner glass animate-fade-in" style="margin-top: 4rem; padding: 4rem 2rem; border: 1px solid rgba(255, 226, 89, 0.2); background: radial-gradient(circle at top right, rgba(255, 226, 89, 0.05), transparent);">
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <div class="glass-pill" style="border-color: #F44336; color: #F44336; margin-bottom: 2rem; letter-spacing: 2px;">FINAL CASE SUMMARY: URGENT INTERVENTION</div>
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2;">Intercept The <span class="text-gold">IRS Partnership</span> Before It's Too Late.</h2>
        
        <div style="background: rgba(2, 12, 27, 0.6); border-radius: 12px; padding: 2rem; margin: 2.5rem 0; border: 1px solid rgba(255, 255, 255, 0.05); text-align: left;">
          <p style="color: #CCD6F6; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            The calculations are undeniable. Based on your inputs, the <strong>2026 Tax Sunset</strong> is not a theoretical risk—it is a mathematical certainty that will surgically reduce your net spendable income.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); pt: 1.5rem; padding-top: 1.5rem;">
            <div>
              <span style="display: block; font-size: 0.75rem; color: #8892B0; text-transform: uppercase; letter-spacing: 1px;">Case Status</span>
              <span class="value-red" style="font-weight: 700;">Critical Exposure</span>
            </div>
            <div>
              <span style="display: block; font-size: 0.75rem; color: #8892B0; text-transform: uppercase; letter-spacing: 1px;">Analysis Quality</span>
              <span class="value-green" style="font-weight: 700;">Forensic Confirmed</span>
            </div>
            <div>
              <span style="display: block; font-size: 0.75rem; color: #8892B0; text-transform: uppercase; letter-spacing: 1px;">Current Capacity</span>
              <span class="text-gold" style="font-weight: 700;">Only 2 Slots Left</span>
            </div>
          </div>
        </div>

        <p style="margin-bottom: 2.5rem; color: #8892B0; font-size: 1rem; line-height: 1.6;">
          Due to the forensic nature of these analysis sessions, we only have capacity for 3 private consults this week. Intercept the IRS before they claim their "silent partnership" in your life's work.
        </p>
        
        <button class="btn btn-primary" style="padding: 1.5rem 4rem; font-size: 1.25rem;">SECURE YOUR CASE STRATEGY CALL</button>
        <p style="margin-top: 1.5rem; color: #F44336; font-size: 0.9rem; font-weight: 600;">⚠️ WARNING: This window for intervention will permanently close as we approach the 2026 Sunset.</p>
      </div>
    </div>
    </div>
  `
  
  section.innerHTML = resultsHTML

  // Targeted update logic
  const updateResultsDisplay = (container: Element) => {
    if (activeCalcTab === 'tax') {
      const annualTax = calcData.withdrawal * (calcData.bracket / 100)
      const netIncome = calcData.withdrawal - annualTax
      const totalTax25 = annualTax * 25
      const accessible = calcData.balance * (1 - (calcData.bracket / 100))
      const youPercent = 100 - calcData.bracket

      // Update output text nodes
      const values = container.querySelectorAll('.result-value')
      if (values[0]) values[0].textContent = `$${annualTax.toLocaleString()}`
      if (values[1]) values[1].textContent = `$${netIncome.toLocaleString()}`
      if (values[2]) values[2].textContent = `$${totalTax25.toLocaleString()}`
      if (values[3]) values[3].textContent = `$${accessible.toLocaleString()}`

      // Update bar segments
      const barYou = container.querySelector('.bar-you') as HTMLElement
      const barIRS = container.querySelector('.bar-irs') as HTMLElement
      if (barYou) {
        barYou.style.width = `${youPercent}%`
        barYou.textContent = `You ${youPercent}%`
      }
      if (barIRS) {
        barIRS.style.width = `${calcData.bracket}%`
        barIRS.textContent = `IRS ${calcData.bracket}%`
      }

      const footerTextSpan = container.querySelector('.calc-footer-text')
      if (footerTextSpan) {
        footerTextSpan.innerHTML = `Of every $${calcData.withdrawal.toLocaleString()} withdrawn, <span class="value-red">$${annualTax.toLocaleString()}</span> goes to taxes before you can spend it.`
      }
    } else if (activeCalcTab === 'income') {
        const fees401k = calcData.balance * 0.01
        const taxes401k = calcData.withdrawal * (calcData.bracket / 100)
        const v = container.querySelectorAll('.result-value')
        if (v[0]) v[0].textContent = `$${fees401k.toLocaleString()}`
        if (v[1]) v[1].textContent = `$${taxes401k.toLocaleString()}`
    } else if (activeCalcTab === 'risk') {
        const crashValue = calcData.balance * 0.8
        const v = container.querySelectorAll('.result-value')
        if (v[0]) v[0].textContent = `$${crashValue.toLocaleString()}`
        if (v[1]) v[1].textContent = `$${calcData.balance.toLocaleString()}`
    }
  }

  const attachInputListeners = (container: Element) => {
    const inputs = [
        container.querySelector('#balance') as HTMLInputElement,
        container.querySelector('#withdrawal') as HTMLInputElement,
        container.querySelector('#bracket') as HTMLSelectElement
    ]

    inputs.forEach(input => {
      input?.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement
        const val = parseInt(target.value) || 0
        if (target.id === 'balance') calcData.balance = val
        if (target.id === 'withdrawal') calcData.withdrawal = val
        if (target.id === 'bracket') calcData.bracket = val
        
        updateResultsDisplay(container)
      })
    })
  }

  // Event Listeners for tabs
  section.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      activeCalcTab = target.dataset.tab as any
      
      // Update Tab Visuals
      section.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'))
      target.classList.add('active')
      
      // Update Card Content
      const calcCard = section.querySelector('.calc-card')
      if (calcCard) {
        calcCard.innerHTML = renderActiveCalculator()
        attachInputListeners(calcCard)
      }
    })
  })

  // Attach Result CTA Listener
  section.querySelector('.btn-primary')?.addEventListener('click', openBookingModal)

  // Initial attachment
  const calcCard = section.querySelector('.calc-card')
  if (calcCard) attachInputListeners(calcCard)

  return section
}

function renderActiveCalculator() {
  if (activeCalcTab === 'tax') {
    const annualTax = calcData.withdrawal * (calcData.bracket / 100)
    const netIncome = calcData.withdrawal - annualTax
    const totalTax25 = annualTax * 25
    const accessible = calcData.balance * (1 - (calcData.bracket / 100))
    const youPercent = 100 - calcData.bracket
    
    return `
      <div class="animate-fade-in">
        <p style="margin-bottom: 2rem; color: #CCD6F6; line-height: 1.6;">Every dollar withdrawn from a traditional 401(k) is taxed as ordinary income. See exactly what the IRS will claim before you can spend a dollar of it.</p>
        
        <div class="calc-grid">
          <div>
            <div class="input-group">
              <label class="input-label">Current retirement balance</label>
              <div class="input-field-wrapper">
                <span class="input-symbol">$</span>
                <input type="number" id="balance" class="input-element" value="${calcData.balance}">
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Annual withdrawal needed</label>
              <div class="input-field-wrapper">
                <span class="input-symbol">$</span>
                <input type="number" id="withdrawal" class="input-element" value="${calcData.withdrawal}">
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Your tax bracket in retirement</label>
              <select id="bracket" class="input-element select-element">
                <option value="10" ${calcData.bracket === 10 ? 'selected' : ''}>10% federal bracket</option>
                <option value="12" ${calcData.bracket === 12 ? 'selected' : ''}>12% federal bracket</option>
                <option value="22" ${calcData.bracket === 22 ? 'selected' : ''}>22% federal bracket</option>
                <option value="24" ${calcData.bracket === 24 ? 'selected' : ''}>24% federal bracket</option>
                <option value="32" ${calcData.bracket === 32 ? 'selected' : ''}>32% federal bracket</option>
                <option value="35" ${calcData.bracket === 35 ? 'selected' : ''}>35% federal bracket</option>
                <option value="37" ${calcData.bracket === 37 ? 'selected' : ''}>37% federal bracket</option>
              </select>
            </div>
          </div>

          <div class="result-group">
            <div class="result-item">
              <span class="result-label">Annual taxes to IRS</span>
              <span class="result-value value-red">$${annualTax.toLocaleString()}</span>
              <span style="font-size: 0.9rem; color: #8892B0;">${calcData.bracket}% of every withdrawal</span>
            </div>
            <div class="result-item">
              <span class="result-label">Your net annual income</span>
              <span class="result-value value-green">$${netIncome.toLocaleString()}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Total taxes over 25 years</span>
              <span class="result-value value-red">$${totalTax25.toLocaleString()}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Accessible balance (after-tax)</span>
              <span class="result-value value-gold">$${accessible.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="bar-chart-container">
          <div class="bar-chart-label">Where each withdrawal dollar goes</div>
          <div class="bar-chart">
            <div class="bar-segment bar-you" style="width: ${youPercent}%">You ${youPercent}%</div>
            <div class="bar-segment bar-irs" style="width: ${calcData.bracket}%">IRS ${calcData.bracket}%</div>
          </div>
          <p class="calc-footer-text">Of every $${calcData.withdrawal.toLocaleString()} withdrawn, <span class="value-red">$${annualTax.toLocaleString()}</span> goes to taxes before you can spend it.</p>
        </div>
      </div>
    `
  }

  if (activeCalcTab === 'income') {
    const fees401k = calcData.balance * 0.01 // 1% fees
    const taxes401k = calcData.withdrawal * (calcData.bracket / 100)
    
    return `
      <div class="animate-fade-in">
        <p style="margin-bottom: 2rem; color: #CCD6F6; line-height: 1.6;">Comparing the "Death by a Thousand Cuts" (401k fees + taxes) vs the LIFT Method Efficiency.</p>
        <div class="calc-grid">
          <div>
            <h3 class="text-gold" style="margin-bottom: 2rem; font-size: 1.5rem;">The 401(k) Leakage</h3>
            <div class="result-item" style="margin-bottom: 2rem;">
              <span class="result-label">Est. Annual Management Fees (1%)</span>
              <span class="result-value value-red">$${fees401k.toLocaleString()}</span>
            </div>
            <div class="result-item">
              <span class="result-label">Est. Annual Tax Liability (${calcData.bracket}%)</span>
              <span class="result-value value-red">$${taxes401k.toLocaleString()}</span>
            </div>
          </div>
          <div style="background: rgba(85, 166, 119, 0.1); padding: 2rem; border-radius: 12px; border: 1px solid rgba(85, 166, 119, 0.3);">
            <h3 class="value-green" style="margin-bottom: 1.5rem; font-size: 1.5rem;">The LIFT Advantage</h3>
            <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">By using the LIFT method, you legally bypass the ordinary income tax trap on your distributions.</p>
            <div class="result-item">
              <span class="result-label">Net Spendable Cash Flow Efficiency</span>
              <span class="result-value value-green">95.4%</span>
              <span style="font-size: 0.9rem; color: #8892B0;">vs 401(k)'s ~74% efficiency</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  if (activeCalcTab === 'side') {
    return `
      <div class="animate-fade-in">
        <h3 class="text-gold" style="margin-bottom: 2rem; font-size: 1.5rem;">Direct Comparison: $${calcData.balance.toLocaleString()} Portfolio</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
            <span style="font-weight: 700;">FEATURE</span>
            <span style="font-weight: 700; text-align: center;">TRADITIONAL 401(K)</span>
            <span style="font-weight: 700; text-align: right;" class="text-gold">LIFT METHOD</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: center; padding: 1.5rem 1rem;">
            <span>Market Downside</span>
            <span style="text-align: center;" class="value-red">Unlimited Risk</span>
            <span style="text-align: right;" class="value-green">0% Floor Protection</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: center; padding: 1.5rem 1rem; background: rgba(255,255,255,0.03);">
            <span>Taxation</span>
            <span style="text-align: center;" class="value-red">Deferred (Tax Time Bomb)</span>
            <span style="text-align: right;" class="value-green">Tax-Free Distributions</span>
          </div>
           <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: center; padding: 1.5rem 1rem;">
            <span>Access To Capital</span>
            <span style="text-align: center;">Age 59.5 Restriction</span>
            <span style="text-align: right;" class="value-green">Immediate & Liquid</span>
          </div>
        </div>
      </div>
    `
  }

  if (activeCalcTab === 'risk') {
    return `
      <div class="animate-fade-in" style="text-align: center;">
        <h3 class="text-gold" style="margin-bottom: 2rem; font-size: 1.8rem;">Portfolio Stress Test</h3>
        <div style="max-width: 600px; margin: 0 auto;">
          <p style="margin-bottom: 3rem; line-height: 1.6;">If the market drops 20% tomorrow, your 401(k) loses 20%. To recover that loss, you need a 25% gain just to break even.</p>
          
          <div style="padding: 2rem; background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3); border-radius: 12px; margin-bottom: 2rem;">
            <div class="result-label">401(k) Value After -20% Crash</div>
            <div class="result-value value-red">$${(calcData.balance * 0.8).toLocaleString()}</div>
          </div>

          <div style="padding: 2rem; background: rgba(85, 166, 119, 0.1); border: 1px solid rgba(85, 166, 119, 0.3); border-radius: 12px;">
            <div class="result-label">LIFT Method Value After -20% Crash</div>
            <div class="result-value value-green">$${calcData.balance.toLocaleString()}</div>
            <p style="font-size: 0.85rem; margin-top: 1rem; opacity: 0.8;">Locked in at current high with 0% Floor.</p>
          </div>
        </div>
      </div>
    `
  }
  
  return ''
}

// Initial Render
render()
