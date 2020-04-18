import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    }

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    const categoriesRepository = getRepository(Category);

    let hasCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!hasCategory) {
      hasCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(hasCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: hasCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
