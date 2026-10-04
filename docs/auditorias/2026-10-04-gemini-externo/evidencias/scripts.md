# Scripts auxiliares utilizados en la auditoría

> Documentación de scripts y comandos de diagnóstico ejecutados durante la auditoría independiente (Modo: `externo`, Auditor: `gemini-externo`).

---

## 1. Verificación de conectividad pasiva y cabeceras de producción

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY bash -c '
  echo "=== https://raupulus.dev ==="
  curl -sSI https://raupulus.dev
  echo "=== http://raupulus.dev ==="
  curl -sSI http://raupulus.dev
  echo "=== https://www.raupulus.dev ==="
  curl -sSI https://www.raupulus.dev
  echo "=== http://www.raupulus.dev ==="
  curl -sSI http://www.raupulus.dev
  echo "=== 404 test: https://raupulus.dev/no-existe-12345 ==="
  curl -sS -o /dev/null -w "HTTP code: %{http_code}\n" https://raupulus.dev/no-existe-12345
  echo "=== robots.txt ==="
  curl -sS https://raupulus.dev/robots.txt
  echo "=== sitemap.xml (head) ==="
  curl -sS https://raupulus.dev/sitemap.xml | head -n 30
  echo "=== api v1 ==="
  curl -sSI https://api.raupulus.dev/api/v1
  echo "=== api v2 ==="
  curl -sSI https://api.raupulus.dev/api/v2
  echo "=== DNS A ==="
  dig +short A raupulus.dev
  echo "=== DNS AAAA ==="
  dig +short AAAA raupulus.dev
  echo "=== DNS CAA ==="
  dig +short CAA raupulus.dev
  echo "=== DNS TXT ==="
  dig +short TXT raupulus.dev
  echo "=== DNS DMARC ==="
  dig +short TXT _dmarc.raupulus.dev
  echo "=== TLS Cert ==="
  openssl s_client -connect raupulus.dev:443 -servername raupulus.dev </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer
'
```

---

## 2. Verificación de versiones de la API externa

```bash
# Comprobación de API V1 vs API V2
curl -sS https://api.raupulus.dev/api/v1/platform/portfolio/info
curl -sS https://api.raupulus.dev/api/v2/platforms/portfolio
curl -sS https://api.raupulus.dev/api/v2/platforms/portfolio/contents
```

---

## 3. Puertas de calidad y empaquetado

```bash
npm run lint
npx vue-tsc --noEmit
npm run test:run
npm run test:coverage
npm run generate
```
