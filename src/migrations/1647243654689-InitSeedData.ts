import { MigrationInterface, QueryRunner } from 'typeorm'

// init for amazon use
export class InitSeedData1647243654689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // users
    await queryRunner.query(
      `INSERT INTO users (
        id,
        username,
        password
      ) VALUES (
        'builtin',
        'alan',
        '$2b$10$bv.8gv2HZ7gsAzZOF0GFge0VX0dXUk2xeceI7rBLmxQrc4fux6Wua'
      )`,
    )
    // oauth2clients
    await queryRunner.query(
      `INSERT INTO oauth2clients (
        id,
        name,
        clientId,
        clientSecret,
        redirectUris,
        grants,
        scope,
        userId
      ) VALUES (
        'builtin',
        'builtin',
        '579743f8875ccbfaedaf64c764b9883301a1957a',
        'bdff37b394ebd751f081aab846db95b7ccbf1fd4',
        'http://localhost:9000/oauth/builtin/callback',
        'authorization_code',
        'read_user,read_client,write_client,profile',
        'builtin'
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
