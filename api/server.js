// // frontend/api/server.js
// import express from 'express';
// import { createRequire } from 'module';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
//
// // Setup to handle ESM and TypeScript imports
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const require = createRequire(import.meta.url);
//
// // For TypeScript files, we need to use dynamic import
// const importInventoryHandler = async () => {
//   try {
//     // Try importing the TypeScript file directly first
//     const { default: handler } = await import('./inventory.ts');
//     return handler;
//   } catch (tsError) {
//     try {
//       // If that fails, try the compiled JS version
//       const { default: handler } = await import('./inventory.js');
//       return handler;
//     } catch (jsError) {
//       console.error('Error importing inventory handler:', jsError);
//       return (req, res) => res.status(500).json({ error: 'Server configuration error' });
//     }
//   }
// };
//
// const app = express();
// const port = process.env.PORT || 3001;
//
// // Middleware to parse JSON
// app.use(express.json());
//
// // Setup routes - we need to use an async IIFE to handle the dynamic import
// (async () => {
//   const inventoryHandler = await importInventoryHandler();
//
//   app.get('/api/inventory', (req, res) => {
//     // Convert Express req/res to Vercel format
//     const vercelReq = {
//       ...req,
//       query: req.query,
//       cookies: req.cookies || {},
//       body: req.body
//     };
//
//     inventoryHandler(vercelReq, res);
//   });
//
//   // Fallback route
//   app.use('*', (req, res) => {
//     res.status(404).json({ error: 'Not Found' });
//   });
//
//   // Start server if not in Vercel environment
//   if (process.env.NODE_ENV !== 'production') {
//     app.listen(port, () => {
//       console.log(`API server running on port ${port}`);
//     });
//   }
// })();
//
// // Export for Vercel
// export default app;
