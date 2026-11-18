/* duconmang.io.vn - đếm lượt xem và lượt tải, không cookie, không dữ liệu cá nhân.
   Mỗi lần ghi chỉ cộng 1 vào bộ đếm của ngày (giờ UTC): webCounters/d<yyyymmdd>_<site>_<pv|uv|dl>_<khóa>.
   Không gửi IP, user-agent hay định danh nào; tôn trọng Do Not Track. */
(function () {
  var me = document.currentScript, SITE = me && me.getAttribute('data-site');
  if (!SITE || navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  var P = 'nashubs-89d0e', ROOT = 'projects/' + P + '/databases/(default)/documents';
  var URL = 'https://firestore.googleapis.com/v1/' + ROOT + ':commit';
  function today() { var d = new Date(); return '' + (d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()); }
  function slug(s) { return (String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)) || 'home'; }
  function hit(kind, key) {
    var id = 'd' + today() + '_' + SITE + '_' + kind + '_' + slug(key);
    var body = JSON.stringify({ writes: [{ transform: { document: ROOT + '/webCounters/' + id,
      fieldTransforms: [{ fieldPath: 'n', increment: { integerValue: '1' } }] } }] });
    try { fetch(URL, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(function () {}); } catch (e) {}
  }
  // Lượt xem theo trang
  hit('pv', location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || 'home');
  // Khách trong ngày: một lần mỗi ngày mỗi trình duyệt (chỉ lưu ngày, trong localStorage)
  try {
    var k = 'dcm-seen-' + SITE, d = today();
    if (localStorage.getItem(k) !== d) { localStorage.setItem(k, d); hit('uv', 'all'); }
  } catch (e) {}
  // Lượt bấm tải: tên tệp bỏ phần số phiên bản, ví dụ OfficeLAB-Setup-1.6.0.exe -> officelab-setup
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
    if (!a || !/\/releases\/download\/|\.(exe|msi|apk|pdf|zip)(\?|$)/i.test(a.href)) return;
    var name = decodeURIComponent(a.href.split('?')[0].split('/').pop() || '');
    hit('dl', name.split(/[-_]v?\d/)[0].replace(/\.[a-z0-9]+$/i, ''));
  }, true);
})();
