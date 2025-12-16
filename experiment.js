(function() {
    'use strict';
    
    if (window._samsungUXApplied) return;
    window._samsungUXApplied = true;
    
    console.log('🚀 Samsung UX - Duke filluar...');
    
    /* ========== 1. STYLES ========== */
    const style = document.createElement('style');
    style.textContent = `
        .samsung-ux-voucher-btn {
            color: #0074c8;
            text-decoration: underline;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            margin: 8px 0;
            padding: 5px 0;
            font-family: inherit;
            display: inline-block;
        }
        
        .samsung-ux-badge {
            background: #f2f2f2;
            color: #1f1f1f;
            border-radius: 14px;
            padding: 8px 16px;
            font-size: 13px;
            margin: 10px 0;
            display: inline-block;
        }
        
        .samsung-ux-trade-link {
            color: #0074c8;
            background: none;
            border: none;
            padding: 0;
            font-size: 13px;
            cursor: pointer;
            margin-top: 8px;
            text-decoration: underline;
            display: block;
        }
        
        /* Hide only the form, not entire sections */
        .samsung-ux-form-hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    /* ========== 2. VOUCHER TOGGLE - Ndryshuar ========== */
    function addVoucherToggle() {
    // Kontrollo nëse ekziston tashmë
    const existingBtn = document.querySelector('.samsung-ux-voucher-btn');
    if (existingBtn) {
        return;
    }
    
    // Kërko për voucher form me strategji të ndryshme
    let voucherForm = null;
    let voucherInput = null;
    let applyButton = null;
    
    // Strategy 1: Look for forms with voucher-related text
    const forms = document.querySelectorAll('form, div[class*="voucher"], div[class*="coupon"], div[class*="promo"]');
    
    for (let form of forms) {
        const text = form.textContent || '';
        if (text.toLowerCase().includes('voucher') || 
            text.toLowerCase().includes('promo') || 
            text.toLowerCase().includes('code')) {
            
            voucherInput = form.querySelector('input[type="text"], input[type="email"]');
            if (voucherInput) {
                voucherForm = form;
                
                // Find apply button - FIXED: don't use :contains()
                applyButton = form.querySelector('button[type="submit"]');
                
                // If no button in form, look for any button with text containing "Apply"
                if (!applyButton) {
                    const allButtons = form.querySelectorAll('button');
                    for (let btn of allButtons) {
                        if (btn.textContent && btn.textContent.toLowerCase().includes('apply')) {
                            applyButton = btn;
                            break;
                        }
                    }
                }
                
                // If still no button, look nearby
                if (!applyButton) {
                    const nearbyButtons = form.parentElement?.querySelectorAll('button');
                    for (let btn of nearbyButtons || []) {
                        if (btn.textContent && btn.textContent.toLowerCase().includes('apply')) {
                            applyButton = btn;
                            break;
                        }
                    }
                }
                
                break;
            }
        }
    }
    
    // Strategy 2: Look for input with voucher placeholder
    if (!voucherInput) {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
        for (let input of inputs) {
            const placeholder = (input.placeholder || '').toLowerCase();
            const name = (input.name || '').toLowerCase();
            const id = (input.id || '').toLowerCase();
            
            if (placeholder.includes('voucher') || placeholder.includes('promo') || placeholder.includes('code') ||
                name.includes('voucher') || name.includes('promo') || name.includes('code') ||
                id.includes('voucher') || id.includes('promo') || id.includes('code')) {
                
                voucherInput = input;
                voucherForm = input.closest('form, div, tr, td') || input.parentElement;
                
                // Find apply button - FIXED: don't use :contains()
                applyButton = voucherForm.querySelector('button[type="submit"]');
                if (!applyButton) {
                    // Look for any button with "Apply" text
                    const allButtons = voucherForm.querySelectorAll('button');
                    for (let btn of allButtons) {
                        if (btn.textContent && btn.textContent.toLowerCase().includes('apply')) {
                            applyButton = btn;
                            break;
                        }
                    }
                }
                
                if (!applyButton) {
                    const siblingBtn = voucherForm.nextElementSibling?.querySelector('button');
                    if (siblingBtn && siblingBtn.textContent && siblingBtn.textContent.toLowerCase().includes('apply')) {
                        applyButton = siblingBtn;
                    }
                }
                
                break;
            }
        }
    }
    
    if (!voucherForm || !voucherInput) {
        console.log('⚠️ Nuk u gjet voucher form');
        return;
    }
    
    // Mark the form as processed
    if (voucherForm.dataset.voucherToggleAdded) {
        return;
    }
    voucherForm.dataset.voucherToggleAdded = 'true';
    
    // Hide the form initially
    voucherForm.style.display = 'none';
    if (applyButton) {
        applyButton.style.display = 'none';
    }
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'samsung-ux-voucher-btn';
    toggleBtn.textContent = 'Have a voucher?';
    toggleBtn.setAttribute('aria-expanded', 'false');
    
    // Add CSS for better appearance
    toggleBtn.style.cssText = `
        color: #0074c8;
        text-decoration: underline;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        margin: 8px 0;
        padding: 5px 0;
        font-family: inherit;
        display: inline-block;
        width: auto;
    `;
    
    // Insert toggle button where the form was
    voucherForm.parentNode.insertBefore(toggleBtn, voucherForm);
    
    // Toggle functionality
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isHidden = voucherForm.style.display === 'none';
        
        if (isHidden) {
            // Show form and apply button
            voucherForm.style.display = '';
            if (applyButton) {
                applyButton.style.display = '';
                // Position apply button properly
                if (!voucherForm.contains(applyButton)) {
                    voucherForm.appendChild(applyButton);
                }
            }
            toggleBtn.textContent = 'Hide voucher';
            toggleBtn.setAttribute('aria-expanded', 'true');
            
            // Focus on input
            setTimeout(() => {
                voucherInput.focus();
            }, 50);
        } else {
            // Hide form and apply button
            voucherForm.style.display = 'none';
            if (applyButton) {
                applyButton.style.display = 'none';
            }
            toggleBtn.textContent = 'Have a voucher?';
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Keyboard support
    toggleBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleBtn.click();
        }
    });
    
    // Preserve original form submission
    if (voucherForm.tagName === 'FORM') {
        voucherForm.addEventListener('submit', function() {
            // Hide form after successful submission
            setTimeout(() => {
                voucherForm.style.display = 'none';
                if (applyButton) applyButton.style.display = 'none';
                toggleBtn.textContent = 'Have a voucher?';
                toggleBtn.setAttribute('aria-expanded', 'false');
            }, 500);
        });
    } else if (applyButton) {
        // Handle apply button click
        applyButton.addEventListener('click', function() {
            // Hide form after clicking apply
            setTimeout(() => {
                voucherForm.style.display = 'none';
                if (applyButton) applyButton.style.display = 'none';
                toggleBtn.textContent = 'Have a voucher?';
                toggleBtn.setAttribute('aria-expanded', 'false');
            }, 500);
        });
    }
    
    // Handle cart re-renders
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if our elements were removed
                if (!document.body.contains(toggleBtn) || !document.body.contains(voucherForm)) {
                    observer.disconnect();
                    // Remove the flag so it can be recreated
                    delete voucherForm.dataset.voucherToggleAdded;
                    // Try again after a short delay
                    setTimeout(addVoucherToggle, 500);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Voucher toggle u shtua me sukses!');
}
    
    /* ========== 3. HOLIDAY BADGE ========== */
    function addHolidayBadge() {
        // Gjej "Summary" seksionin
        const elements = document.querySelectorAll('div, aside, section');
        
        for (let element of elements) {
            const text = element.textContent || '';
            
            if (text.includes('Summary') || text.includes('Total') || 
                text.includes('Checkout')) {
                
                // Kontrollo nëse badge ekziston
                if (element.querySelector('.samsung-ux-badge')) {
                    return;
                }
                
                // Shto badge
                const badge = document.createElement('div');
                badge.className = 'samsung-ux-badge';
                badge.textContent = 'Free holiday returns until 10 January 2026';
                
                // Vendos në fillim të seksionit
                element.insertBefore(badge, element.firstChild);
                
                console.log('✅ Holiday badge u shtua');
                return;
            }
        }
    }
    
    /* ========== 4. TRADE-IN TEASER ========== */
    function addTradeInTeaser() {
        // Gjej çmimin e produktit
        const priceElements = document.querySelectorAll('span, div, strong');
        
        for (let priceEl of priceElements) {
            const text = priceEl.textContent || '';
            
            if ((text.includes('£') || text.includes('$')) && 
                text.length < 20) { // Është çmim, jo tekst i gjatë
                
                // Kontrollo nëse linku ekziston
                if (priceEl.parentNode.querySelector('.samsung-ux-trade-link')) {
                    return;
                }
                
                // Shto linkun për trade-in
                const tradeLink = document.createElement('button');
                tradeLink.type = 'button';
                tradeLink.className = 'samsung-ux-trade-link';
                tradeLink.textContent = 'Trade-in savings available';
                
                // Vendos poshtë çmimit
                priceEl.parentNode.appendChild(tradeLink);
                
                // Kur klikohet
                tradeLink.addEventListener('click', function() {
                    // Gjej trade-in seksionin
                    const allSections = document.querySelectorAll('div, section');
                    
                    for (let section of allSections) {
                        const sectionText = section.textContent || '';
                        if (sectionText.includes('Trade In') || sectionText.includes('Trade-in')) {
                            // Shkoni tek ai seksion
                            section.scrollIntoView({behavior: 'smooth'});
                            break;
                        }
                    }
                });
                
                console.log('✅ Trade-in teaser u shtua');
                return;
            }
        }
    }
    
    /* ========== 5. BRAND TEXT UPDATE ========== */
    function updateBrandText() {
        // Zbuloni markën e telefonit
        let brand = 'your smartphone';
        const ua = navigator.userAgent.toLowerCase();
        
        if (ua.includes('iphone')) brand = 'iPhone';
        else if (ua.includes('samsung')) brand = 'Samsung';
        else if (ua.includes('google') || ua.includes('pixel')) brand = 'Google';
        else if (ua.includes('huawei')) brand = 'Huawei';
        else if (ua.includes('motorola')) brand = 'Motorola';
        
        console.log('📱 Marka e zbuluar:', brand);
        
        // Ndrysho tekstin e trade-in
        const elements = document.querySelectorAll('p, span, div');
        
        for (let element of elements) {
            const text = element.textContent || '';
            
            if (text.includes('Trade in your') || 
                text.includes('trade in your')) {
                
                // Kontrollo nëse është ndryshuar tashmë
                if (element.dataset.brandUpdated) {
                    return;
                }
                
                // Ndrysho me markën e përdoruesit
                element.textContent = text.replace(/your (old )?device/i, `your ${brand}`);
                element.dataset.brandUpdated = 'true';
                
                console.log('✅ Teksti u ndryshua me', brand);
                return;
            }
        }
    }
    
    /* ========== 6. INITIALIZE ========== */
    function init() {
        console.log('🔄 Duke inicializuar...');
        
        addVoucherToggle();
        addHolidayBadge();
        addTradeInTeaser();
        updateBrandText();
    }
    
    // Ekzekuto kur faqja është gati
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 1000);
        });
    } else {
        setTimeout(init, 1000);
    }
    
    console.log('✅ Samsung UX script u ngarkua');
})();