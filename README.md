# AeroFlask - Responsive Product Landing Page

Assignment for the Web Developer Intern position at WebConstructive.
Built with plain **HTML + CSS + JavaScript**. No Bootstrap, Elementor or templates.

## Files

- `index.html` - semantic page structure (header, hero/product, features, enquiry form, footer)
- `style.css` - mobile-first styling, CSS variables, Flexbox + CSS Grid
- `script.js` - all the functionality (variants, price, quantity, validation, nav)

## Features implemented

- Responsive header with a hamburger menu on mobile (closes on link click, Escape key and when resized to desktop)
- Product hero with image (inline SVG), title, description, price and CTA
- 3 size variants (500 ml / 750 ml / 1 L) with dynamic price
- + / - quantity selector (min 1, max 10, also editable by typing)
- Dynamic total = variant price x quantity (formatted in INR)
- Enquiry form validation: name, email, 10-digit Indian mobile, message (min 10 chars)
- Inline error messages, success message after a valid submit
- The form shows the selected variant, quantity and total

## My approach

1. **Mobile-first CSS.** Base styles target small screens; `min-width` media queries at 600px (tablet) and 820px (desktop) add the 2-column hero, 3-column features and the inline navigation. Everything uses `box-sizing: border-box`, fluid widths and `max-width: 100%` on media so there is no horizontal scroll.
2. **Data-driven JavaScript.** Variants live in one `VARIANTS` array, and the radio buttons are rendered from it. A single `state` object (variant + quantity) feeds one `updateUI()` function, so price, total, bottle size and the form summary can never go out of sync.
3. **Validation.** Each field has a small validator function returning an error message. Fields validate on blur, re-validate while typing once invalid, and all are checked on submit (first invalid field gets focus).
4. **Accessibility.** Labels linked to inputs, `aria-expanded` on the nav toggle, `aria-live` on price/total and success message, visible focus styles, reduced-motion support.

## Run locally

Just open `index.html` in a browser. No build step needed.

## Deploy (live URL)

- **GitHub Pages:** push the repo, then Settings > Pages > Deploy from branch `main` (root).
- **Netlify / Vercel:** drag and drop the folder or connect the repo.
# Product-Landing-Page
