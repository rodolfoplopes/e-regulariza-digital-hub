
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Globe, Shield, Settings, Zap } from 'lucide-react';

export default function ProductionSettings() {
  const { toast } = useToast();
  
  // Production configuration state
  const [config, setConfig] = useState({
    domain: localStorage.getItem('custom_domain') || 'app.e-regulariza.com.br',
    sslEnabled: localStorage.getItem('ssl_enabled') === 'true',
    recaptchaSiteKey: localStorage.getItem('recaptcha_site_key') || '',
    recaptchaSecretKey: localStorage.getItem('recaptcha_secret_key') || '',
    gtmId: localStorage.getItem('gtm_id') || '',
    gtmEnabled: localStorage.getItem('gtm_enabled') === 'true',
    buildOptimization: true,
    compressionEnabled: true,
    cacheEnabled: true,
  });

  const saveConfig = () => {
    // Save to localStorage (in production, this would go to a backend service)
    localStorage.setItem('custom_domain', config.domain);
    localStorage.setItem('ssl_enabled', config.sslEnabled.toString());
    localStorage.setItem('recaptcha_site_key', config.recaptchaSiteKey);
    localStorage.setItem('recaptcha_secret_key', config.recaptchaSecretKey);
    localStorage.setItem('gtm_id', config.gtmId);
    localStorage.setItem('gtm_enabled', config.gtmEnabled.toString());
    
    toast({
      title: "Configurações salvas",
      description: "As configurações de produção foram atualizadas com sucesso."
    });
  };

  const generateViteConfig = () => {
    const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}));
    `;
    
    const blob = new Blob([viteConfig], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vite.config.ts';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuração gerada",
      description: "Arquivo vite.config.ts de produção baixado com sucesso."
    });
  };

  const generateVercelConfig = () => {
    const vercelConfig = {
      "name": "e-regulariza-digital-hub",
      "version": 2,
      "builds": [
        {
          "src": "package.json",
          "use": "@vercel/static-build",
          "config": {
            "distDir": "dist"
          }
        }
      ],
      "routes": [
        {
          "src": "/api/(.*)",
          "dest": "/api/$1"
        },
        {
          "src": "/(.*)",
          "dest": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            {
              "key": "X-Content-Type-Options",
              "value": "nosniff"
            },
            {
              "key": "X-Frame-Options",
              "value": "DENY"
            },
            {
              "key": "X-XSS-Protection",
              "value": "1; mode=block"
            }
          ]
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(vercelConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vercel.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuração Vercel gerada",
      description: "Arquivo vercel.json baixado com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Produção</h2>
        <p className="text-gray-600">Configure a plataforma para ambiente de produção</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domínio e SSL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domínio e SSL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="domain">Domínio Personalizado</Label>
              <Input
                id="domain"
                value={config.domain}
                onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                placeholder="app.e-regulariza.com.br"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ssl"
                checked={config.sslEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, sslEnabled: checked })}
              />
              <Label htmlFor="ssl">Forçar HTTPS</Label>
            </div>
          </CardContent>
        </Card>

        {/* reCAPTCHA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              reCAPTCHA v2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recaptcha-site">Site Key</Label>
              <Input
                id="recaptcha-site"
                value={config.recaptchaSiteKey}
                onChange={(e) => setConfig({ ...config, recaptchaSiteKey: e.target.value })}
                placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              />
            </div>
            <div>
              <Label htmlFor="recaptcha-secret">Secret Key</Label>
              <Input
                id="recaptcha-secret"
                type="password"
                value={config.recaptchaSecretKey}
                onChange={(e) => setConfig({ ...config, recaptchaSecretKey: e.target.value })}
                placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Tag Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Google Tag Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gtm-id">GTM Container ID</Label>
              <Input
                id="gtm-id"
                value={config.gtmId}
                onChange={(e) => setConfig({ ...config, gtmId: e.target.value })}
                placeholder="GTM-XXXXXXX"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="gtm-enabled"
                checked={config.gtmEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, gtmEnabled: checked })}
              />
              <Label htmlFor="gtm-enabled">Habilitar GTM</Label>
            </div>
          </CardContent>
        </Card>

        {/* Otimizações de Build */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Otimizações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="build-optimization"
                checked={config.buildOptimization}
                onCheckedChange={(checked) => setConfig({ ...config, buildOptimization: checked })}
              />
              <Label htmlFor="build-optimization">Otimização de Build</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="compression"
                checked={config.compressionEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, compressionEnabled: checked })}
              />
              <Label htmlFor="compression">Compressão Gzip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="cache"
                checked={config.cacheEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, cacheEnabled: checked })}
              />
              <Label htmlFor="cache">Cache de Assets</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={saveConfig} className="bg-eregulariza-primary hover:bg-eregulariza-primary/90">
          Salvar Configurações
        </Button>
        <Button onClick={generateViteConfig} variant="outline">
          Gerar vite.config.ts
        </Button>
        <Button onClick={generateVercelConfig} variant="outline">
          Gerar vercel.json
        </Button>
      </div>

      {/* Build Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Comandos de Build para Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Build local:</h4>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                npm run build
              </code>
            </div>
            <div>
              <h4 className="font-semibold">Preview local:</h4>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                npm run preview
              </code>
            </div>
            <div>
              <h4 className="font-semibold">Deploy Vercel:</h4>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                vercel --prod
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
