const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Se estiver rodando localmente, carrega src/.env
if (process.env.VERCEL !== '1') {
  dotenv.config({ path: '.env' });
}

const envContent = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  RECAPTCHA_SITE_KEY: '${process.env.RECAPTCHA_SITE_KEY}',
};
`;

const targetPath = path.join(__dirname, 'src/environments/environment.ts');

fs.writeFileSync(targetPath, envContent);
console.log(`✅ environment.ts gerado com RECAPTCHA_SITE_KEY: ${process.env.RECAPTCHA_SITE_KEY}`);
