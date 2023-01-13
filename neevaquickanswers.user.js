// ==UserScript==
// @name         Neeva Quick Answers
// @namespace    quickanswers.neeva.dbuidl.com
// @version      1.0.3
// @description  Add duckduckgo-like quick answers to Neeva.
// @author       Snaddyvitch Dispenser (https://github.com/Snaddyvitch-Dispenser)
// @match        https://neeva.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neeva.com
// @grant        none
// @updateURL    https://git.dbuidl.com/Snaddyvitch-Dispenser/neeva-quick-answers/raw/branch/main/neevaquickanswers.user.js
// @downloadURL  https://git.dbuidl.com/Snaddyvitch-Dispenser/neeva-quick-answers/raw/branch/main/neevaquickanswers.user.js
// ==/UserScript==

// needs to be incremented each time the HTML changes
const html_ver = "1.0.3";
const ENABLE_CACHING = true;

const quickAnswers = [
    {
        test: (q) => {let s = q.split(" "); return s[0].toLowerCase() === "sha256" && q.length >= 2},
        answer: async function(q) {
            try {
                const toHash = q.substr(q.indexOf(" ")).trim();

                const textAsBuffer = new TextEncoder().encode(toHash);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', textAsBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer))
                const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                return {answer: digest, description: `sha256 hex hash`};
            } catch (e) {
                return null;
            }
        },
        authors: [{name: "Conor", url: "https://github.com/Snaddyvitch-Dispenser", icon: "https://files.dbuidl.com/uploads/5hlfqk9j657v9v5rrmwi87l0czqbiunv.png"}],
        name: "SHA-256 Hash",
    },
    {
        test: (q) => {let s = q.split(" "); return s[0].toLowerCase() === "sha512" && q.length >= 2},
        answer: async function(q) {
            try {
                const toHash = q.substr(q.indexOf(" ")).trim();

                const textAsBuffer = new TextEncoder().encode(toHash);
                const hashBuffer = await window.crypto.subtle.digest('SHA-512', textAsBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer))
                const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                return {answer: digest, description: `sha512 hex hash`};
            } catch (e) {
                return null;
            }
        },
        authors: [{name: "Conor", url: "https://github.com/Snaddyvitch-Dispenser", icon: "https://files.dbuidl.com/uploads/5hlfqk9j657v9v5rrmwi87l0czqbiunv.png"}],
        name: "SHA-512 Hash",
    },
    {
        test: (q) => {let s = q.split(" "); return s[0].toLowerCase() === "urlencode" && q.length >= 2},
        answer: async (q) => {
            try {
                const toEncode = q.substr(q.indexOf(" ")).trim();

                const digest = encodeURIComponent(toEncode);

                return {answer: digest, description: `URL encode: ${toEncode}`};
            } catch (e) {
                return null;
            }
        },
        authors: [{name: "Conor", url: "https://github.com/Snaddyvitch-Dispenser", icon: "https://files.dbuidl.com/uploads/5hlfqk9j657v9v5rrmwi87l0czqbiunv.png"}],
        name: "URL Encode",
    },
    {
        testAndAnswer: (q) => {
            const decoded = decodeURIComponent(q);
            if (q.indexOf(" ") === -1 && decoded !== q) {
                return {test: true, answer: {answer: decoded, description: `URL Decode: ${q}`}};
            } else {
                return {test: false, answer: null}
            }
        },
        authors: [{name: "Conor", url: "https://github.com/Snaddyvitch-Dispenser", icon: "https://files.dbuidl.com/uploads/5hlfqk9j657v9v5rrmwi87l0czqbiunv.png"}],
        name: "URL Decode",
    }
];

async function getQuickAnswer(query) {
    for (let i = 0; i < quickAnswers.length; i++) {
        const qa = quickAnswers[i];

        if (Object.hasOwn(qa, "testAndAnswer")) {
            const tAndA = await qa.testAndAnswer(query);

            if (tAndA.test === true && tAndA.answer !== null) {
                return {
                    name: qa.name,
                    authors: qa.authors,
                    answer: tAndA.answer
                }
            }
        } else {
            if (await qa.test(query) === true) {
                const ans = await qa.answer(query);
                if (ans !== null) {
                    return {
                        name: qa.name,
                        authors: qa.authors,
                        answer: ans
                    }
                }
            }
        }
    }

    return null;
}

