const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function post(path, body, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": options.ip || `203.0.113.${Math.floor(Math.random() * 180) + 1}`,
      ...(options.headers || {}),
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

(async () => {
  {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "content-type": "text/plain", "x-forwarded-for": "203.0.113.10" },
      body: "not-json",
    });
    assert(response.status === 415, `contact content-type guard: expected 415, got ${response.status}`);
  }

  {
    const { response } = await post("/api/contact", "{", { ip: "203.0.113.11" });
    assert(response.status === 400, `contact malformed JSON: expected 400, got ${response.status}`);
  }

  {
    const { response } = await post("/api/contact", { email: "broken" }, { ip: "203.0.113.12" });
    assert(response.status === 422, `contact validation: expected 422, got ${response.status}`);
  }

  {
    const { response, data } = await post(
      "/api/contact",
      {
        name: "Bot Person",
        email: "bot@example.com",
        description: "This is long enough to pass validation.",
        company_website: "https://spam.example",
      },
      { ip: "203.0.113.13" },
    );
    assert(response.status === 200 && data.ok === true, "contact honeypot did not silently accept");
  }

  {
    const { response, data } = await post(
      "/api/contact",
      {
        name: "Valid Person",
        email: "valid@example.com",
        description: "I need help clarifying the position of a growing business.",
      },
      { ip: "203.0.113.14" },
    );
    assert(
      [200, 503].includes(response.status),
      `contact valid contract: expected 200 or 503, got ${response.status}`,
    );
    assert(
      response.status !== 200 || data.ok === true,
      "contact success response did not include ok=true",
    );
  }

  {
    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "content-type": "text/plain", "x-forwarded-for": "203.0.113.20" },
      body: "not-json",
    });
    assert(response.status === 415, `newsletter content-type guard: expected 415, got ${response.status}`);
  }

  {
    const { response } = await post(
      "/api/newsletter",
      { email: "not-an-email" },
      { ip: "203.0.113.21" },
    );
    assert(response.status === 422, `newsletter validation: expected 422, got ${response.status}`);
  }

  {
    const { response } = await post(
      "/api/newsletter",
      {
        email: "audit@example.com",
        source: "recognition-audit",
        consent: false,
      },
      { ip: "203.0.113.22" },
    );
    assert(response.status === 422, `newsletter consent: expected 422, got ${response.status}`);
  }

  {
    const { response, data } = await post(
      "/api/newsletter",
      {
        email: "bot@example.com",
        company_website: "https://spam.example",
      },
      { ip: "203.0.113.23" },
    );
    assert(response.status === 200 && data.ok === true, "newsletter honeypot did not silently accept");
  }

  {
    const { response, data } = await post(
      "/api/newsletter",
      {
        email: "reader@example.com",
        source: "newsletter",
      },
      { ip: "203.0.113.24" },
    );
    assert(
      [200, 503].includes(response.status),
      `newsletter valid contract: expected 200 or 503, got ${response.status}`,
    );
    assert(
      response.status !== 200 || data.ok === true,
      "newsletter success response did not include ok=true",
    );
  }

  console.log("API contract gate passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
