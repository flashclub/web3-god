// app/api/hello/route.js
const { Web3 } = require('web3');
const infuraUrl = 'https://eth.llamarpc.com';

const web3 = new Web3(infuraUrl);

export async function GET(request) {
  return new Response(JSON.stringify({ message: 'Hello, Next.js App Router!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
