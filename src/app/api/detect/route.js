const { Web3 } = require('web3');
const infuraUrl = 'https://eth.llamarpc.com';

const web3 = new Web3(infuraUrl);

async function isContractAddress(input) {
  // 检查地址是否有效

  if (!/^0x[0-9a-fA-F]{40}$/.test(input) && !/^0x[0-9a-fA-F]{64}$/.test(input)) {
    return 'invalid';
  }

  if (/^0x[0-9a-fA-F]{64}$/.test(input)) {
    return 'hash';
  }


  // 获取地址的代码
  const code = await web3.eth.getCode(input);

  // 如果代码长度大于2（'0x'），则该地址是合约地址
  return code.length > 2;
}

// 自定义replacer函数，将BigInt转换为字符串
function replacer(key, value) {
  const isBigint = typeof value === 'bigint'
  if (isBigint) {
    console.log(key, '是bigint');
  }
  return typeof value === 'bigint' ? value.toString() : value;
}

export async function GET(request) {
  // 获取查询参数
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input') || '';
  const res = await isContractAddress(input)
  if (typeof res === 'string') {
    let tx_dict = {}
    if (res === 'invalid') {
      tx_dict = {}
    } else {
      let tx = await web3.eth.getTransaction(input);
      const input_data = tx.input;
      const fromAddress = tx.from.toLowerCase();
      const toAddress = tx.to ? tx.to.toLowerCase() : null;
      tx_dict = JSON.stringify(tx, replacer, 2)
      console.log('tx: ', tx);
    }
    return new Response(JSON.stringify({ message: 'ok', data: { isContract: res, tx: tx_dict } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    console.log('res--', res);
    return new Response(JSON.stringify({ message: 'ok', data: { isContract: res } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}