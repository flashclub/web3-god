

import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_ORGANIZATION } from '@/utils/const';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export class OpenAIError extends Error {


  constructor(message, type, param, code) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model,
  systemPrompt,
  temperature,
  key,
  messages
) => {
  // let url = `${OPENAI_API_HOST}/v1/chat/completions`;
  let url = `${OPENAI_API_HOST}/chat/completions`;

  console.log('real req url', url);

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
      }),
    },
    method: 'POST',
    body: JSON.stringify({
      ...(OPENAI_API_TYPE === 'openai' && { model: model.id }),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: temperature,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    console.log('报错：', res);
    const result = await res.json();

    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code,
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }
  // event.data:
  // 正常数据：
  // {"id":"chatcmpl-8XPikbUR9d1ao6fIRnAr7xCYpR2u6","object":"chat.completion.chunk","created":1702974386,"model":"gpt-3.5-turbo-0613","system_fingerprint":null,"choices":[{"index":0,"delta":{"content":"和"},"logprobs":null,"finish_reason":null}]}
  // 结束前数据：
  // {"id":"chatcmpl-8XPikbUR9d1ao6fIRnAr7xCYpR2u6","object":"chat.completion.chunk","created":1702974386,"model":"gpt-3.5-turbo-0613","system_fingerprint":null,"choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"length"}]}
  // 结束数据：
  // [DONE]
  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event) => {
        if (event.type === 'event') {
          const data = event.data;
          // console.log('data 内容:', data === '[DONE]');
          if (data === '[DONE]') return
          try {
            const json = JSON.parse(data);
            if (json.choices[0].finish_reason != null) {
              controller.close();
              return;
            }
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            console.error('解析stream报错：', e)
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};