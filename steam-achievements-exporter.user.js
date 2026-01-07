// ==UserScript==
// @name         Steam Achievements Exporter
// @namespace    https://github.com/sypcerr/steam-achievements-exporter
// @version      1.02
// @description  Export Steam achievements with accurate unlocked/locked status and progress counters
// @author       sypcerr
// @match        https://steamcommunity.com/stats/*/achievements*
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/sypcerr/steam-achievements-exporter/main/steam-achievements-exporter.user.js
// @downloadURL  https://raw.githubusercontent.com/sypcerr/steam-achievements-exporter/main/steam-achievements-exporter.user.js
// ==/UserScript==

(function () {
    'use strict';

    const button = document.createElement("button");
    button.textContent = "📋 Copy Achievements";
    Object.assign(button.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "9999",
        padding: "12px 18px",
        background: "#1b2838",
        color: "#c7d5e0",
        border: "1px solid #66c0f4",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
    });
    document.body.appendChild(button);

    const popup = document.createElement("div");
    popup.textContent = "Copied to clipboard!";
    Object.assign(popup.style, {
        position: "fixed",
        bottom: "60px",
        right: "20px",
        padding: "8px 12px",
        background: "#66c0f4",
        color: "#1b2838",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
        opacity: "0",
        transition: "opacity 0.3s",
        zIndex: "10000",
        pointerEvents: "none"
    });
    document.body.appendChild(popup);

    function showPopup() {
        popup.style.opacity = "1";
        setTimeout(() => {
            popup.style.opacity = "0";
        }, 1500);
    }

    // click event
    button.addEventListener("click", () => {
        const rows = document.querySelectorAll(".achieveRow");
        if (!rows.length) {
            alert("No achievements found!");
            return;
        }

        let unlockedCount = 0;
        let lockedCount = 0;
        let output = [];

        rows.forEach(row => {
            const nameEl = row.querySelector(".achieveTxt h3");
            if (!nameEl) return;

            const name = nameEl.innerText.trim();
            const isUnlocked = row.classList.contains("unlocked");

            if (isUnlocked) unlockedCount++;
            else lockedCount++;

            output.push(`${name}: ${isUnlocked ? "Unlocked" : "Locked"}`);
        });

        const total = unlockedCount + lockedCount;

        const header = [
            `Unlocked: ${unlockedCount} / ${total}`,
            `Locked: ${lockedCount} / ${total}`,
            ""
        ];

        const finalText = header.concat(output).join("\n");

        GM_setClipboard(finalText);

        button.textContent = "✅ Copied to Clipboard!";
        showPopup();
        setTimeout(() => {
            button.textContent = "📋 Copy Achievements";
        }, 2000);
    });
})();
