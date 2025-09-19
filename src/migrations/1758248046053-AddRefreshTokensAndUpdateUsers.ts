import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokensAndUpdateUsers1758248046053 implements MigrationInterface {
    name = 'AddRefreshTokensAndUpdateUsers1758248046053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" SERIAL NOT NULL,
                "userId" integer NOT NULL,
                "token" character varying NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "isRevoked" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'USER')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER'
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
    }

}
