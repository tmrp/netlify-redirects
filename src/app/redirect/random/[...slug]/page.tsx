"use server";

import { cookies, headers } from "next/headers";

export default async function CatchAllRedirectPage() {
  const headersList = headers();
  const cookie = cookies();
  const redirectCookie = cookie.get("RedirectedFrom");

  console.log("headers", await JSON.stringify(headersList));

  const redirect = redirectCookie?.value ?? headersList?.get("referer");

  return (
    <div>
      {redirect && (
        <p>
          You got redirected from <strong>{redirect}</strong>
        </p>
      )}
    </div>
  );
}
