# Frontend layout and interaction issues

## Header and navigation
- The desktop and mobile navigation buttons are hard-coded in Chinese ("登录" / "免费开始") and ignore the current locale, so English visitors still see Chinese labels while the rest of the page is translated. This also prevents translation updates from `messages/en.json` / `messages/zh.json` from applying here. Relevant code is in `app/[locale]/page.tsx` lines 124-156.
- The mobile menu toggler only flips local state and never closes on navigation, locale change, or viewport resize, leaving the sheet open after the route changes or when returning to desktop width. There is also no outside-click or Escape handling. Relevant code is in `app/[locale]/page.tsx` lines 136-158.

## Templates section localization
- The section label is hard-coded as "Templates" instead of using translations like the rest of the section, so the heading stays English on the Chinese site. See `app/[locale]/page.tsx` lines 439-444.

## Layout polish gaps
- Floating badges around the preview card are absolutely positioned at fixed pixel offsets, which can overlap nearby content or clip on narrower viewports because they do not respond to container width. See `app/[locale]/page.tsx` lines 254-335.
