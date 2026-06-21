// web-challenge.js
// Loaded only on the Web Application Hacking page.
// Curious where the page's JavaScript comes from? The browser's developer
// tools (F12) -> Console / Sources tab will show you everything a site runs.

(function () {
  // Capture this script's own URL so we can build API paths that respect the
  // site's base path (works whether the site is served at "/" or "/subpath/").
  const scriptSrc = (document.currentScript && document.currentScript.src) || "";
  const apiBase = scriptSrc
    ? scriptSrc.replace(/\/scripts\/web-challenge\.js.*$/, "") + "/api/users"
    : "/api/users";

  const flag = "C2{c0ns0l3_l0g_l3ak5_s3cr3ts}";

  console.log(
    "%c C2Society Challenges",
    "background:#0f0; color:#000; font-weight:bold; padding:2px 6px; border-radius:3px;"
  );
  console.log(
    "%cNice — you opened the developer console. Web pages send code to your browser, and anything that runs here is readable. Here is your flag:",
    "color:#0f0;"
  );
  console.log("%c" + flag, "color:#0f0; font-size:16px; font-weight:bold;");

  // ---------------------------------------------------------------------------
  // Bonus reversing challenge.
  //
  // The flag below is encrypted and can only be unlocked with the correct
  // password. Call getFlag("your guess") from the console. Wrong guesses are
  // rejected by checkPassword() *before* anything is decrypted — so read that
  // function carefully and you can recover the password without guessing.
  // ---------------------------------------------------------------------------

  function checkPassword(input) {
    // The correct password, stored one character code at a time.
    const expected = [104, 52, 99, 107, 116, 104, 51, 119, 51, 98];
    if (typeof input !== "string" || input.length !== expected.length) return false;
    for (let i = 0; i < expected.length; i++) {
      if (input.charCodeAt(i) !== expected[i]) return false;
    }
    return true;
  }

  function getFlag(password) {
    if (!checkPassword(password)) {
      return "Wrong password. Reverse checkPassword() to recover it, then try again.";
    }
    const cipher = [43, 6, 24, 1, 64, 30, 7, 4, 80, 16, 89, 68, 23, 52, 6, 91, 69, 68, 65, 17, 89, 90, 4, 52, 69, 88, 2, 10];
    let out = "";
    for (let i = 0; i < cipher.length; i++) {
      out += String.fromCharCode(cipher[i] ^ password.charCodeAt(i % password.length));
    }
    return out;
  }

  // Expose the challenge functions so players can call them from the console.
  window.checkPassword = checkPassword;
  window.getFlag = getFlag;

  console.log(
    "%cBonus: a getFlag(password) function is loaded. Reverse checkPassword() to find the password, then call getFlag(\"...\") to decrypt the real flag.",
    "color:#0f0;"
  );

  // ---------------------------------------------------------------------------
  // Profile personalization
  //
  // The page personalizes a welcome banner based on the "user" query param
  // (e.g. ?user=1). It fetches that account from the static JSON API and
  // renders "Hello <name>, <welcome>" at the top of the page. The ids are
  // sequential and directly addressable — a classic IDOR. Enumerate them to
  // find the account that should not be reachable.
  // ---------------------------------------------------------------------------
  var DEFAULT_WELCOME = "welcome back!";

  function showWelcome(user) {
    var main = document.querySelector("main");
    if (!main) return;
    var banner = document.createElement("div");
    banner.className = "enum-welcome";
    banner.style.cssText =
      "margin:1rem auto 0;max-width:760px;padding:0.75rem 1rem;border:1px solid #00d4ff;" +
      "border-radius:8px;background:rgba(0,212,255,0.06);color:#e6edf3;font-size:0.95rem;";
    // textContent (not innerHTML) so profile data can never inject markup.
    banner.textContent = "Hello " + user.name + ", " + (user.welcome || DEFAULT_WELCOME);
    main.insertBefore(banner, main.firstChild);
  }

  var userId = new URLSearchParams(location.search).get("user");
  if (userId === null) {
    console.log("[LOG] Default user, no 'user' param found");
  } else {
    fetch(apiBase + "/" + encodeURIComponent(userId) + ".json")
      .then(function (r) {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(function (user) {
        console.log("[LOG] Loaded profile for user " + userId + ":", user);
        showWelcome(user);
      })
      .catch(function () {
        console.log("[LOG] No profile found for user '" + userId + "'");
      });
  }
})();
