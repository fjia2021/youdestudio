// Consent Mode v2 + Klaro configuration. Must load synchronously in <head>, before klaro.js.
// Google Tag Manager is NOT requested until the visitor has accepted at least one category
// (Consent Mode "basic" implementation); consent signals are always sent before GTM loads.
(function () {
  var GTM_ID = 'GTM-5TCSFN7T';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted'
  });
  gtag('set', 'ads_data_redaction', true);

  var gtmLoaded = false;
  function loadGtm() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    window.gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  function setConsent(keys, granted) {
    var state = {};
    keys.forEach(function (k) { state[k] = granted ? 'granted' : 'denied'; });
    gtag('consent', 'update', state);
    if (granted) loadGtm();
  }

  // Cookies are removed by Klaro when consent is withdrawn (host-only and parent-domain variants).
  function gaCookies(re) {
    return [[re, '/'], [re, '/', 'youdestudio.com'], [re, '/', '.youdestudio.com']];
  }

  window.klaroConfig = {
    version: 1,
    elementID: 'klaro',
    styling: { theme: ['light', 'bottom', 'right'] },
    htmlTexts: true,
    groupByPurpose: true,
    storageMethod: 'cookie',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 180,
    default: false,
    mustConsent: false,
    acceptAll: true,
    hideDeclineAll: false,
    hideLearnMore: false,

    translations: {
      de: {
        privacyPolicyUrl: '/datenschutz/',
        imprintUrl: '/impressum/',
        ok: 'Alle akzeptieren',
        acceptAll: 'Alle akzeptieren',
        acceptSelected: 'Auswahl speichern',
        decline: 'Alle ablehnen',
        consentNotice: {
          description: 'Ich möchte Google Tag Manager einsetzen, um die Nutzung der Website zu messen und den Erfolg von Werbung (Google Ads) zu bewerten. Das geschieht nur mit Ihrer Einwilligung, die Sie jederzeit widerrufen können.',
          learnMore: 'Einstellungen'
        },
        consentModal: {
          title: 'Datenschutz-Einstellungen',
          description: 'Hier können Sie entscheiden, welche Kategorien Sie zulassen. Ohne Einwilligung wird nichts von Google geladen. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Seitenende ändern.'
        },
        purposes: {
          analytics: {
            title: 'Statistik',
            description: 'Diese Tags messen, wie die Website genutzt wird (z. B. Google Analytics).'
          },
          advertising: {
            title: 'Marketing',
            description: 'Diese Tags messen den Erfolg von Google Ads (Conversions) und dienen der Werbeoptimierung.'
          }
        },
        gtmAnalytics: {
          title: 'Google Tag Manager: Statistik',
          description: 'Messung der Websitenutzung über Tags im Google Tag Manager (z. B. Google Analytics). Anbieter: Google Ireland Limited / Google LLC.'
        },
        gtmAds: {
          title: 'Google Tag Manager: Marketing (Google Ads)',
          description: 'Conversion-Messung und Werbeoptimierung für Google Ads über Tags im Google Tag Manager. Anbieter: Google Ireland Limited / Google LLC.'
        }
      },
      en: {
        privacyPolicyUrl: '/en/privacy/',
        imprintUrl: '/en/impressum/',
        ok: 'Accept all',
        acceptAll: 'Accept all',
        acceptSelected: 'Save selection',
        decline: 'Decline all',
        consentNotice: {
          description: 'I would like to use Google Tag Manager to measure website usage and the success of advertising (Google Ads). This only happens with your consent, which you can withdraw at any time.',
          learnMore: 'Settings'
        },
        consentModal: {
          title: 'Privacy settings',
          description: 'Choose which categories you allow. Without consent nothing is loaded from Google. You can change your choice at any time via "Cookie settings" in the footer.'
        },
        purposes: {
          analytics: {
            title: 'Statistics',
            description: 'These tags measure how the website is used (e.g. Google Analytics).'
          },
          advertising: {
            title: 'Marketing',
            description: 'These tags measure the success of Google Ads (conversions) and are used for ad optimisation.'
          }
        },
        gtmAnalytics: {
          title: 'Google Tag Manager: Statistics',
          description: 'Measures website usage through tags in Google Tag Manager (e.g. Google Analytics). Provider: Google Ireland Limited / Google LLC.'
        },
        gtmAds: {
          title: 'Google Tag Manager: Marketing (Google Ads)',
          description: 'Conversion measurement and ad optimisation for Google Ads through tags in Google Tag Manager. Provider: Google Ireland Limited / Google LLC.'
        }
      }
    },

    services: [
      {
        name: 'gtmAnalytics',
        purposes: ['analytics'],
        cookies: [].concat(gaCookies(/^_ga/), gaCookies(/^_gid$/), gaCookies(/^_gat/)),
        callback: function (consent) { setConsent(['analytics_storage'], consent); }
      },
      {
        name: 'gtmAds',
        purposes: ['advertising'],
        cookies: [].concat(gaCookies(/^_gcl_/), gaCookies(/^_gac_/)),
        callback: function (consent) {
          setConsent(['ad_storage', 'ad_user_data', 'ad_personalization'], consent);
        }
      }
    ]
  };

  // Footer link to reopen the consent dialog.
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-consent-settings]');
    if (el && window.klaro) {
      e.preventDefault();
      window.klaro.show();
    }
  });
})();
