import { EmailMessage } from 'cloudflare:email';

const ALLOWED_ORIGINS = ['https://youdestudio.com', 'https://www.youdestudio.com'];
const FROM = 'contact@youdestudio.com';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

// Strips CR/LF so user input can never inject additional mail headers.
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ').trim();

const b64 = (s) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

function buildMime({ to, name, email, message }) {
  const body = b64(`Name: ${name}\nE-Mail: ${email}\n\n${message}`).replace(/.{1,76}/g, '$&\r\n');
  return [
    `From: Youde Studio Website <${FROM}>`,
    `To: ${to}`,
    `Reply-To: ${email}`,
    `Subject: =?UTF-8?B?${b64(`Kontaktformular: ${name}`)}?=`,
    `Message-ID: <${crypto.randomUUID()}@youdestudio.com>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
}

async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ ok: false }, 405);

  // ALLOW_ANY_ORIGIN is only set for local development (see .dev.vars in the README).
  if (!ALLOWED_ORIGINS.includes(request.headers.get('origin') || '') && !env.ALLOW_ANY_ORIGIN) {
    return json({ ok: false }, 403);
  }

  let data;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if ((data.get('website') || '').toString().trim() !== '') return json({ ok: true });

  const name = oneLine((data.get('name') || '').toString());
  const email = oneLine((data.get('email') || '').toString());
  const message = (data.get('message') || '').toString().trim();

  const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
  if (!name || name.length > 100 || !validEmail || email.length > 200 || !message || message.length > 5000) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  try {
    const raw = buildMime({ to: env.CONTACT_TO, name, email, message });
    await env.CONTACT_MAIL.send(new EmailMessage(FROM, env.CONTACT_TO, raw));
  } catch (err) {
    console.error('send failed', err && err.message);
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
