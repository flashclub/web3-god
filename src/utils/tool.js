const axios = require('axios');


export async function getContractABI(address) {
  const apiKey = 'DTI93JSM2MZD36D9V516FYSZ6TRQ3X84US'; // 替换为您的Etherscan API密钥

  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "1") {
      const res = data.result
      return JSON.parse(res);
    } else {
      throw new Error(`Error1 fetching ABI: ${data.result}`);
    }
  } catch (error) {
    throw new Error(`Error2 fetching ABI: ${error.message}`);
  }
}