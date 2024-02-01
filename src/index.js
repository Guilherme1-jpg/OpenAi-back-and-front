import openai from './config/openai.js';
import readlineSync from 'readline-sync'
import colors from 'colors';
import fs from 'fs'

async function main() {

    const chatHistory = [];

    const timeStamp  = new Date().toISOString().replace(/[:.]/g, '_')

    const fileTo = `src/jsons/historyMessage_${timeStamp}.json`

    const dataToJson = {
      messageHis: chatHistory,
    }

    while(true) {

      const userInput = readlineSync.question(colors.cyan('Gui:'));

      try {
        const messages = chatHistory.map(([ role, content ]) => ({ role, content }))
  
        messages.push({role: 'user', content: userInput })
  
         const chatCompletion = await openai.chat.completions.create ({
          model: 'gpt-3.5-turbo',
          messages: messages,
        });
        
  
        const completionText = chatCompletion.choices[0].message.content;
  
        if (userInput.toLowerCase() === 'tchau') {
          
          dataToJson.messageHis.push(['user', userInput]);
          dataToJson.messageHis.push(['assistant', completionText]);

          fs.writeFile(fileTo, JSON.stringify(dataToJson, null, 2), 'utf-8', (error) => {
            if(error) {
              console.log('Error write to file')
              return;
            }
            console.log('New file is successful')
          })
  
          console.log(colors.green('Bot: ') + completionText);
          return;
        }
  
        console.log(colors.green('Bot: ') + completionText);
  
        chatHistory.push(['user', userInput]);
        chatHistory.push(['assistant', completionText]);
       
      } catch (error) {
        console.log(colors.red(error));
      }
    }
   
}

main();
