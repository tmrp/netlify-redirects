import type { Context, Config } from "@netlify/edge-functions";

export const config: Config = {
  excludedPath: [
    "/.netlify/functions/*",
    "/_next/*",
    "/__nextjs_original-stack-frame",
    "/_ipx/*",
    "/api/*",
  ],
  path: "/redirect/random/from/*",
};

export default async function EdgeRandomRedirect(
  request: Request,
  context: Context,
): Promise<Response | void> {
  const netlifyHeaderToken = Netlify.env.get("NETLIFY_HEADER_TOKEN") ?? "";

  const url = new URL(request.url);
  const { origin, pathname } = url;

  const startTime = Date.now();

  console.log(
    `starting random redirect for ${origin}${pathname} on: ${startTime}`,
  );

  const getRandomRedirect = await fetch(
    `${origin}/.netlify/functions/builder-random-redirect`,
    {
      headers: {
        "x-netlify-header-token": netlifyHeaderToken,
        "x-nf-builder-cache":
          "public, max-age=300, stale-while-revalidate=604800",
      },
    },
  );

  const response = await getRandomRedirect.json();

  if (!response) {
    return context.next();
  }

  const endtime = Date.now();

  if (!response?.randomRedirect) {
    return context.next();
  }

  await fetch(`${origin}/api/cookie`, {
    method: "GET",
    headers: {
      "x-netlify-header-token": netlifyHeaderToken,
    },
    // body: JSON.stringify({
    //   cookie: {
    //     name: "RedirectedFrom",
    //     value: `${origin}${pathname}`,
    //   },
    // }),
  });

  console.log(
    `redirecting for ${origin}${pathname}. Time taken: ${
      endtime - startTime
    }ms. end time stamp: ${endtime}`,
  );

  return Response.redirect(
    `/redirect/random/to${response.randomRedirect}`,
    301,
  );
}
