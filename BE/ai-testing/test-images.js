const OpenAI = require('openai');
const fs = require('fs');
const { join } = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: ['../.env_util', '../.env'] });

const main = async () => {
  const path = process.env.TEST_AI_IMAGES;
  const images = fs.readdirSync(path);

  let i = 1;
  for (const image of images) {
    const file = fs.readFileSync(join(path, image));
    const id = image.lastIndexOf('-');
    const newName = image.substring(id + 1);
    fs.writeFileSync(
      join('files', `${i.toString().padStart(2, 0)}_${newName}`),
      file,
    );
    i++;
  }

  const maskedFiles = fs.readdirSync('files');
  const result = {};

  for (const maskedFile of maskedFiles) {
    result[maskedFile] = [];
  }

  const filesToCheck = [
    ...maskedFiles,
    ...maskedFiles,
    ...maskedFiles,
    ...maskedFiles,
    ...maskedFiles,
  ];

  const filesToCheckLength = filesToCheck.length;

  let j = 1;
  while (filesToCheck.length > 0) {
    const randomIndex = Math.floor(Math.random() * filesToCheck.length);
    const name = filesToCheck[randomIndex];

    filesToCheck.splice(randomIndex, 1);

    const maskedFile = fs.readFileSync(join('files', name));
    const categoryValues =
      'biodegradable | recyclable | residualWaste | electronicWaste | bulkyWaste | constructionDebris | hazardousWaste';
    const amountValues = 'small | medium | large | x-large';

    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });
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
                url: `data:image/jpeg;base64,${maskedFile.toString('base64')}`,
              },
            },
          ],
        },
      ],
    });

    try {
      result[name].push(JSON.parse(response.choices[0].message.content));
    } catch (error) {
      result[name].push(response.choices[0].message.content);
    }
    console.log(`${j}/${filesToCheckLength} done.`);
    j++;
  }

  fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
  console.log(result);
};

main();
