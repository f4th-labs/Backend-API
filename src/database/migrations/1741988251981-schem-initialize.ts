import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1741988251981 implements MigrationInterface {
    name = 'SchemaUpdate1741988251981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_2aef5338fc92183edcfe619c044" UNIQUE ("name"), CONSTRAINT "PK_aac53a9364896452e463139e4a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "content" character varying NOT NULL, "imageUrl" character varying, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, "authorId" uuid, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "news_category"`);
    }

}
