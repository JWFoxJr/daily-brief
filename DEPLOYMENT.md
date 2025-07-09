## 🚀 Deployment (Self-Hosted or Netlify)

### 🔧 Self-Hosting (NGINX)

1. Build your app:

```bash
npm run build
```

2. Upload the `dist` (Vite) or `build` (CRA) folder to your server.

3. Set up NGINX:

```nginx
server {
    listen 80;
    server_name jwfoxjr.com;

    root /var/www/jwfoxjr.com/html;
    index index.html;
    location / {
        try_files $uri /index.html;
    }
}
```

4. Restart NGINX and you're live.

### ☁️ Netlify

1. Push your code to GitHub.
2. Go to [https://netlify.com](https://netlify.com)
3. Link your repo, set build command to `npm run build` and publish directory to `dist`
4. Deploy and connect your custom domain.

