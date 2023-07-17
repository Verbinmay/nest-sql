import { DataSource, EntityManager } from 'typeorm';

export abstract class TransactionBaseUseCase<I, O> {
  protected constructor(protected readonly dataSource: DataSource) {}

  abstract doLogic(input: I, manager: EntityManager): Promise<O>;

  public async execute(command: I) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const res = await this.doLogic(command, queryRunner.manager);
      // commit transaction now:

      await queryRunner.commitTransaction();
      return res;
    } catch (err) {
      // since we have errors let's rollback changes we made
      console.log('rollback');
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:

      await queryRunner.release();
    }
  }
}
