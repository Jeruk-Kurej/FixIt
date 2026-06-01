import midtransClient from 'midtrans-client';

const isProduction = process.env.NODE_ENV === 'production';

// Initialize Snap API
export const snap = new (midtransClient.Snap as any)({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

// Initialize Core API (if needed)
export const coreApi = new (midtransClient.CoreApi as any)({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

// Initialize Iris (Payouts)
// Note: In production Iris often uses Creator/Approver keys.
// For sandbox, we use the server key or the specific Iris API Key.
export const iris = new (midtransClient.Iris as any)({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
});
