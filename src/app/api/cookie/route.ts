"use server";

import { cookies } from "next/headers";

export async function POST(request: Request) {
  const headers = request.headers;

  const netlifyHeaderToken = headers.get("x-netlify-header-token");

  if (
    !netlifyHeaderToken ||
    netlifyHeaderToken !== process.env.NETLIFY_HEADER_TOKEN
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const body = await request.json();

  const {
    cookie: { name, value },
  } = body;

  if (!name || !value) {
    return new Response("Missing name or value", {
      status: 400,
    });
  }

  const response = new Response(JSON.stringify({ message: "Cookie set" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${name}=${value}; Max-Age=3600`,
    },
  });

  return Promise.resolve(response);
}

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  return new Response("Hello, Next.js!", {
    status: 200,
    headers: {
      "Set-Cookie": `token=blaaaa`,
    },
  });
}
