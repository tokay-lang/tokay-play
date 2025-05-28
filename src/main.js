import './style.css'

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const body = document.body;
const logo = document.getElementById("logo");
const toggle = document.getElementById("toggle-theme");

function setTheme(dark) {
  if (dark) {
    body.classList.add("dark-mode");
    toggle.innerHTML = "☀️";
  }
  else {
    body.classList.remove("dark-mode");
    toggle.innerHTML = "🌙";
  }

  logo.src = dark ? "tokay-dark.svg" : "tokay.svg";
}

// Initial
setTheme(prefersDark);

// Toggle on click
toggle.addEventListener("click", () => {
  setTheme(!body.classList.contains("dark-mode"));
});

import { enable_logging, run } from 'tokay';

enable_logging();

document.getElementById("code").value = `
Factor : @{
    Int                 # built-in 64-bit signed integer token
    '(' Expr ')'
}

Term : @{
    Term '*' Factor     $1 * $3
    Term '/' Factor     $1 / $3
    Factor
}

Expr : @{
    Expr '+' Term       $1 + $3
    Expr '-' Term       $1 - $3
    Term
}

Expr`.trim();

document
  .getElementById("submit")
  .addEventListener("click", (e) => {
    let output = document.getElementById("output");

    output.innerHTML = "";
    output.appendChild(
      document.createTextNode(
        run(
          document.getElementById("code").value,
          document.getElementById("input").value,
        ),
      ),
    );
  });
