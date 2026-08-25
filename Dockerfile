# ── Build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

ENV ASTRO_TELEMETRY_DISABLED=1

# Dependencies first, so editing content does not re-install node_modules.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Serve ────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="FAM — Folkestone AI Meetup"
LABEL org.opencontainers.image.description="Static site for the Folkestone AI Meetup"
LABEL org.opencontainers.image.source="https://github.com/ipedrazas/fam"
LABEL org.opencontainers.image.licenses="MIT"

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/fam.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
