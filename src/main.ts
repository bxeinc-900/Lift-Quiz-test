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
  console.log('Global window.startQuiz triggered')
  currentState = 'quiz'
  currentQuestionIndex = 0
  scores = []
  render()
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
  if (modal) {
    modal.classList.remove('active')
  }
}

// @ts-ignore
window.setActiveTab = (tab: 'tax' | 'income' | 'side' | 'risk') => {
  activeCalcTab = tab
  render()
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
      <button class="btn btn-outline" onclick="window.openBookingModal()" style="padding: 0.5rem 1rem; font-size: 0.875rem;">STRATEGY SESSION</button>
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

  // Add Modals to page if not present
  if (!document.querySelector('#booking-modal')) {
    document.body.appendChild(renderBookingModal())
  }
  if (!document.querySelector('#method-modal')) {
    document.body.appendChild(renderMethodModal())
  }
}

function renderBookingModal() {
  const div = document.createElement('div')
  div.className = 'modal-overlay'
  div.id = 'booking-modal'
  div.innerHTML = `
    <div class="modal-content glass">
      <button class="modal-close" onclick="window.closeModal('booking-modal')">&times;</button>
      <div class="modal-header">
        <h2 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Secure Your Strategy Session</h2>
        <p style="color: #8892B0; font-size: 0.9rem;">Select an available time for your forensic analysis below.</p>
      </div>
      <div class="modal-body">
        <iframe src="https://links.wealthvids.com/widget/booking/LwAMMZIaCleIBD0dAVLC" style="width: 100%; height: 700px; border:none; overflow: auto;" id="LwAMMZIaCleIBD0dAVLC_1776035780550"></iframe>
      </div>
    </div>
  `
  
  div.addEventListener('click', (e) => {
    if (e.target === div) window.closeModal('booking-modal')
  })
  
  return div
}

