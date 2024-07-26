export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    throw new Error("no address");
  }

  const res = await fetch(
    `https://explorer-test-side02.aelf.io/api/address/transactions?limit=10&page=0&address=${address}&order=DESC`
  );
  const data = await res.json();

  return Response.json(data);
}
