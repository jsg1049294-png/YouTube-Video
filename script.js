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
  function onUp() {
    drag = null;
  }
  titlebar.addEventListener("mousedown", onDown);
  titlebar.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  document.getElementById("ytv-min").onclick = function () {
    win.classList.add("minimized");
    restoreBtn.hidden = false;
  };
  document.getElementById("ytv-close").onclick = function () {
    win.classList.add("hidden");
    restoreBtn.hidden = false;
  };
  restoreBtn.onclick = function () {
    win.classList.remove("hidden", "minimized");
    restoreBtn.hidden = true;
  };

  function parseEmbed(raw) {
    const text = (raw || "").trim();
    if (!text) return null;

    const iframeMatch = text.match(/<iframe[\s\S]*?<\/iframe>/i);
    if (iframeMatch) {
      let html = iframeMatch[0];
      if (!/allow=/i.test(html)) {
        html = html.replace(
          /<iframe/i,
          '<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen'
        );
      }
      if (!/playsinline/i.test(html)) {
        html = html.replace(/<iframe/i, "<iframe playsinline");
      }
      return html;
    }

    let id = null;
    const m1 = text.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    const m2 = text.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    const m3 = text.match(/embed\/([a-zA-Z0-9_-]{6,})/);
    const m4 = text.match(/shorts\/([a-zA-Z0-9_-]{6,})/);
    const m5 = text.match(/^([a-zA-Z0-9_-]{11})$/);
    if (m1) id = m1[1];
    else if (m2) id = m2[1];
    else if (m3) id = m3[1];
    else if (m4) id = m4[1];
    else if (m5) id = m5[1];

    if (!id) return null;

    return (
      '<iframe src="https://www.youtube.com/embed/' +
      id +
      '?rel=0&playsinline=1" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen playsinline></iframe>'
    );
  }

  function loadVideo() {
    const html = parseEmbed(input.value);
    if (!html) {
      setStatus("Kein gültiger Embed-Code oder YouTube-Link.");
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
    setStatus("Video geladen – Sound über den YouTube-Player.");
    try {
      localStorage.setItem("ytv-embed", input.value.trim());
    } catch (_) {}
  }

  function clearVideo() {
    player.innerHTML = "";
    playerWrap.hidden = true;
    input.value = "";
    setStatus("Gelöscht.");
    try {
      localStorage.removeItem("ytv-embed");
    } catch (_) {}
  }

  document.getElementById("btn-load").onclick = loadVideo;
  document.getElementById("btn-clear").onclick = clearVideo;

  try {
    const saved = localStorage.getItem("ytv-embed");
    if (saved) {
      input.value = saved;
      loadVideo();
    }
  } catch (_) {}

  /* Short bookmarklet – loads panel script from jsDelivr (reliable on iPad) */
  var BM =
    "javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/jsg1049294-png/YouTube-Video@main/bookmarklet.js';document.documentElement.appendChild(s);})();";

  var bmTa = document.getElementById("bm-code");
  if (bmTa) bmTa.value = BM;

  document.getElementById("btn-copy-bm").onclick = async function () {
    try {
      await navigator.clipboard.writeText(BM);
      var b = document.getElementById("btn-copy-bm");
      var o = b.textContent;
      b.textContent = "Kopiert!";
      setTimeout(function () {
        b.textContent = o;
      }, 1500);
    } catch (_) {
      bmTa.select();
      alert("Markiert – manuell kopieren und als Lesezeichen-Adresse speichern.");
    }
  };
})();
