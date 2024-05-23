const axios = require('axios');


export async function getContractABI(address) {
  const apiKey = 'DTI93JSM2MZD36D9V516FYSZ6TRQ3X84US'; // 替换为您的Etherscan API密钥

  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "1") {
      const res = data.result
      console.log('abi res', typeof res);
      return JSON.parse(res);
    } else {
      throw new Error(`Error1 fetching ABI: ${data.result}`);
    }
  } catch (error) {
    throw new Error(`Error2 fetching ABI: ${error.message}`);
  }
}
// 文档 https://docs.etherscan.io/api-endpoints/accounts

export async function getAddressHistory(address) {
  const apiKey = 'DTI93JSM2MZD36D9V516FYSZ6TRQ3X84US'; // 替换为您的Etherscan API密钥
  const modules = 'account', action = 'txlistinternal'; // module取account txlist 正常交易 txlistinternal 内部交易
  // const modules = 'contract', action = 'txlistinternal'; // module取account txlist 正常交易 txlistinternal 内部交易
  const url = `https://api.etherscan.io/api?module=${modules}&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
  try {
    const response = await axios.get(url);
    const data = response.data;
    const { status } = data;
    console.log('res status: ', status);
    if (status === "1") {
      const res = data.result
      console.log('res: ', typeof res);
      return res;
    } else if (status === '0') {
      console.log('取0');
      return []
    } else {
      throw new Error(`Error2 fetching address history: ${data.result}`);
    }
  } catch (error) {
    throw new Error(`Error3 fetching address history: ${error.message}`);
  }
}
export async function getAddressLog(address) {
  const apiKey = 'DTI93JSM2MZD36D9V516FYSZ6TRQ3X84US'; // 替换为您的Etherscan API密钥
  const modules = 'account', action = 'txlistinternal'; // module取account txlist 正常交易 txlistinternal 内部交易
  // const modules = 'contract', action = 'txlistinternal'; // module取account txlist 正常交易 txlistinternal 内部交易
  // const url = `https://api.etherscan.io/api?module=${modules}&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`

  const url = `https://api.etherscan.io/api?module=logs&action=getLogs&address=${address}&fromBlock=0&toBlock=99999999&page=1&offset=1000&apikey=${apiKey}`
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log('res data: ', data);
    const { status } = data;

    if (status === "1") {
      const res = data.result
      console.log('res: ', typeof res);
      return res;
    } else if (status === '0') {
      console.log('取0');
      return []
    } else {
      throw new Error(`Error2 fetching address log: ${data.result}`);
    }
  } catch (error) {
    throw new Error(`Error3 fetching address log: ${error.message}`);
  }
}