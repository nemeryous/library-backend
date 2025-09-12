import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookTable1757641861167 implements MigrationInterface {
  name = 'CreateBookTable1757641861167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "available" boolean NOT NULL DEFAULT true, "author" character varying NOT NULL, "publisher" character varying NOT NULL, "description" character varying NOT NULL, "category" character varying NOT NULL, CONSTRAINT "UQ_bb553bc2d47b3189b4122910a11" UNIQUE ("code"), CONSTRAINT "PK_3ea5638ccafa8799838e68fad46" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "book"`);
  }
}
