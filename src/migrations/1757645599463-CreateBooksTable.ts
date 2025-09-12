import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBooksTable1757645599463 implements MigrationInterface {
    name = 'CreateBooksTable1757645599463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "books_id_seq" OWNED BY "books"."id"`);
        await queryRunner.query(`ALTER TABLE "books" ALTER COLUMN "id" SET DEFAULT nextval('"books_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "books_id_seq"`);
    }

}
