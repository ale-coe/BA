import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { AmountEntity } from '../../../database/entities/amount.entity';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageClassifierService {
  private logger = new Logger(ImageClassifierService.name);

  constructor(
    @InjectRepository(AmountEntity)
    private readonly amountRepo: Repository<AmountEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  private async getAmontsAndCategories(): Promise<
    [AmountEntity[], CategoryEntity[], string, string]
  > {
    const amounts = await this.amountRepo.find({ order: { points: 'ASC' } });
    const categories = await this.categoryRepo.find({
      order: { points: 'ASC' },
    });

    const amountValues = amounts.map((amount) => amount.label).join(' | ');
    const categoryValues = categories
      .map((category) => category.label)
      .join(' | ');

    return [amounts, categories, amountValues, categoryValues];
  }

  async classifyImage(file: Express.Multer.File) {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });

    const [amounts, categories, amountValues, categoryValues] =
      await this.getAmontsAndCategories();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            `You act as an image classifier and shall classify the image in regard to the catergory and amount of trash you recognize in the image. ` +
            `Your response shall always contain only directly parsable, valid json in the form of { category: ${categoryValues} , amount: ${amountValues} }. ` +
            `If no trash can be deteced answer with { category: "none", amount: "none" }.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Classify the attached image!' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${file.buffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
    });

    try {
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      const categoryId =
        categories.find(({ label }) => label === parsedResponse.category)
          ?.categoryId || null;
      const amountId =
        amounts.find(({ label }) => label === parsedResponse.amount)
          ?.amountId || null;

      if (!categoryId || !amountId) {
        throw new Error('Could not find category or amount');
      }

      return { categoryId, amountId };
    } catch (error) {
      this.logger.error(error);
    }

    return { categoryId: null, amountId: null };
  }
}
