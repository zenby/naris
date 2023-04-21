import { MigrationInterface, QueryRunner } from 'typeorm';

export class v0401682057849572 implements MigrationInterface {
  name = 'v0.4.0.1682057849572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`documents\` ADD \`accessTag\` varchar(255) NOT NULL DEFAULT 'PRIVATE'`);
    await queryRunner.query(
      `ALTER TABLE \`documents\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`documents\` CHANGE \`updatedAt\` \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(`ALTER TABLE \`documents\` DROP COLUMN \`json\``);
    await queryRunner.query(`ALTER TABLE \`documents\` ADD \`json\` text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`documents\` DROP COLUMN \`json\``);
    await queryRunner.query(`ALTER TABLE \`documents\` ADD \`json\` varchar(255) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`documents\` CHANGE \`updatedAt\` \`updatedAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`
    );
    await queryRunner.query(
      `ALTER TABLE \`documents\` CHANGE \`createdAt\` \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`
    );
    await queryRunner.query(`ALTER TABLE \`documents\` DROP COLUMN \`accessTag\``);
  }
}
