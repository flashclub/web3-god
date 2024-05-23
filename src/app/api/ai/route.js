
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
  const { model = defaultModel, messages, key = '', prompt = `Follow the user's instructions carefully.Detailed analysis gives all analysis results. Respond using markdown.`, temperature = 0 } = reqjson
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
