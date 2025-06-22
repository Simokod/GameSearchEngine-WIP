class EnvConfig {
  readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  }
}

export const envConfig = new EnvConfig();
