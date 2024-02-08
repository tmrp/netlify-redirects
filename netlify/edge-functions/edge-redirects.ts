import { getStore } from '@netlify/blobs';
import type { Context, Config } from '@netlify/edge-functions';

export const config: Config = {
  excludedPath: [
    '/.netlify/functions/*',
    '/_next/*',
    '/__nextjs_original-stack-frame',
    '/_ipx/*',
  ],
  path: '/*',
};

export default async function EdgeRedirects(
  request: Request,
  context: Context
): Promise<Response | void> {
  const url = new URL(request.url);
  const { pathname } = url;

  const redirects = getStore('url-redirects');
  const urls = await redirects.get('urls', { type: 'json' });

  if (!urls?.length) {
    return context.next();
  }

  const validRedirect = urls.find(
    (redirect: { from: string }) => redirect.from === pathname
  );

  if (!validRedirect) {
    return context.next();
  }

  return Response.redirect(validRedirect.to, 301);
}
