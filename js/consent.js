(function(){
  'use strict';

  var CONSENT_KEY = 'tp_consent'; // 'granted' | 'denied'
  var GA_MEASUREMENT_ID = 'G-CGPGZR9Y07';
  var GTM_ID = 'GTM-5SJZF69M';

  function setConsent(value){
    try{ localStorage.setItem(CONSENT_KEY, value); }catch(e){}
  }
  function getConsent(){
    try{ return localStorage.getItem(CONSENT_KEY); }catch(e){ return null; }
  }

  function loadGA(){
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    // Default consent denied until user action
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    // Load GA library
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    // Init GA
    gtag('js', new Date());
    // GA4 anonymizes IP by default; no extra flag needed
    gtag('config', GA_MEASUREMENT_ID);
  }

  function grantAnalytics(){
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
  }

  function loadGTM(){
    if (window.__gtmLoaded) return; window.__gtmLoaded = true;
    (function(w,d,s,l,i){
      w[l]=w[l]||[]; w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
      j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);
  }

  function startAnalytics(){
    loadGA();
    grantAnalytics();
    loadGTM();
  }

  function buildBanner(){
    var style = document.createElement('style');
    style.textContent = '\n.tp-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#1a1a1a;color:#fff;padding:12px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;box-shadow:0 -2px 12px rgba(0,0,0,.2)}\n.tp-consent p{margin:0;flex:1;min-width:220px;font-size:.9rem;line-height:1.4}\n.tp-consent .tp-actions{display:flex;gap:8px}\n.tp-consent button{border:0;border-radius:6px;padding:8px 12px;cursor:pointer;font-weight:600}\n.tp-consent .tp-accept{background:#22c55e;color:#0b2b16}\n.tp-consent .tp-decline{background:#374151;color:#fff}\n@media (max-width:480px){.tp-consent{padding:10px}.tp-consent p{font-size:.85rem}}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'tp-consent';
    bar.innerHTML = '\n      <p>We use privacy-friendly analytics to improve the site. Click Accept to enable analytics. You can change this anytime in your browser settings.</p>\n      <div class="tp-actions">\n        <button class="tp-decline" type="button" aria-label="Decline analytics">Decline</button>\n        <button class="tp-accept" type="button" aria-label="Accept analytics">Accept</button>\n      </div>';
    document.body.appendChild(bar);

    var acc = bar.querySelector('.tp-accept');
    var dec = bar.querySelector('.tp-decline');
    acc.addEventListener('click', function(){
      setConsent('granted');
      startAnalytics();
      bar.remove();
    });
    dec.addEventListener('click', function(){
      setConsent('denied');
      bar.remove();
    });
  }

  function init(){
    var choice = getConsent();
    if (choice === 'granted') {
      startAnalytics();
      return;
    }
    if (choice === 'denied') {
      return; // do nothing
    }
    // No choice stored: show banner
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }

  init();
})();
