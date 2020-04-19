import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionFormatted {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: { id: string; title: string };
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const outcome = (await this.find())
      .filter(transaction => transaction.type === 'outcome')
      .reduce((amountValue, { value }) => {
        return amountValue + value;
      }, 0);

    const income = (await this.find())
      .filter(transaction => transaction.type === 'income')
      .reduce((amountValue, { value }) => {
        return amountValue + value;
      }, 0);

    const balance = {
      outcome,
      income,
      total: income - outcome,
    };

    return balance;
  }

  public async getTransactions(): Promise<TransactionFormatted[]> {
    const transactions = await this.find({
      relations: ['category'],
    }).then(result => {
      return result.map(transaction => ({
        id: transaction.id,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: {
          id: transaction.category.id,
          title: transaction.category.title,
        },
      }));
    });

    return transactions;
  }

  /*
  public async getTransactions(): Promise<TransactionFormatted[]> {
    const transactionsRepository = getRepository(Transaction);

    // Deve-se usar o 'relations' com o campo da tabela atual que você deu join em models
    const transactions = await transactionsRepository.find({
      select: ['id', 'title', 'value', 'type'],
      relations: ['category'],
    });

    return transactions;
  }
  */
}

export default TransactionsRepository;
