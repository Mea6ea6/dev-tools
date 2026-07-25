
const TOOLS = [
  {
    title: "JS Runner",
    desc: "Write JavaScript and run it instantly in a sandboxed worker, with console output right below the editor.",
    href: "./tools/js-runner.html",
    icon: `
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    `,
  },
  {
    title: "Color Picker",
    desc: "Pick colors, convert between HEX, RGB and HSL formats, use eyedropper to grab colors from screen.",
    href: "./tools/color-picker.html",
    icon: `
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="6.5" cy="12" r="2.5" />
      <circle cx="13.5" cy="17.5" r="2.5" />
      <path d="M17 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" />
      <path d="M3 10h4" />
      <path d="M3 14h4" />
    `,
  },
  {
    title: "Shadow Generator",
    desc: "Generate CSS box-shadow with live preview and copy-ready code.",
    soon: true,
    icon: `
      <rect x="3" y="3" width="13" height="13" rx="2" />
      <path d="M8 21h13" />
      <path d="M21 8v13" />
    `,
  },
  {
    title: "Gradient Generator",
    desc: "Build CSS gradients visually and export the code instantly.",
    soon: true,
    icon: `
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    `,
  },
];

const MORE_LINKS = [
  {
    title: "How to JS — open JavaScript textbook",
    desc: "Explanations, code examples and interview prep, from fundamentals to async.",
    href: "https://how-to-js-seven.vercel.app/index.html",
    crossApp: true,
    icon: `
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    `,
  },
];