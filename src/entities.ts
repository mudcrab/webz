export interface JwtUser {
  id: string;
  iat: number;
}

export interface ConfigFile {
  db: any;
  controllers: string;
}
