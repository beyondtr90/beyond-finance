import {TronWeb} from "tronweb";

const getTronGridUrl = (network) => {
  switch (network) {
    case "shasta":
      return "https://api.shasta.trongrid.io";
    case "nile":
      return "https://nile.trongrid.io";
    case "mainnet":
    default:
      return "https://api.trongrid.io";
  }
};

export async function POST(req) {
  const { address } = await req.json();

  if (!address) {
    return new Response(JSON.stringify({ msg: "Cüzdan adresi gerekli." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const network = "mainnet"; // veya istediğiniz diğer ağ
  const url = getTronGridUrl(network);
  
  // 'owner_address' olarak cüzdan adresini kullanıyoruz
  const tronWeb = new TronWeb({
    fullHost: url,
    privateKey: process.env.TRON_PRIVATE_KEY, // Eğer bir özel anahtar kullanıyorsanız
  });

  try {
    // USDT'nin kontrat adresi (Tron ağında)
    const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT kontrat adresi
    const balance = await tronWeb.trx.getAccount(address);

    // if (!balance || !balance.balance) {
    //   return new Response(JSON.stringify({ msg: "Cüzdan bulunamadı.", balance }), {
    //     status: 404,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    const usdtContract = await tronWeb.contract().at(USDT_CONTRACT);
    const usdtBalance = await usdtContract.methods.balanceOf(address).call();
    const usdtAmount = tronWeb.toDecimal(usdtBalance);
    const formattedBalance = (usdtAmount / 1e6).toFixed(2);

    return new Response(JSON.stringify({ address, usdtBalance: formattedBalance }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ msg: "Bir hata oluştu." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}