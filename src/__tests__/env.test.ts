describe('Environment Variables', () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  beforeEach(() => {
    // Save original env
    jest.resetModules();
  });

  describe('Firebase Configuration', () => {
    it('should have all required Firebase environment variables', () => {
      const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

      if (missingVars.length > 0) {
        console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
      }

      // For CI/CD: all vars required
      // For development: warning only
      requiredEnvVars.forEach((varName) => {
        const value = process.env[varName];
        expect(value).toBeDefined();
      });
    });

    it('should validate Firebase API key format', () => {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      expect(apiKey).toBeDefined();
      expect(apiKey).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(apiKey?.length).toBeGreaterThan(20);
    });

    it('should validate Firebase auth domain format', () => {
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
      expect(authDomain).toBeDefined();
      expect(authDomain).toMatch(/\.firebaseapp\.com$/);
    });

    it('should validate Firebase project ID format', () => {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      expect(projectId).toBeDefined();
      expect(projectId).toMatch(/^[a-z0-9-]+$/);
    });

    it('should validate Firebase storage bucket format', () => {
      const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      expect(storageBucket).toBeDefined();
      expect(storageBucket).toMatch(/\.appspot\.com$/);
    });

    it('should have valid Firebase messaging sender ID', () => {
      const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      expect(messagingSenderId).toBeDefined();
      expect(messagingSenderId).toMatch(/^\d+$/);
      expect(messagingSenderId?.length).toBeGreaterThanOrEqual(10);
    });

    it('should have valid Firebase app ID', () => {
      const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
      expect(appId).toBeDefined();
      expect(appId).toMatch(/^[0-9:]+$/);
    });
  });

  describe('Environment Completeness', () => {
    it('should load Firebase config from environment variables', () => {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      // All values should be defined
      Object.entries(firebaseConfig).forEach(([, value]) => {
        expect(value).toBeDefined();
      });

      // No empty strings
      Object.entries(firebaseConfig).forEach(([, value]) => {
        if (value !== undefined) {
          expect(String(value).length).toBeGreaterThan(0);
        }
      });
    });

    it('should have correct Firebase configuration object structure', () => {
      const hasRequiredFields =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

      expect(hasRequiredFields).toBe(true);
    });
  });
});
