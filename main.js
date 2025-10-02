(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
    });
  }

  const form = document.getElementById('verify-form');
  const result = document.getElementById('verify-result');

  function maskAadhaar(a) {
    if (!a || a.length < 4) return '****';
    return '********' + a.slice(-4);
  }

  function setResult(type, message) {
    result.className = 'verify-result ' + type;
    result.textContent = message;
  }

  function validateAadhaar(a) {
    return /^\d{12}$/.test(a);
  }

  function validateIFSC(code) {
    return /^[A-Z]{4}0[0-9A-Z]{6}$/.test(code.toUpperCase());
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const aadhaar = (document.getElementById('aadhaar').value || '').trim();
      const account = (document.getElementById('account').value || '').trim();
      const ifsc = (document.getElementById('ifsc').value || '').trim();

      if (!validateAadhaar(aadhaar)) {
        setResult('err', 'Enter a valid 12-digit Aadhaar number.');
        return;
      }
      if (account.length < 6) {
        setResult('err', 'Enter a valid bank account number.');
        return;
      }
      if (!validateIFSC(ifsc)) {
        setResult('err', 'Enter a valid IFSC code (e.g., SBIN0000001).');
        return;
      }

      setResult('warn', 'Checking NPCI mapper…');

      setTimeout(() => {
        const lastDigit = parseInt(aadhaar.slice(-1), 10);
        if (lastDigit % 2 === 0) {
          setResult('ok', `DBT-enabled ✓ — Aadhaar ${maskAadhaar(aadhaar)} is ready to receive scholarships.`);
        } else {
          setResult('warn', 'Not DBT-enabled — Download the pre-filled form from your school portal and visit your bank branch to activate DBT.');
        }
      }, 900);
    });
  }

  // Chatbot
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const bodyEl = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatText = document.getElementById('chat-text');

  function addMsg(text, fromMe) {
    const el = document.createElement('div');
    el.className = 'chat-msg' + (fromMe ? ' me' : '');
    el.innerHTML = `<div class="from">${fromMe ? 'You' : 'Assistant'}</div><div>${text}</div>`;
    bodyEl.appendChild(el);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function botReply(user) {
    const q = (user || '').toLowerCase();
    if (!q) return "I can help with DBT enablement steps, forms, eligibility, and common errors.";

    if (q.includes('aadhaar') && q.includes('dbt')) {
      return "Aadhaar-linked is not the same as DBT-enabled. You must ask your bank to enable DBT in the NPCI mapper. Use Verify to check, and if not enabled, download/submit the bank consent form.";
    }
    if (q.includes('how') && (q.includes('enable') || q.includes('activate'))) {
      return "To enable DBT: 1) Visit your bank with Aadhaar + passbook, 2) Submit the DBT/Aadhaar seeding consent form, 3) Ask staff to update NPCI mapper, 4) Re-check status here after 2-3 days.";
    }
    if (q.includes('why') && (q.includes('bounce') || q.includes('failed'))) {
      return "Scholarship payments bounce when the account is not DBT-enabled in NPCI mapper. Verify status here; if not enabled, follow the corrective workflow and submit the bank form.";
    }
    if (q.includes('ifsc') || q.includes('account')) {
      return "Ensure IFSC matches your branch and your account number is correct. If mismatched, verification will fail; please re-enter and try again.";
    }
    if (q.includes('eligibility')) {
      return "Eligibility follows your scholarship scheme rules. Our platform focuses on DBT readiness. Please check your scheme page for academic/income criteria.";
    }
    if (q.includes('language') || q.includes('hindi')) {
      return "The platform supports multiple languages. Use the top-right toggle to switch language for easier guidance.";
    }
    if (q.includes('contact') || q.includes('help')) {
      return "For offline support, contact your school admin or Gram Panchayat help desk. You can also write to support@samarthdbt.example.";
    }
    return "I didn’t fully get that. You can ask: ‘How to enable DBT?’, ‘Why did my scholarship bounce?’, or ‘What’s the difference between Aadhaar-linked and DBT-enabled?’";
  }

  function openChat() {
    panel.hidden = false;
    panel.setAttribute('aria-modal', 'true');
    if (!bodyEl.dataset.init) {
      addMsg("Hello! I’m your SamarthDBT assistant. Ask me about DBT enablement, verification, or corrections.", false);
      bodyEl.dataset.init = '1';
    }
    setTimeout(() => chatText && chatText.focus(), 50);
  }
  function closeChat() {
    panel.hidden = true;
    panel.setAttribute('aria-modal', 'false');
  }

  if (launcher && panel && closeBtn && bodyEl && chatForm && chatText) {
    launcher.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    chatForm.addEventListener('submit', function(e){
      e.preventDefault();
      const text = (chatText.value || '').trim();
      if (!text) return;
      addMsg(text, true);
      chatText.value = '';
      setTimeout(() => {
        addMsg(botReply(text), false);
      }, 250);
    });
  }
})(); 