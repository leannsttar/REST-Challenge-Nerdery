const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const config = {
  database: {
    url: getEnvVar("DATABASE_URL"),
  },
  jwt: {
    secret: getEnvVar("JWT_SECRET"),
  },
  server: {
    port: parseInt(process.env.PORT || "3000"),
  },
};
