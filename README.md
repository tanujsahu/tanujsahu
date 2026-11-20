# Tanuj Sahu — Portfolio

An immersive portfolio for Tanuj Sahu, Senior Full Stack Developer and Team Lead. Visitors can walk a futuristic city where each building opens a part of the professional profile, or switch to a classic scrolling portfolio. Both views read the same data in `src/data`.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS
- Framer Motion for interface motion
- GSAP for the opening camera sequence
- React Three Fiber and Three.js for the city
- Lucide icons
- Simple Icons for real brand marks where the set includes them

## Scripts

```bash
npm install
npm run dev
npm run build
npm start
npm run lint
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata, Open Graph, sitemap, and robots. Defaults to `http://localhost:3000`. |
| `RESEND_API_KEY` | For the contact form | Resend API key. Without it, the form returns an error and does not pretend the message was sent. |
| `CONTACT_FROM_EMAIL` | For the contact form | Verified sender, for example `Tanuj Sahu <portfolio@yourdomain.com>`. |
| `CONTACT_TO_EMAIL` | No | Inbox that receives messages. Defaults to `tanujsahu09@gmail.com`. |

The contact API sends mail only after [Resend](https://resend.com) accepts the message. A verified domain is required for production. Resend's sandbox sender can only deliver to the account owner's email.

Direct email and click-to-call links work without any API key.

## City controls

- `W` `A` `S` `D` or arrow keys: walk
- `E` or click a nearby building: open that location
- Mouse wheel: zoom the camera
- `M`: city guide, with Go and Open for every location
- `C`: classic portfolio
- `Esc`: close the current panel
- Phone: on-screen joystick and Explore button

The mini-map travels to a building. The city guide can open a dossier without walking there.

If WebGL is unavailable, or Map fallback is selected in settings, the same movement and dossiers run on a top-down map. Reduced motion skips the orbiting intro and the particle field. Sound stays off until the visitor turns it on.

## Production build

```bash
npm run build
npm start
```

The city is drawn with code, so the first view does not wait on a large model download. `npm run build` also type-checks the project.

## Deploy on Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, import the project. Framework preset: Next.js. Install command: `npm install`. Build command: `npm run build`.
3. Add the environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL, including `https://`.
5. Deploy. After a custom domain is verified in Resend, set `CONTACT_FROM_EMAIL` to an address on that domain and redeploy.

No extra output setting is required. Vercel runs `next build` and hosts the App Router project.

## Content and placeholders

Portfolio copy comes from `src/data`. Do not add certifications, awards, client metrics, project URLs, or technologies that are not in those files.

- Profile photo: `public/profile.svg` is a monogram placeholder. Replace it only with a real photograph.
- Resume: `public/resume.pdf` is a generated text summary, also available at `/resume`. Replace the PDF with an official resume when you have one, then run `node scripts/generate-resume-pdf.mjs` only if you still want the generated file.
- Project demos and repositories: add `demoUrl` or `repositoryUrl` on a project in `src/data/projects.ts` when the URL is real. The UI shows those links only when the field is present.
- Oralift and Roezy intentionally have no technology list.
- AWS service marks are not bundled. Simple Icons no longer ships those brands, so those skills use a letter mark instead of a redrawn logo.

## Project structure

```text
src/app                routes, metadata, contact API
src/components/city    3D city, character, camera, map fallback
src/components/classic classic portfolio sections
src/components/hud     game interface
src/data               shared profile content
src/lib                movement, collision, email delivery
```
