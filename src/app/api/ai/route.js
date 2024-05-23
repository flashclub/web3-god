
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { NEXT_PUBLIC_DEFAULT_MODEL } from '@/utils/const';


export async function POST(req) {
  // 获取查询参数
  const reqjson = await req.json()
  const defaultModel = {
    id: NEXT_PUBLIC_DEFAULT_MODEL,
    maxLength: 12000,
    tokenLimit: 4000,
  }
  const { model = defaultModel, messages, key = '', temperature = 0, type } = reqjson
  const defaultPrompt = `As a programmer proficient in blockchain development, you know very much about web3 domain expertise, now you are given a smart contract or transaction hash or wallet address content and you can analyze some professional content. 
  I will give you smart contract content or transaction hash or wallet address and you will analyze it professionally. You don't have to list all the fields to explain them, give your professional analysis. Now I'm giving you the ${type}, so start analyzing.
  Respond using markdown.`
  let prompt = defaultPrompt
  const defaultMessage = [{ role: "user", content: messages }]
  let messagesToSend = [];

  for (let i = defaultMessage.length - 1; i >= 0; i--) {
    const message = defaultMessage[i];
    messagesToSend = [message, ...messagesToSend];
  }

  let promptToSend = prompt;
  let temperatureToUse = temperature;
  const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);

  return new Response(stream);
}
