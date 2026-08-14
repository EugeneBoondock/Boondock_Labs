# Design QA

## Comparison setup

- Source visual truth: the user’s two correction screenshots at `C:\Users\USER\AppData\Local\Temp\codex-clipboard-069cfe42-76f2-4e52-8236-7fa9be189b82.png` and `C:\Users\USER\AppData\Local\Temp\codex-clipboard-c6a821fb-a747-4621-8d72-e5b17a1b2218.png`.
- Brand source: `C:\Users\USER\Projects\Boondock-Labs-Portfolio\Boondock_Labs\public\boondock-mark.png`.
- Content source: `C:\Users\USER\Projects\Boondock-Labs-Portfolio\Boondock_Labs\public\Eugene_Loyiso_Mzimakhwe_CV_updated.pdf`.
- Implementation evidence: `correction-founder-desktop.png`, `correction-lab-desktop.png`, and `correction-work-desktop.png` under `C:\Users\USER\.codex\visualizations\2026\08\13\019ffd50-989d-7031-abf1-ffbfe7627a08`.
- Mobile evidence: browser capture at a 390 × 844 CSS viewport.
- Desktop viewport: 1440 × 1000 CSS pixels, device scale factor 1. Browser capture measured 1242 × 995 pixels because of the app panel width.
- State: dark home route, founder section, animated lab scene, project archive.

## Findings

No actionable P0, P1, or P2 findings remain.

### Required fidelity surfaces

- Fonts and typography: the serif and mono type system remains intact. Founder and lab headlines are shorter, use fewer line breaks, and scan cleanly. Project names have a consistent size and weight.
- Spacing and layout: the founder panel fell from a 620-pixel minimum image to 430 pixels on desktop. Its content frame is capped at 1120 pixels. Mobile uses a portrait no wider than 300 pixels. The work archive uses a two-column desktop grid and one column on mobile.
- Colors and tokens: all corrected sections use the existing carbon, warm-ivory, rust and moss tokens. Text contrast remains readable in both viewports.
- Image quality and asset fidelity: the replacement workbench and two close studies contain real lab equipment. No generated copy of the Boondock mark appears inside those assets. The real supplied mark appears once beside the lab description. Crops are sharp and stable.
- Copy and content: the founder text now names Morphed.io work and concrete product areas. The lab text describes actual testing activity. Eleven products and four npm packages appear. All nine CV projects are present.
- Interactions and accessibility: logo motion, 24-frame lab scroll motion, hover states, project links, npm links, keyboard focus, alt text and reduced-motion fallbacks remain active. No horizontal overflow appeared at 1440 or 390 pixels.

## Comparison history

1. P1: the founder image dominated the section. Fix: reduced section padding, image height and total frame width; capped the mobile portrait width. Post-fix evidence: `correction-founder-desktop.png` and the 390-pixel browser capture.
2. P1: generated lab art contained a false copy of the brand mark. Fix: replaced the workbench, oscilloscope study and server study with three assets that contain equipment only. The actual supplied mark is displayed separately. Post-fix evidence: `correction-lab-desktop.png`.
3. P1: the work list omitted CV projects. Fix: added Centralbrain, Platedom, Trolley Scout, MessageCFO and KinSpace; retained PathNote and Bikode; added four npm packages. Post-fix evidence: `correction-work-desktop.png`, with eleven project cards and four package rows verified in the browser.
4. P2: page text relied on broad studio claims. Fix: rewrote the founder, lab, work, capability and contact copy around named products, tasks and tools.

## Implementation checklist

- [x] Compact founder portrait on desktop and mobile.
- [x] Remove false brand shapes from generated lab art.
- [x] Display the real Boondock mark beside the lab copy.
- [x] Keep the Oil Motion logo and lab animation.
- [x] Include every product listed on the CV.
- [x] Include the extra portfolio products and published packages.
- [x] Replace broad claims with short factual copy.
- [x] Check desktop and mobile overflow, crops and readability.

final result: passed
