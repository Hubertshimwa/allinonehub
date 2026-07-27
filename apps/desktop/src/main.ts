import "./style.css";
const target = import.meta.env.VITE_ALLINONEHUB_URL || "http://localhost:3000";
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<main><header><div class="brand"><span>✦</span><strong>allinone<b>hub</b></strong></div><div class="actions"><button id="reload" aria-label="Reload">↻</button><a href="${target}" target="_blank" rel="noreferrer">Open in browser ↗</a></div></header><iframe id="hub" title="Allinonehub" src="${target}"></iframe></main>`;
document.querySelector<HTMLButtonElement>("#reload")?.addEventListener("click", () => { const frame = document.querySelector<HTMLIFrameElement>("#hub"); if (frame) frame.src = frame.src; });
