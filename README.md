<p align="center">
  <img width="16%" src="docs/icon.png" alt="mobizon sms" title="mobizon sms"></a>
</p>

# urlshort-front — Encurtador de URLs com Angular
Interface desenvolvida com **Angular 19 + Angular Material**, para consumo da API do projeto [`encurtador-url-api`](https://github.com/Carlos-Henreis/encurtador-url-api).


  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/Carlos-Henreis/encurtador-url-front">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/Carlos-Henreis/encurtador-url-front">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Carlos-Henreis/encurtador-url-front">
  <img alt="GitHub license" src="https://img.shields.io/badge/license-MIT-blue.svg">

---

A aplicação permite:

* Encurtar URLs públicas
* Visualizar estatísticas de acesso
* Gerar QR Codes
* Compartilhar links encurtados

---

## 🔐 Segurança

Este projeto **não exige autenticação** dos usuários. Para proteger a API pública contra abusos, foram aplicadas as seguintes camadas de segurança:

### ✅ Google reCAPTCHA v2 (invisível)

* Evita automações e bots maliciosos
* Token do reCAPTCHA é gerado no frontend e enviado via header personalizado (`X-Recaptcha-Token`)
* A verificação é obrigatória para todas as chamadas sensíveis: encurtar, gerar QR Code e consultar estatísticas

### ✅ Rate Limiting por IP

* Implementado no backend via Bucket4j
* Limite de requisições para IPs não autenticados (ex: 50 por 5 minutos)
* Evita spam e ataques de negação de serviço

### ✅ CORS Restritivo

* A API aceita apenas requisições originadas do domínio do frontend
* Requisições com `Origin` ou `Referer` inválidos são bloqueadas pelo backend

---

## 🖼️ Exemplo de fluxo seguro

![Fluxo Seguro Angular + Spring Boot](./docs/seguranca-diagrama.png)

1. Usuário preenche a URL
2. Frontend ativa o reCAPTCHA invisível
3. Se o token for válido:

   * O token é enviado via header
   * A API valida o token e o `hostname`
   * Se passar, aplica rate limit
4. A resposta retorna a URL encurtada com opções de QR Code e estatísticas

---

## 🚀 Como rodar localmente

### Pré-requisitos

* [Node.js 20+](https://nodejs.org/)
* [Angular CLI](https://angular.io/cli)

### Instalar dependências

```bash
npm install
```

### Rodar localmente

```bash
ng serve
```

Acesse:

```
http://localhost:4200
```

> ⚠️ É necessário configurar as **variáveis de ambiente** para reCAPTCHA no arquivo `environment.ts`:

```ts
export const environment = {
  production: false,
  recaptchaSiteKey: 'SUA_SITE_KEY_DO_GOOGLE'
};
```

---

## 🧩 Estrutura

```
src/
├── app/
│   ├── features/ (shortener, stats)
│   ├── shared/   (components, services)
│   ├── core/     (configurações globais)
│   └── app.config.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
```

---

## 📦 Tecnologias

* Angular 19
* Angular Material
* Google reCAPTCHA v2 (Invisible)
* Vercel para deploy

---

## 🌐 Produção

A aplicação está publicada em:

📍 [`https://encurtadorurl.cahenre.com.br`](https://encurtadorurl.cahenre.com.br)

---

## 🧑‍💻 Autor

Carlos Henrique Reis
[https://cahenre.com.br](https://cahenre.com.br)

---