(function() {
    'use strict';

    window.addEventListener("load", async function() {
        // get query
        const q = (new URLSearchParams(window.location.search)).get("q");

        const ans = await getQuickAnswer(q);

        if (ans === null) return; // no answer to give

        const savedVersion = window.localStorage.getItem("instantAnswerVersion");
        const iAD = window.localStorage.getItem("instantAnswerDetail");
        const div = document.createElement("div");
        div.innerHTML = iAD;
        if (ENABLE_CACHING && iAD && document.querySelector("[class*=result-group-container__component]").className == iAD.split('"')[1].split(" ")[0] && savedVersion === html_ver) {
            console.log("QuickAnswers: Using existing container");
            const child = div.querySelector("[data-docid*='0x']")

            const title = child.querySelector("[class*=lib-doc-title__link]");

            title.innerText = ans.answer.answer;

            const snippet = child.querySelector("[class*=lib-doc-snippet__component]");

            snippet.innerText = ans.answer.description;

            const firstAnswer = document.querySelector("[class*=result-group-container__component]");
            const parent = firstAnswer.parentElement;

            let userInfoClone = document.createElement("div");
            userInfoClone.innerHTML = window.localStorage.getItem("instantAnswerUserIcon");

            let subItemE = userInfoClone.querySelector("[class*='web-index__url']");
            let subItem = subItemE.cloneNode(true);
            userInfoClone.innerText = "Instant Answer by: ";
            userInfoClone.style = "font-size: 0.8em;";
            div.querySelector("[class*='web-index__content']").appendChild(userInfoClone);

            for (let i = 0; i < ans.authors.length; i++) {
                let user = subItem.cloneNode(true);
                let info = ans.authors[i];

                userInfoClone.appendChild(user);

                user.querySelector("[class*='components-favicon__favicon']").src = info.icon;
                user.style = "width: auto; display: inline-block; font-size: inherit;";
                user.querySelector("[class*='preferred-providers-buttons__label']").innerText = info.name;
                user.querySelector("div[class*='preferred-providers-dropdown__floating']").addEventListener("click", e => {e.preventDefault(); window.open(info.url, "_blank") ;});
            }

            parent.prepend(div);
        } else {
            console.log("QuickAnswers: Creating new container")
            const firstAnswer = document.querySelector("[class*=result-group-container__component]");
            const parent = firstAnswer.parentElement;

            const clone = firstAnswer.cloneNode(true);
            clone.classList.add("instant-answer");

            const children = clone.querySelectorAll("[data-docid*='0x']")

            let firstChild = children[0];

            for (let i = 1; i < children.length; i++) {
                children[i].remove()
            }

            firstChild.querySelector("[class*=lib-doc-save-button]").remove();

            firstChild.querySelector("[class*=menu-menu-button__menuContainer]").remove();

            firstChild.querySelector('[medium="chevron-down"]').remove();

            const fL = firstChild.querySelector("[class*=web-index__firstLine]");

            const userInfoClone = fL.cloneNode(true);

            fL.remove();

            const title = firstChild.querySelector("[class*=lib-doc-title__link]");

            title.innerText = ans.answer.answer;
            title.style = "pointer-events: none; color: white; text-decoration: none; -webkit-line-clamp: unset; line-clamp: unset;"

            title.parentElement.style = "cursor: default; word-wrap: break-word; -webkit-line-clamp: unset; line-clamp: unset; overflow: visible;"

            const snippet = firstChild.querySelector("[class*=lib-doc-snippet__component]");

            snippet.innerText = ans.answer.description;

            window.localStorage.setItem("instantAnswerUserIcon", userInfoClone.outerHTML);
            window.localStorage.setItem("instantAnswerDetail", clone.outerHTML);
            window.localStorage.setItem("instantAnswerVersion", html_ver);

            let subItemE = userInfoClone.querySelector("[class*='web-index__url']");
            let subItem = subItemE.cloneNode(true);
            userInfoClone.innerText = "Instant Answer by: ";
            userInfoClone.style = "font-size: 0.8em;";
            clone.querySelector("[class*='web-index__content']").appendChild(userInfoClone);

            for (let i = 0; i < ans.authors.length; i++) {
                let user = subItem.cloneNode(true);
                let info = ans.authors[i];

                userInfoClone.appendChild(user);

                user.querySelector("[class*='components-favicon__favicon']").src = info.icon;
                user.style = "width: auto; display: inline-block; font-size: inherit;";
                user.querySelector("[class*='preferred-providers-buttons__label']").innerText = info.name;
                user.querySelector("div[class*='preferred-providers-dropdown__floating']").addEventListener("click", e => {e.preventDefault(); window.open(info.url, "_blank") ;});
            }

            const styles = document.createElement("style");
            styles.innerText = `
                .instant-answer [class*="preferred-providers-buttons__label"] {font-size: 0.8em !important;}
                .instant-answer [class*="components-favicon__favicon"] {width: 14px !important; height: 14px !important;}
                .instant-answer [class*="preferred-providers-buttons__providerButton"] {height: 22px !important; padding: 0 4px !important;}
                .instant-answer [class*="preferred-providers-buttons__providerButton"]>span:not([class*="preferred-providers-buttons__label"]) {height: 23px !important; width: 18px !important;}
                .instant-answer img[class*="components-favicon__favicon"] {object-fit: cover !important;}
            `;

            clone.prepend(styles);

            parent.prepend(clone);
        }
    });
})();
