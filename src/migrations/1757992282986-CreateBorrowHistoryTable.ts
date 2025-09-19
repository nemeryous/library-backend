import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBorrowHistoryTable1757992282986 implements MigrationInterface {
    name = 'CreateBorrowHistoryTable1757992282986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "borrow_history" ("id" SERIAL NOT NULL, "borrowDate" TIMESTAMP NOT NULL DEFAULT now(), "returnDate" TIMESTAMP DEFAULT now(), "status" character varying NOT NULL DEFAULT 'BORROWED', "userId" integer, "bookId" integer, CONSTRAINT "PK_86444fe6a3f2a209e9a857f31c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "users_id_seq" OWNED BY "users"."id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('"users_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "borrow_history" ADD CONSTRAINT "FK_5a65443cd4e2c5e695eda98417d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_history" ADD CONSTRAINT "FK_be440cf418f28f8ff21f304f3e1" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "borrow_history" DROP CONSTRAINT "FK_be440cf418f28f8ff21f304f3e1"`);
        await queryRunner.query(`ALTER TABLE "borrow_history" DROP CONSTRAINT "FK_5a65443cd4e2c5e695eda98417d"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
        await queryRunner.query(`DROP TABLE "borrow_history"`);
    }

}
