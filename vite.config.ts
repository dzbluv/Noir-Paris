import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiMockPlugin(): Plugin {
  return {
    name: 'noir-api-mock',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/reservations' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (!data.name || !data.email || !data.phone || !data.guests || !data.date || !data.time) {
                res.statusCode = 422;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  detail: [
                    { loc: ['body'], msg: 'Missing required reservation fields.', type: 'value_error' }
                  ]
                }));
                return;
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Reservation request received.',
                reservation_id: 'NOIR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                data: {
                  name: data.name,
                  guests: Number(data.guests),
                  date: data.date,
                  time: data.time
                }
              }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: 'Invalid JSON payload' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), apiMockPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
