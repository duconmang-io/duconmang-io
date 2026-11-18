/* duconmang.io.vn - nút Ủng hộ (trái tim) neo góc phải màn hình.
   Bấm vào: mở hộp thoại, cảnh 3D (Seasonal QR, MIT/CC0) đổ xuống thành mã QR quét được.
   Cảnh đổi theo giờ trong ngày của người xem. Không cookie, không gửi dữ liệu đi đâu.
   Gắn: <script src="/assets/donate.js" data-qr-base="https://duconmang.io.vn/qr/" defer></script> */
(function () {
  var me = document.currentScript;
  var BASE = (me && me.getAttribute('data-qr-base')) || 'https://duconmang.io.vn/qr/';
  var BANK = {
    name: 'TPBank', bin: '970423', account: '67600700999', holder: 'VO TRJNG THANH',
    // VietQR (NAPAS 247) tĩnh, nội dung "Ung ho duconmang"
    payload: '00020101021138550010A000000727012500069704230111676007009990208QRIBFTTA53037045802VN62200816Ung ho duconmang63042E90'
  };
  var PAYPAL = { handle: 'paypal.me/duconmang43', url: 'https://paypal.me/duconmang43' };

  // 8 cảnh theo giờ trong ngày (giờ máy người xem), mỗi cảnh 3 tiếng.
  var HOURS = [
    [2, 'snowman', 'Khuya · Người tuyết'],
    [5, 'sakura', 'Bình minh · Hoa anh đào'],
    [8, 'bunny', 'Buổi sáng · Đồng cỏ xuân'],
    [11, 'summer', 'Giữa trưa · Bóng cây bên hồ'],
    [14, 'sunflower', 'Buổi chiều · Vườn hướng dương'],
    [17, 'autumn', 'Hoàng hôn · Phong đỏ'],
    [20, 'pumpkin', 'Buổi tối · Đèn bí ngô'],
    [23, 'winter', 'Đêm · Vườn tuyết']
  ];
  function sceneNow() {
    var q = /[?&]h=(\d{1,2})/.exec(location.search); // ?h=20 previews another hour
    var h = q ? +q[1] % 24 : new Date().getHours(), pick = HOURS[HOURS.length - 1];
    for (var i = 0; i < HOURS.length; i++) if (h >= HOURS[i][0]) pick = HOURS[i];
    return pick; // before 02:00 stays on the 23:00 scene
  }

  var css = [
    '.dcm-fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:56px;height:56px;border-radius:50%;border:0;padding:0;cursor:pointer;',
    'background:#1D2433;color:#fff;display:grid;place-items:center;box-shadow:0 10px 24px rgba(29,36,51,.28);transition:transform .2s ease}',
    '.dcm-fab:hover{transform:scale(1.06)}.dcm-fab:focus-visible{outline:3px solid #0E7C86;outline-offset:3px}',
    '.dcm-fab svg{width:26px;height:26px}.dcm-fab path{fill:#FF5A5F}',
    '@media (prefers-reduced-motion:no-preference){.dcm-fab path{animation:dcm-beat 2.4s ease-in-out 1.2s 2;transform-origin:center}}',
    '@keyframes dcm-beat{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.12)}}',
    /* the dialog itself is invisible: the scene floats straight over the page, only the small card has a surface */
    '.dcm-dlg{border:0;padding:0;margin:auto;background:transparent;overflow:visible;max-width:none;max-height:none;width:auto;height:auto;color:#1D2433;',
    'font-family:"Be Vietnam Pro",system-ui,sans-serif}',
    '.dcm-dlg::backdrop{background:transparent}',
    '.dcm-wrap{display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.dcm-stage{width:min(520px,92vw,62vh);aspect-ratio:1;position:relative;cursor:pointer}',
    '.dcm-stage iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent;color-scheme:normal}',
    '.dcm-card{width:min(380px,92vw);box-sizing:border-box;background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
    'border:1px solid rgba(29,36,51,.10);border-radius:18px;box-shadow:0 18px 44px rgba(29,36,51,.22);padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px}',
    '.dcm-top{display:flex;gap:6px;align-items:center}',
    '.dcm-tab{flex:1;min-height:44px;border-radius:12px;border:1px solid #D6D2C8;background:#fff;color:#1D2433;font:600 14px "Be Vietnam Pro",system-ui,sans-serif;cursor:pointer}',
    '.dcm-tab[aria-selected="true"]{background:#1D2433;color:#fff;border-color:#1D2433}',
    '.dcm-x{width:44px;height:44px;flex:none;border:0;border-radius:12px;background:#ECEAE3;cursor:pointer;display:grid;place-items:center}',
    '.dcm-info{display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.5}',
    '.dcm-row{display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '.dcm-row b{font-family:ui-monospace,Consolas,monospace;font-size:16px;letter-spacing:.02em}',
    '.dcm-btn{min-height:44px;padding:0 14px;border-radius:12px;border:1px solid #1D2433;background:transparent;color:#1D2433;font:600 14px "Be Vietnam Pro",system-ui,sans-serif;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}',
    '.dcm-btn.solid{background:#0E7C86;border-color:#0E7C86;color:#fff}',
    '.dcm-note{margin:0;font-size:12px;color:#5F6676}'
  ].join('');

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.2 10.6 20C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.6 11.5z"/></svg>';
  var X = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="#1D2433" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    var style = el('style'); style.textContent = css; document.head.appendChild(style);
    var fab = el('button', { type: 'button', 'class': 'dcm-fab', 'aria-label': 'Ủng hộ duconmang.io.vn', title: 'Ủng hộ' }, HEART);
    var dlg = el('dialog', { 'class': 'dcm-dlg', 'aria-labelledby': 'dcm-title' });
    dlg.innerHTML =
      '<div class="dcm-wrap"><h2 id="dcm-title" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Ủng hộ duconmang.io.vn</h2>' +
      '<div class="dcm-stage" title="Chạm để xem lại"></div>' +
      '<div class="dcm-card"><div class="dcm-top" role="tablist">' +
      '<button type="button" role="tab" class="dcm-tab" data-k="bank" aria-selected="true">Ngân hàng</button>' +
      '<button type="button" role="tab" class="dcm-tab" data-k="paypal" aria-selected="false">PayPal</button>' +
      '<button type="button" class="dcm-x" aria-label="Đóng">' + X + '</button></div>' +
      '<div class="dcm-info"></div><p class="dcm-note dcm-scene"></p></div></div>';
    document.body.appendChild(fab);
    document.body.appendChild(dlg);
    var stage = dlg.querySelector('.dcm-stage'), info = dlg.querySelector('.dcm-info'), sceneLine = dlg.querySelector('.dcm-scene');
    var current = 'bank', scene = sceneNow();

    function copy(text, btn) {
      var done = function () { var t = btn.textContent; btn.textContent = 'Đã sao chép'; setTimeout(function () { btn.textContent = t; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {}); else done();
    }

    function show(kind) {
      current = kind;
      dlg.querySelectorAll('.dcm-tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-k') === kind)); });
      var text = kind === 'bank' ? BANK.payload : PAYPAL.url;
      stage.innerHTML = '';
      stage.appendChild(el('iframe', {
        title: kind === 'bank' ? 'Mã VietQR chuyển khoản ' + BANK.name : 'Mã QR PayPal',
        src: BASE + '?embed=1&season=' + scene[1] + '#text=' + encodeURIComponent(text),
        loading: 'eager', allow: 'fullscreen'
      }));
      sceneLine.textContent = 'Cảnh: ' + scene[2] + ' · chạm vào cảnh để xem lại';
      stage.firstChild.setAttribute('allowtransparency', 'true');
      if (kind === 'bank') {
        info.innerHTML =
          '<div class="dcm-row"><span>' + BANK.name + '</span><span>' + BANK.holder + '</span></div>' +
          '<div class="dcm-row"><b>' + BANK.account + '</b><button type="button" class="dcm-btn" data-copy="' + BANK.account + '">Sao chép STK</button></div>' +
          '<p class="dcm-note">Quét bằng app ngân hàng bất kỳ (VietQR / NAPAS 247), tự nhập số tiền.</p>';
      } else {
        info.innerHTML =
          '<div class="dcm-row"><b>' + PAYPAL.handle + '</b><a class="dcm-btn solid" href="' + PAYPAL.url + '" target="_blank" rel="noopener">Mở PayPal</a></div>' +
          '<p class="dcm-note">Từ nước ngoài, bằng thẻ hoặc số dư PayPal.</p>';
      }
      var c = info.querySelector('[data-copy]');
      if (c) c.addEventListener('click', function () { copy(c.getAttribute('data-copy'), c); });
    }

    fab.addEventListener('click', function () {
      scene = sceneNow();
      show(current);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
    dlg.querySelector('.dcm-x').addEventListener('click', function () { dlg.close(); });
    // a click outside the scene and the card closes it (the dialog box itself is transparent)
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('dcm-wrap')) dlg.close(); });
    dlg.addEventListener('close', function () { stage.innerHTML = ''; fab.focus(); });
    dlg.querySelectorAll('.dcm-tab').forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('data-k')); }); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
