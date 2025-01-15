import chalk from 'chalk';
import readline from 'readline-sync';

import openai from './config/open-ai.js';

(async () => {
  console.log(chalk.bold.green('Welcome to the Chatbot Program!'));
  console.log(chalk.bold.green('You can start chatting with the bot.'));

  const chatHistory = [];

  while (true) {
    const userInput = readline.question(chalk.yellow('You: '));

    try {
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      messages.push({ role: 'user', content: userInput });

      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });

      const completionText = chatResponse.data.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(chalk.green('Bot: ') + completionText);
        break;
      }

      console.log(chalk.green('Bot: ') + completionText);

      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      if (error.response) {
        console.error(chalk.red(error.response.data.error.code));
        console.error(chalk.red(error.response.data.error.message));

        return;
      }

      console.error(chalk.red(error));
      return;
    }
  }
})();
