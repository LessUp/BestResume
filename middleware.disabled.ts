import { auth } from "@/auth";
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});

export default auth((req) => {
  return intlMiddleware(req);
});
 
export const config = {
  // Match only internationalized pathnames
  // Skip all internal paths (_next, assets, api)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
