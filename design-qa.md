# Design QA

## Comparison setup

- Source visual truth: `C:\Users\USER\.codex\generated_images\019ffd50-989d-7031-abf1-ffbfe7627a08\exec-cec6d4e7-3183-44c4-85c9-bc506d45c5d9.png`
- Source reference capture: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\reference-adit-desktop.png`
- Main implementation evidence: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\implementation-hero-desktop.png`
- Founder evidence: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\implementation-founder-desktop.png`
- GitHub evidence: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\implementation-github-desktop.png`
- Lab evidence: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\implementation-lab-desktop.png`
- Lab study evidence: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\implementation-lab-studies-desktop.png`
- Mobile evidence: `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08\implementation-lab-mobile.png` and `implementation-lab-studies-mobile.png`
- Combined comparison evidence: `design-comparison-hero.png` and `design-comparison-github.png` in the same visualization folder.
- Source pixels: 862 × 1825 for the chosen mock; 1236 × 990 for the source-site desktop capture.
- Implementation pixels: 1241 × 716 for the focused hero, founder, and GitHub captures; 1242 × 995 for the focused desktop lab captures; 383 × 829 for mobile lab captures.
- CSS viewports: 1440 × 720 for the focused desktop comparison pass, 1440 × 1000 for the lab pass, and 390 × 844 for mobile. Device scale factor was 1.
- Normalization: source and implementation crops were placed into equal 1440 × 550 comparison boards. The lab is a later user-requested chapter, so it was checked against the Boondock mark and the chosen mock’s visual rules rather than a matching source section.
- State: dark home route, live GitHub data loaded, Oil logo ready, lab atlas ready.

## Findings

No actionable P0, P1, or P2 findings remain.

### Required fidelity surfaces

- Fonts and typography: the Cormorant display face and compact mono labels preserve the source hierarchy. Display weights, line heights, letter spacing, wrapping, and small-label scale remain legible at desktop and mobile sizes.
- Spacing and layout rhythm: the wide editorial grid, square corners, thin dividers, large vertical gaps, and staggered content order match the chosen direction. Desktop and mobile captures show no collision or horizontal overflow.
- Colors and visual tokens: carbon black, warm ivory, burnt rust, and restrained moss are mapped through shared page tokens. The all-dark treatment is an intentional change requested after the mock was chosen.
- Image quality and asset fidelity: the founder portrait preserves the supplied person’s identity and uses the selected studio lighting. The lab workbench, neural apparatus, and protocol reactor match the logo’s black silhouette, rust circuitry, pale contour lines, and tactile grain. Crops remain sharp and readable at both breakpoints.
- Copy and content: the writing is specific to Eugene, Boondock Labs, and the shipped products. Lab captions explain the visual story without placeholder text.
- Interactions and accessibility: pointer-driven logo motion, scroll-driven lab frames, project links, mail links, GitHub data, keyboard focus, alt text, and reduced-motion fallbacks were checked. The lab frame changed from `60% 100%` to `0% 33.3333%` during the scroll test. No runtime errors or new warnings appeared in the final browser pass.

## Focused region evidence

- Hero: the combined comparison confirms the large serif name, two-column balance, technical mono copy, and logo-led visual anchor.
- GitHub: the combined comparison confirms the dark technical section, contribution grid density, rust and moss levels, and compact repository rows.
- Founder: the focused capture confirms identity, portrait crop, text scale, and border alignment.
- Lab: separate focused desktop and mobile captures were required because the generated assets and scroll state are too small to judge in a whole-page image.

## Pass history

1. P2: the chosen mock included a light work area after the user requested dark mode everywhere. Fix: all home surfaces now use the dark token set. Post-fix evidence: hero, founder, GitHub, and lab captures remain dark with readable contrast.
2. P2: the first build did not yet carry the lab story beyond the logo. Fix: added one large workbench scene, two apparatus studies, a sweep signal, hover motion, and a 24-frame scroll atlas. Post-fix evidence: `implementation-lab-desktop.png` and `implementation-lab-studies-desktop.png`.
3. P2: the first lab browser check showed the scene hidden when the reveal observer did not fire in the app browser’s scripted scroll. Fix: reveal content now defaults visible while the independent frame and hover motion remain active. Post-fix evidence: desktop and mobile lab captures, plus a verified frame-position change.

## Implementation checklist

- [x] Keep every portfolio surface dark.
- [x] Preserve the supplied identity in the founder portrait.
- [x] Use real generated lab assets in the logo’s visual language.
- [x] Use the Oil Motion method for the hero logo and lab atlas.
- [x] Load live public GitHub activity with usable fallback states.
- [x] Check desktop and mobile overflow, crops, focus, and reduced motion.
- [x] Pass TypeScript, production build, motion budget, and browser runtime checks.

## Follow-up polish

- P3: a future pass could add one more small lab study for native Windows tooling if the page needs a denser studio story.

final result: passed
