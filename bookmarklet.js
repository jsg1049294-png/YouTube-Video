(function () {
  "use strict";
  if (window.__ytvBm && document.getElementById("ytvbm")) {
    var p = document.getElementById("ytvbm");
    p.style.display = p.style.display === "none" ? "block" : "none";
    return;
  }
  window.__ytvBm = 1;

  if (!document.getElementById("ytvbm-style")) {
    var S = document.createElement("style");
    S.id = "ytvbm-style";
    S.textContent =
      ".ytvbm{position:fixed;z-index:2147483646;top:40px;right:12px;width:min(340px,94vw);background:rgba(10,12,18,.97);border:1.5px solid #00f0c8;border-radius:14px;color:#e8f0f0;font:13px -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,.65);overflow:hidden}" +
      ".ytvbm *{box-sizing:border-box}" +
      ".ytvbm-h{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(0,240,200,.12);cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none}" +
      ".ytvbm-t{font-weight:700;color:#00f0c8;letter-spacing:.03em}" +
      ".ytvbm-x{width:30px;height:30px;border:0;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-size:18px}" +
      ".ytvbm-b{padding:12px;max-height:78vh;overflow:auto;-webkit-overflow-scrolling:touch}" +
      ".ytvbm label{display:block;font-size:11px;color:#8a9a9a;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em}" +
      ".ytvbm textarea{width:100%;min-height:80px;background:#08080e;border:1px solid #2a2a3a;border-radius:8px;color:#e8f0f0;font-size:12px;padding:10px;margin:0 0 8px;resize:vertical}" +
      ".ytvbm .row{display:flex;gap:8px;margin-bottom:8px}" +
      ".ytvbm button{min-height:42px;border-radius:10px;border:1px solid #2a2a3a;background:#12121c;color:#e8f0f0;font-weight:600;font-size:13px;flex:1;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
      ".ytvbm .go{background:#00f0c8;color:#04120f;border:0}" +
      ".ytvbm-player{margin-top:8px;aspect-ratio:16/9;background:#000;border-radius:10px;overflow:hidden;border:1px solid rgba(0,240,200,.25);display:none}" +
      ".ytvbm-player iframe{width:100%;height:100%;border:0;display:block;min-height:160px}" +
      ".ytvbm-st{font-size:12px;color:#8a9a9a;margin-top:8px}";
    (document.head || document.documentElement).appendChild(S);
  }

  var root = document.createElement("div");
  root.id = "ytvbm";
  root.className = "ytvbm";
  root.innerHTML =
    '<div class="ytvbm-h" id="ytvbmh"><span class="ytvbm-t">YouTube Video</span><button type="button" class="ytvbm-x" id="ytvbmx" aria-label="Schliessen">×</button></div>' +
    '<div class="ytvbm-b">' +
    '<label for="ytvbm-in">Embed-Code oder Link</label>' +
    '<textarea id="ytvbm-in" placeholder="iframe oder https://youtube.com/watch?v=…"></textarea>' +
    '<div class="row"><button type="button" class="go" id="ytvbm-load">▶ Laden</button><button type="button" id="ytvbm-clear">Löschen</button></div>' +
    '<div class="ytvbm-player" id="ytvbm-pl"></div>' +
    '<div class="ytvbm-st" id="ytvbm-st">Bereit</div>' +
    "</div>";
  (document.body || document.documentElement).appendChild(root);

  function parse(raw) {
    raw = (raw || "").trim();
    if (!raw) return null;
    var m = raw.match(/<iframe[\s\S]*?<\/iframe>/i);
    if (m) {
      var html = m[0];
      if (!/allow=/i.test(html)) {
        html = html.replace(
          /<iframe/i,
          '<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen'
        );
      }
      return html;
    }
    var id = null;
    var a = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    var b = raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    var c = raw.match(/embed\/([a-zA-Z0-9_-]{6,})/);
    var d = raw.match(/shorts\/([a-zA-Z0-9_-]{6,})/);
    var e = raw.match(/^([a-zA-Z0-9_-]{11})$/);
    if (a) id = a[1];
    else if (b) id = b[1];
    else if (c) id = c[1];
    else if (d) id = d[1];
    else if (e) id = e[1];
    if (!id) return null;
    return (
      '<iframe src="https://www.youtube.com/embed/' +
      id +
      '?rel=0&playsinline=1" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen playsinline></iframe>'
    );
  }

  function setSt(t) {
    var el = document.getElementById("ytvbm-st");
    if (el) el.textContent = t;
  }

  document.getElementById("ytvbm-load").onclick = function () {
    var h = parse(document.getElementById("ytvbm-in").value);
    var pl = document.getElementById("ytvbm-pl");
    if (!h) {
      setSt("Ungültig – Embed-Code oder YouTube-Link einfügen.");
      return;
    }
    pl.innerHTML = h;
    pl.style.display = "block";
    var iframe = pl.querySelector("iframe");
    if (iframe) {
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";
      iframe.style.minHeight = "160px";
    }
    setSt("Video geladen");
  };

  document.getElementById("ytvbm-clear").onclick = function () {
    document.getElementById("ytvbm-pl").innerHTML = "";
    document.getElementById("ytvbm-pl").style.display = "none";
    document.getElementById("ytvbm-in").value = "";
    setSt("Gelöscht");
  };

  document.getElementById("ytvbmx").onclick = function () {
    root.style.display = "none";
  };

  var drag = null;
  var handle = document.getElementById("ytvbmh");
  function down(e) {
    if (e.target.closest && e.target.closest(".ytvbm-x")) return;
    var t = e.touches ? e.touches[0] : e;
    var r = root.getBoundingClientRect();
    drag = { x: t.clientX, y: t.clientY, l: r.left, t: r.top };
    if (e.touches) e.preventDefault();
  }
  function move(e) {
    if (!drag) return;
    var t = e.touches ? e.touches[0] : e;
    if (e.touches) e.preventDefault();
    root.style.left = drag.l + (t.clientX - drag.x) + "px";
    root.style.top = drag.t + (t.clientY - drag.y) + "px";
    root.style.right = "auto";
  }
  function up() {
    drag = null;
  }
  handle.addEventListener("mousedown", down);
  handle.addEventListener("touchstart", down, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
})();
