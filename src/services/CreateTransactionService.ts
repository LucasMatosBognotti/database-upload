import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: string;
  value: number;
  category_id: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type !== ('income' || 'outcome')) {
      throw new AppError('Transaction type invalid', 401);
    }

    // const { total } = await transactionRepository.getBalance();

    /*
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    */

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
