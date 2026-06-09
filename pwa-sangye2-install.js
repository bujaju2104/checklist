(function () {
    var SW_URL = '/checklist/sw-sangye2.js';
    var deferredPrompt = null;

    if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
    navigator.serviceWorker.register(SW_URL, { scope: '/checklist/' })
    .then(function () {
    console.log('상계2 PWA service worker registered');
    })
    .catch(function (err) {
    console.log('Service worker registration failed:', err);
    });
    });
    }

    window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;

    var installBtn = document.getElementById('pwaInstallBtn');

    if (installBtn) {
      installBtn.style.display = 'block';

        installBtn.onclick = function () {
            installBtn.style.display = 'none';
                deferredPrompt.prompt();

                    deferredPrompt.userChoice.then(function () {
                          deferredPrompt = null;
                              });
                                };
                                }

                                });

                                window.addEventListener('appinstalled', function () {
                                deferredPrompt = null;

                                var installBtn = document.getElementById('pwaInstallBtn');

                                if (installBtn) {
                                  installBtn.style.display = 'none';
                                  }

                                  });

                                  window.requestPwaNotificationPermission = function () {
                                  if (!('Notification' in window)) {
                                  alert('이 브라우저는 알림을 지원하지 않습니다.');
                                  return;
                                  }

                                  Notification.requestPermission().then(function (permission) {
                                    alert('알림 권한: ' + permission);
                                    });

                                    };
                                    })();
