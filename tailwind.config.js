import plugin from 'tailwindcss/plugin'

/*
 * Fluid unit system (CLONE_SPEC 0.1).
 * `--u` is defined per breakpoint in src/index.css. Every `u-*` utility takes a
 * raw design-px number and emits calc(var(--u) * N), e.g. `u-w-[386]`,
 * `u-text-[92]`, `u-mt-[-400]`.
 */
const U_UTILITIES = {
  'u-w': ['width'],
  'u-h': ['height'],
  'u-min-w': ['minWidth'],
  'u-max-w': ['maxWidth'],
  'u-min-h': ['minHeight'],
  'u-max-h': ['maxHeight'],
  'u-p': ['padding'],
  'u-px': ['paddingLeft', 'paddingRight'],
  'u-py': ['paddingTop', 'paddingBottom'],
  'u-pt': ['paddingTop'],
  'u-pr': ['paddingRight'],
  'u-pb': ['paddingBottom'],
  'u-pl': ['paddingLeft'],
  'u-m': ['margin'],
  'u-mx': ['marginLeft', 'marginRight'],
  'u-my': ['marginTop', 'marginBottom'],
  'u-mt': ['marginTop'],
  'u-mr': ['marginRight'],
  'u-mb': ['marginBottom'],
  'u-ml': ['marginLeft'],
  'u-gap': ['gap'],
  'u-gap-x': ['columnGap'],
  'u-gap-y': ['rowGap'],
  'u-text': ['fontSize'],
  'u-tracking': ['letterSpacing'],
  'u-rounded': ['borderRadius'],
  'u-rounded-t': ['borderTopLeftRadius', 'borderTopRightRadius'],
  'u-rounded-b': ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  'u-top': ['top'],
  'u-right': ['right'],
  'u-bottom': ['bottom'],
  'u-left': ['left'],
  'u-inset': ['inset'],
}

const uPlugin = plugin(({ matchUtilities }) => {
  for (const [name, props] of Object.entries(U_UTILITIES)) {
    matchUtilities(
      {
        [name]: (value) =>
          Object.fromEntries(props.map((p) => [p, `calc(var(--u) * ${value})`])),
      },
      { values: {}, type: 'any' },
    )
  }
})

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Breakpoints from CLONE_SPEC 0.1 (breakpoints.ts). Order matters: later wins.
    screens: {
      tabup: { raw: '(min-width: 501px)' },
      desk: { raw: '(min-width: 1025px)' },
      tabdown: { raw: '(max-width: 1024px)' },
      tab: { raw: '(min-width: 501px) and (max-width: 1024px)' },
      mob: { raw: '(max-width: 500px)' },
    },
    // Color tokens (CLONE_SPEC 0.4). Values live in CSS vars (hex + display-p3 override).
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      blue01: 'var(--blue01)',
      blue02: 'var(--blue02)',
      blue03: 'var(--blue03)',
      blue04: 'var(--blue04)',
      blue05: 'var(--blue05)',
      blue06: 'var(--blue06)',
      blue07: 'var(--blue07)',
      lavender01: 'var(--lavender01)',
      lavender02: 'var(--lavender02)',
      lavender03: 'var(--lavender03)',
      lavender04: 'var(--lavender04)',
      lavender05: 'var(--lavender05)',
      lavender06: 'var(--lavender06)',
      silver01: 'var(--silver01)',
      silver02: 'var(--silver02)',
      silver03: 'var(--silver03)',
      silver04: 'var(--silver04)',
      silver05: 'var(--silver05)',
      brightTurquoise: 'var(--brightTurquoise)',
      brightBlue: 'var(--brightBlue)',
      brightGreen: 'var(--brightGreen)',
      // Spec "other literal colors"
      stepBorder: 'var(--step-border)',
      interfaceCounter: 'var(--interface-counter)',
      footerLine: 'var(--footer-line)',
    },
    fontFamily: {
      sans: ['Gilroy', 'sans-serif'],
    },
    extend: {
      maxWidth: { page: '1440px' },
    },
  },
  plugins: [uPlugin],
}
