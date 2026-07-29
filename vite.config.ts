import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/* Qualquer rota que não seja a home REDIRECIONA para "/" (302, a URL muda na barra).
   O fallback SPA do Vite servia o index.html no próprio path, então /lab.html continuava
   respondendo com a home sem trocar de endereço — parecia que a página ainda existia.

   O filtro precisa ser cirúrgico: no dev, TODAS as requisições passam por aqui — módulos
   (/src/...), o cliente do HMR (/@vite/...), dependências e os arquivos de public/. Se o
   redirect pegasse esses, o app não carregaria. Por isso só entram requisições de
   NAVEGAÇÃO: sem extensão de arquivo, ou terminando em .html. */
function redirectUnknownToHome() {
  return {
    name: 'redirect-unknown-to-home',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]

        // internos do Vite, código-fonte e dependências passam direto
        if (url.startsWith('/@') || url.startsWith('/src/') || url.startsWith('/node_modules/')) return next()

        // a home e o index continuam servindo normalmente
        if (url === '/' || url === '/index.html') return next()

        // arquivos reais de public/ (pdf, png, svg, favicon...) passam direto;
        // só .html é tratado como página, porque era o caso do lab
        const temExtensao = /\.[a-z0-9]+$/i.test(url)
        if (temExtensao && !url.endsWith('.html')) return next()

        res.writeHead(302, { Location: '/' })
        res.end()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    redirectUnknownToHome(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
