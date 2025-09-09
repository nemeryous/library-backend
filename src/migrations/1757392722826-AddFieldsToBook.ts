import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToBook1757392722826 implements MigrationInterface {
    name = 'AddFieldsToBook1757392722826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" RENAME COLUMN "ean13" TO "code"`);
        await queryRunner.query(`ALTER TABLE "book" RENAME CONSTRAINT "UQ_48547db14b8ba93c5ffc71df157" TO "UQ_153910bab5ef6438fb822a0c143"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" RENAME CONSTRAINT "UQ_153910bab5ef6438fb822a0c143" TO "UQ_48547db14b8ba93c5ffc71df157"`);
        await queryRunner.query(`ALTER TABLE "book" RENAME COLUMN "code" TO "ean13"`);
    }

}
