import {MigrationInterface, QueryRunner} from "typeorm";

export class carefulMassive1615973005618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`ALTER TABLE "user_profile" ADD "carefulMassive" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "carefulMassive"`);
    }

}
