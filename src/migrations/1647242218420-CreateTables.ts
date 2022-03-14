import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTables1647242218420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // users
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "username" varchar NOT NULL,
        "password" varchar NOT NULL,
        "email" varchar
      )`,
    )
    // oauth2clients
    await queryRunner.query(
      `CREATE TABLE "oauth2clients" (
        "id" varchar PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "name" varchar NOT NULL,
        "clientId" varchar NOT NULL,
        "clientSecret" varchar NOT NULL,
        "redirectUris" text array NOT NULL,
        "grants" varchar CHECK( "grants" IN ('authorization_code','client_credentials','refresh_token','password') ) NOT NULL,
        "userId" varchar,
        CONSTRAINT "FK_53180a1081e9d1472cf44737538" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    )
    // oauth2authorizationcodes
    await queryRunner.query(
      `CREATE TABLE "oauth2authorizationcodes" (
        "id" varcharr PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "authorizationCode" varchar NOT NULL,
        "expiresAt" datetime NOT NULL,
        "redirectUri" varchar NOT NULL,
        "scope" text array NOT NULL,
        "clientId" varchar,
        "userId" varchar,
        CONSTRAINT "UQ_b9dc77290ecbed3751a0a5b3858" UNIQUE ("authorizationCode"),
        CONSTRAINT "FK_ff0d2bbaaf84a3e3383cb131ebb" FOREIGN KEY ("clientId") REFERENCES "oauth2clients" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_5d3380c71085cb8ff64354785bd" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    )
    // oauth2accesstokens
    await queryRunner.query(
      `CREATE TABLE "oauth2accesstokens" (
        "id" varcharr PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "accessToken" varchar NOT NULL,
        "accessTokenExpiresAt" datetime NOT NULL,
        "refreshToken" varchar NOT NULL,
        "refreshTokenExpiresAt" datetime NOT NULL,
        "scope" text array,
        "clientId" varchar,
        "userId" varchar,
        CONSTRAINT "UQ_f93f0e0e1e5ada5bcd0b7068318" UNIQUE ("accessToken"),
        CONSTRAINT "UQ_5d926427bbe00d927ff1d1d3b62" UNIQUE ("refreshToken"),
        CONSTRAINT "FK_c2cf69e933912f09d0667a766b5" FOREIGN KEY ("clientId") REFERENCES "oauth2clients" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_2337371c1b739927ed5f427b5dd" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
