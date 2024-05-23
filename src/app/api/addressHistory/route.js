import { getAddressHistory } from '@/utils/tool'


export async function GET(request) {
  // 获取查询参数
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address') || '';
  const res = await getAddressHistory(address)

  return new Response(JSON.stringify({ message: 'ok', data: { info: res } }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

}