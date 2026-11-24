(function () {
  "use strict";

  const win = document.getElementById("ytv-window");
  const titlebar = document.getElementById("ytv-titlebar");
  const restoreBtn = document.getElementById("ytv-restore");
  const input = document.getElementById("embed-input");
  const playerWrap = document.getElementById("player-wrap");
  const player = document.getElementById("player");
  const status = document.getElementById("status");
  let drag = null;

  function setStatus(t) {
    if (status) status.textContent = t;
  }

  function onDown(e) {
    if (e.target.closest(".ytv-win-btns")) return;
    const t = e.touches ? e.touches[0] : e;
    const r = win.getBoundingClientRect();
    drag = { x: t.clientX, y: t.clientY, l: r.left, t: r.top };
    if (e.touches) e.preventDefault();
  }
  function onMove(e) {
    if (!drag) return;
    const t = e.touches ? e.touches[0] : e;
    if (e.touches) e.preventDefault();
    win.style.left = drag.l + (t.clientX - drag.x) + "px";
    win.style.top = drag.t + (t.clientY - drag.y) + "px";
    win.style.transform = "none";
  }
  function onUp() { drag = null; }
  titlebar.addEventListener("mousedown", onDown);
  titlebar.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  document.getElementById("ytv-min").onclick = () => {
    win.classList.add("minimized");
    restoreBtn.hidden = false;
  };
  document.getElementById("ytv-close").onclick = () => {
    win.classList.add("hidden");
    restoreBtn.hidden = false;
  };
  restoreBtn.onclick = () => {
    win.classList.remove("hidden", "minimized");
    restoreBtn.hidden = true;
  };

  function parseEmbed(raw) {
    const text = (raw || "").trim();
    if (!text) return null;
    const iframeMatch = text.match(/<iframe[\s\S]*?<\/iframe>/i);
    if (iframeMatch) {
      let html = iframeMatch[0];
      if (!/allow=/.test(html)) {
        html = html.replace(/<iframe/i, '<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen');
      }
      return html;
    }
    let id = null;
    const m1 = text.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    const m2 = text.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    const m3 = text.match(/embed\/([a-zA-Z0-9_-]{6,})/);
    const m4 = text.match(/^([a-zA-Z0-9_-]{11})$/);
    if (m1) id = m1[1];
    else if (m2) id = m2[1];
    else if (m3) id = m3[1];
    else if (m4) id = m4[1];
    if (id) {
      return '<iframe src="https://www.youtube.com/embed/' + id + '?rel=0" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }
    return null;
  }

  function loadVideo() {
    const html = parseEmbed(input.value);
    if (!html) {
      setStatus("Kein gueltiger Embed-Code oder YouTube-Link.");
      return;
    }
    player.innerHTML = html;
    const iframe = player.querySelector("iframe");
    if (iframe) {
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";
      iframe.style.minHeight = "180px";
    }
    playerWrap.hidden = false;
    setStatus("Video geladen – Sound ueber YouTube-Player.");
    try { localStorage.setItem("ytv-embed", input.value.trim()); } catch (_) {}
  }

  function clearVideo() {
    player.innerHTML = "";
    playerWrap.hidden = true;
    input.value = "";
    setStatus("Geloescht.");
    try { localStorage.removeItem("ytv-embed"); } catch (_) {}
  }

  document.getElementById("btn-load").onclick = loadVideo;
  document.getElementById("btn-clear").onclick = clearVideo;

  try {
    const saved = localStorage.getItem("ytv-embed");
    if (saved) { input.value = saved; loadVideo(); }
  } catch (_) {}

  function buildBm() {
    return "javascript:void(function(){" +
      "if(window.__ytvBm){var p=document.getElementById('ytvbm');if(p)p.style.display=p.style.display==='none'?'block':'none';return;}" +
      "window.__ytvBm=1;" +
      "var S=document.createElement('style');S.textContent=" +
      "'.ytvbm{position:fixed;z-index:2147483646;top:40px;right:12px;width:320px;max-width:94vw;background:rgba(10,12,18,.96);border:1.5px solid #00f0c8;border-radius:14px;color:#e8f0f0;font:13px -apple-system,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,.6);overflow:hidden}" +
      ".ytvbm *{box-sizing:border-box}.ytvbm-h{display:flex;justify-content:space-between;padding:10px 12px;background:rgba(0,240,200,.1);cursor:grab;user-select:none}" +
      ".ytvbm-t{font-weight:700;color:#00f0c8}.ytvbm-x{width:28px;height:28px;border:0;border-radius:8px;background:rgba(255,255,255,.08);color:#fff}" +
      ".ytvbm-b{padding:12px;max-height:75vh;overflow:auto}" +
      ".ytvbm textarea{width:100%;min-height:70px;background:#08080e;border:1px solid #2a2a3a;border-radius:8px;color:#e8f0f0;font-size:11px;padding:8px;margin:6px 0}" +
      ".ytvbm button{min-height:38px;border-radius:8px;border:1px solid #2a2a3a;background:#12121c;color:#e8f0f0;font-weight:600;margin:4px 2px;cursor:pointer}" +
      ".ytvbm .go{background:#00f0c8;color:#04120f;border:0}.ytvbm .row{display:flex;gap:6px}" +
      ".ytvbm-player{margin-top:8px;aspect-ratio:16/9;background:#000;border-radius:8px;overflow:hidden}" +
      ".ytvbm-player iframe{width:100%;height:100%;border:0;min-height:160px}';" +
      "document.documentElement.appendChild(S);" +
      "var root=document.createElement('div');root.id='ytvbm';root.className='ytvbm';" +
      "root.innerHTML='<div class=\"ytvbm-h\" id=\"ytvbmh\"><span class=\"ytvbm-t\">YouTube Video</span><button class=\"ytvbm-x\" id=\"ytvbmx\">×</button></div>" +
      "<div class=\"ytvbm-b\"><div style=\"font-size:11px;color:#8a9a9a\">Embed-Code einfuegen</div>" +
      "<textarea id=\"ytvbm-in\" placeholder=\"iframe oder youtube-Link\"></textarea>" +
      "<div class=\"row\"><button class=\"go\" id=\"ytvbm-load\" style=\"flex:1\">▶ Laden</button>" +
      "<button id=\"ytvbm-clear\" style=\"flex:1\">Loeschen</button></div>" +
      "<div class=\"ytvbm-player\" id=\"ytvbm-pl\" style=\"display:none\"></div>" +
      "<div style=\"font-size:11px;color:#8a9a9a;margin-top:8px\" id=\"ytvbm-st\">Bereit</div></div>';" +
      "document.documentElement.appendChild(root);" +
      "function parse(raw){raw=(raw||'').trim();if(!raw)return null;var m=raw.match(/<iframe[\\s\\S]*?<\\/iframe>/i);if(m)return m[0];" +
      "var id=null,a=raw.match(/youtu\\.be\\/([a-zA-Z0-9_-]{6,})/),b=raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/),c=raw.match(/embed\\/([a-zA-Z0-9_-]{6,})/),d=raw.match(/^([a-zA-Z0-9_-]{11})$/);" +
      "if(a)id=a[1];else if(b)id=b[1];else if(c)id=c[1];else if(d)id=d[1];" +
      "if(id)return '<iframe src=\"https://www.youtube.com/embed/'+id+'?rel=0\" allow=\"autoplay;encrypted-media;picture-in-picture\" allowfullscreen></iframe>';return null;}" +
      "document.getElementById('ytvbm-load').onclick=function(){var h=parse(document.getElementById('ytvbm-in').value);var pl=document.getElementById('ytvbm-pl');" +
      "if(!h){document.getElementById('ytvbm-st').textContent='Ungueltig';return;}pl.innerHTML=h;pl.style.display='block';document.getElementById('ytvbm-st').textContent='Geladen';};" +
      "document.getElementById('ytvbm-clear').onclick=function(){document.getElementById('ytvbm-pl').innerHTML='';document.getElementById('ytvbm-pl').style.display='none';document.getElementById('ytvbm-in').value='';document.getElementById('ytvbm-st').textContent='Geloescht';};" +
      "document.getElementById('ytvbmx').onclick=function(){root.style.display='none';};" +
      "var d=null,h=document.getElementById('ytvbmh');" +
      "h.addEventListener('touchstart',function(e){var t=e.touches[0],r=root.getBoundingClientRect();d={x:t.clientX,y:t.clientY,l:r.left,t:r.top};e.preventDefault();},{passive:false});" +
      "h.addEventListener('mousedown',function(e){var r=root.getBoundingClientRect();d={x:e.clientX,y:e.clientY,l:r.left,t:r.top};});" +
      "window.addEventListener('touchmove',function(e){if(!d)return;var t=e.touches[0];root.style.left=(d.l+t.clientX-d.x)+'px';root.style.top=(d.t+t.clientY-d.y)+'px';root.style.right='auto';e.preventDefault();},{passive:false});" +
      "window.addEventListener('mousemove',function(e){if(!d)return;root.style.left=(d.l+e.clientX-d.x)+'px';root.style.top=(d.t+e.clientY-d.y)+'px';root.style.right='auto';});" +
      "window.addEventListener('touchend',function(){d=null});window.addEventListener('mouseup',function(){d=null});" +
      "function trySkip(){if(!/youtube\\.com|youtu\\.be/i.test(location.hostname))return;" +
      "var sels=['.ytp-ad-skip-button','.ytp-ad-skip-button-modern','button.ytp-ad-skip-button-modern','.ytp-skip-ad-button','[class*=\"skip-button\"]'];" +
      "for(var i=0;i<sels.length;i++){var nodes=document.querySelectorAll(sels[i]);for(var j=0;j<nodes.length;j++){var el=nodes[j];" +
      "if(el&&el.offsetParent!==null){try{el.click();}catch(e){}}}}" +
      "setInterval(trySkip,800);" +
      "})();";
  }

  const bmTa = document.getElementById("bm-code");
  if (bmTa) bmTa.value = buildBm();
  document.getElementById("btn-copy-bm").onclick = async () => {
    try {
      await navigator.clipboard.writeText(buildBm());
      const b = document.getElementById("btn-copy-bm");
      const o = b.textContent;
      b.textContent = "Kopiert!";
      setTimeout(() => (b.textContent = o), 1500);
    } catch {
      bmTa.select();
      alert("Markiert – manuell kopieren.");
    }
  };
})();
