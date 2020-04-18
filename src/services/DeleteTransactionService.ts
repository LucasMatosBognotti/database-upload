import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Return {
  message: string;
  code: number;
}

class DeleteTransactionService {
  public async execute(id: string): Promise<Return> {
    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id,
      )
    ) {
      throw new AppError('Id is not valid');
    }
    const transactionRepository = getCustomRepository(TransactionRepository);

    const hasTransaction = await transactionRepository.findOne(id);

    if (!hasTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionRepository.delete(id);

    return { message: 'Deleted successufuly', code: 200 };
  }
}

export default DeleteTransactionService;