function renderMethodModal() {
  const div = document.createElement('div')
  div.className = 'modal-overlay'
  div.id = 'method-modal'
  div.innerHTML = `
    <div class="modal-content glass" style="max-width: 700px;">
      <button class="modal-close" onclick="window.closeModal('method-modal')">&times;</button>
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
            <button class="btn btn-primary" onclick="window.startQuiz(); window.closeModal('method-modal');" style="width: 100%;">START THE ASSESSMENT</button>
          </div>

        </div>
      </div>
    </div>
  `
  
  div.addEventListener('click', (e) => {
    if (e.target === div) window.closeModal('method-modal')
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
      <button id="learn-method" class="btn btn-outline" onclick="window.openMethodModal()">LEARN THE METHOD</button>
    </div>
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
        <button class="calc-tab ${activeCalcTab === 'tax' ? 'active' : ''}" onclick="window.setActiveTab('tax')">Tax exposure</button>
        <button class="calc-tab ${activeCalcTab === 'income' ? 'active' : ''}" onclick="window.setActiveTab('income')">Income gap</button>
        <button class="calc-tab ${activeCalcTab === 'side' ? 'active' : ''}" onclick="window.setActiveTab('side')">Side-by-side</button>
        <button class="calc-tab ${activeCalcTab === 'risk' ? 'active' : ''}" onclick="window.setActiveTab('risk')">Risk score</button>
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
        
        <button class="btn btn-primary" onclick="window.openBookingModal()" style="padding: 1.5rem 4rem; font-size: 1.25rem;">SECURE YOUR CASE STRATEGY CALL</button>
        <p style="margin-top: 1.5rem; color: #F44336; font-size: 0.9rem; font-weight: 600;">⚠️ WARNING: This window for intervention will permanently close as we approach the 2026 Sunset.</p>
      </div>
    </div>
    </div>
  `;
  
  section.innerHTML = resultsHTML
  return section
}

function renderActiveCalculator() {
  if (activeCalcTab === 'tax') {
    const annualTaxes = calcData.balance * (calcData.bracket / 100)
    const netIncome = calcData.withdrawal - (calcData.withdrawal * (calcData.bracket / 100))
    const totalTaxes = annualTaxes * 25

    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
        <div>
          <div style="margin-bottom: 2rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Current retirement balance</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--accent));">$</span>
              <input type="number" value="${calcData.balance}" onchange="calcData.balance = Number(this.value); render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 1rem 1rem 2rem; border-radius: 8px; color: #fff;">
            </div>
          </div>
          <div style="margin-bottom: 2rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Annual withdrawal needed</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--accent));">$</span>
              <input type="number" value="${calcData.withdrawal}" onchange="calcData.withdrawal = Number(this.value); render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 1rem 1rem 2rem; border-radius: 8px; color: #fff;">
            </div>
          </div>
          <div>
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Your tax bracket in retirement</label>
            <select onchange="calcData.bracket = Number(this.value); render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; color: #fff;">
              <option value="12" ${calcData.bracket === 12 ? 'selected' : ''}>12% federal bracket</option>
              <option value="22" ${calcData.bracket === 22 ? 'selected' : ''}>22% federal bracket</option>
              <option value="24" ${calcData.bracket === 24 ? 'selected' : ''}>24% federal bracket</option>
              <option value="32" ${calcData.bracket === 32 ? 'selected' : ''}>32% federal bracket</option>
              <option value="37" ${calcData.bracket === 37 ? 'selected' : ''}>37% federal bracket</option>
            </select>
          </div>
        </div>
        <div class="result-display">
          <div style="margin-bottom: 2rem;">
            <div class="result-label">ANNUAL TAXES TO IRS</div>
            <div class="result-value value-red">$${annualTaxes.toLocaleString()}</div>
            <p style="font-size: 0.8rem; margin-top: 0.25rem; opacity: 0.7;">${calcData.bracket}% of every withdrawal</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <div class="result-label">YOUR NET ANNUAL INCOME</div>
            <div class="result-value value-green">$${netIncome.toLocaleString()}</div>
          </div>
          <div style="padding: 1.5rem; background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.2); border-radius: 12px;">
            <div class="result-label">TOTAL TAXES OVER 25 YEARS</div>
            <div class="result-value value-red" style="font-size: 2rem;">$${totalTaxes.toLocaleString()}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeCalcTab === 'income') {
    const gap = calcData.withdrawal * 0.4
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
        <div>
          <h3 style="margin-bottom: 1.5rem;">The Retirement Gap</h3>
          <p style="color: #8892B0; margin-bottom: 2rem;">Inflation and rising taxes act as a "Wealth Leak". If your income doesn't adjust, your purchasing power will decline by an estimated 40% over 20 years.</p>
          <div style="margin-bottom: 2rem;">
            <label style="display: block; color: #8892B0; margin-bottom: 0.5rem; font-size: 0.9rem;">Desired Net Income</label>
            <div style="position: relative;">
               <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: hsl(var(--accent));">$</span>
               <input type="number" value="${calcData.withdrawal}" onchange="calcData.withdrawal = Number(this.value); render()" style="width: 100%; background: rgba(2, 12, 27, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 1rem 1rem 2rem; border-radius: 8px; color: #fff;">
            </div>
          </div>
        </div>
        <div class="result-display">
           <div style="margin-bottom: 2rem;">
            <div class="result-label">ESTIMATED INCOME GAP</div>
            <div class="result-value value-red">$${gap.toLocaleString()}</div>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.7;">Annual wealth leak due to inflation/taxes</p>
          </div>
          <div style="padding: 1.5rem; background: rgba(2, 12, 27, 0.3); border: 1px solid hsl(var(--accent)); border-radius: 12px;">
            <div class="result-label text-gold">REQUIRED LIFT MULTIPLIER</div>
            <div class="result-value">2.15x</div>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.7;">To maintain purchasing power</p>
          </div>
        </div>
      </div>
    `;
  }

  if (activeCalcTab === 'side') {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div style="padding: 2rem; background: rgba(244, 67, 54, 0.05); border: 1px solid rgba(244, 67, 54, 0.1); border-radius: 12px;">
          <h3 class="value-red" style="margin-bottom: 1.5rem;">Traditional 401(k)</h3>
          <ul style="list-style: none; color: #8892B0; font-size: 0.95rem;">
            <li style="margin-bottom: 1rem;">❌ Full Tax Exposure</li>
            <li style="margin-bottom: 1rem;">❌ 100% Market Risk</li>
            <li style="margin-bottom: 1rem;">❌ No Inflation Hedge</li>
            <li>❌ "Silent Partner" (IRS)</li>
          </ul>
        </div>
        <div style="padding: 2rem; background: rgba(85, 166, 119, 0.05); border: 1px solid rgba(85, 166, 119, 0.2); border-radius: 12px; border-left: 4px solid hsl(var(--accent));">
          <h3 class="value-green" style="margin-bottom: 1.5rem;">The LIFT Method</h3>
          <ul style="list-style: none; color: #ccd6f6; font-size: 0.95rem;">
            <li style="margin-bottom: 1rem;">✅ 0% Tax Liability</li>
            <li style="margin-bottom: 1rem;">✅ 0% Market Floor</li>
            <li style="margin-bottom: 1rem;">✅ 2.15x Leverage Multiplier</li>
            <li>✅ 100% Control & Privacy</li>
          </ul>
        </div>
      </div>
    `;
  }

  if (activeCalcTab === 'risk') {
    return `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 2rem;">Your Forensic Risk Assessment</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div style="padding: 2rem; background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3); border-radius: 12px;">
            <div class="result-label">Standard Plan After -20% Crash</div>
            <div class="result-value value-red">$${(calcData.balance * 0.8).toLocaleString()}</div>
            <p style="font-size: 0.85rem; margin-top: 1rem; opacity: 0.8;">Market losses plus future tax liability.</p>
          </div>
          <div style="padding: 2rem; background: rgba(85, 166, 119, 0.1); border: 1px solid rgba(85, 166, 119, 0.3); border-radius: 12px;">
            <div class="result-label">LIFT Method Value After -20% Crash</div>
            <div class="result-value value-green">$${calcData.balance.toLocaleString()}</div>
            <p style="font-size: 0.85rem; margin-top: 1rem; opacity: 0.8;">Locked in at current high with 0% Floor.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  return ''
}

// Initial Render
render()
