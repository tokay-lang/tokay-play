import "./style.css"

const example = `
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

print(Expr)
`.trim();

// Dark/white theme -------------------------------------------------------------------------------

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


// Monaco -----------------------------------------------------------------------------------------

export const tokayMonarch = {
  defaultToken: "",
  tokenPostfix: ".tokay",

  keywords: [
    "accept", "begin", "break", "continue", "else", "end", "exit",
    "for", "if", "in", "loop", "next", "push", "reject", "repeat",
    "reset", "return"
  ],

  constants: [
    "false", "null", "true", "void", "self"
  ],

  operators: [
    "==", "=", "!=", "!", "<=", "<", ">=", ">", "+=", "+", "-=", "-",
    "*=", "*", "/=", "/", "//=", "//", "%=", "%", "||", "|", "&&", "?", ":"
  ],

  tokenizer: {
    root: [
      // Comments
      [/#.*$/, "comment"],

      // Strings: double-quoted
      [/"/, { token: "string.quote", bracket: "@open", next: "@string_double" }],

      // Strings: ''match''
      [/''(\\.|[^'])+''/, "string.interpolated"],

      // Strings: 'touch'
      [/'(?!')(\\.|[^'])+'/, "string.interpolated"],

      // Numbers
      [/\b\d*\.\d+|\d+\.\d*|\d+\b/, "number"],

      // Keywords
      [/\b(accept|begin|break|continue|else|end|exit|for|if|in|loop|next|push|reject|repeat|reset|return)\b/, "keyword"],

      // Constants
      [/\b(false|null|true|void|self)\b/, "constant"],

      // Operators
      [/==?|!=?|<=?|>=?|(\+=?)|(-=?)|(\*=?|\/=?|\/\/=?|%=?)|\|\|?|\&\&|\?/, "operator"],

      // Anything else is an identifier
      [/[a-zA-Z_][\w\-]*/, "identifier"]
    ],

    string_double: [
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      [/[^\\"]+/, "string"]
    ]
  }
};


import * as monaco from "monaco-editor";

monaco.languages.register({ id: "tokay" });
monaco.languages.setMonarchTokensProvider("tokay", tokayMonarch);

const editor = monaco.editor.create(document.getElementById("code"), {
  value: example,
  language: "tokay",
  theme: "vs-dark"
});

// Tokay ------------------------------------------------------------------------------------------

import { enable_logging, run } from "tokay";

enable_logging();

document
  .getElementById("submit")
  .addEventListener("click", (e) => {
    let output = document.getElementById("output");
    output.innerHTML = "";

    let res = run(
      editor.getValue(),
      document.getElementById("input").value,
      msg => {
        output.appendChild(document.createTextNode(msg));
      },
    );

    if (res) {
      output.appendChild(document.createTextNode(res));
    }
  });
