import { TronWeb } from "tronweb";

export async function GET() {
  // Initialize TronWeb
  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io", // Use mainnet for production
  });

  try {
    // Generate a new address
    const account = await tronWeb.createAccount();

    // Create a message with the address and private key
    const message = `**Public Address**: ${account.address.base58}**Private Key**: ${account.privateKey}
    `;

    // Return the message as a JSON response
    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating TRC-20 address:", error);
    return new Response(
      JSON.stringify({ message: "Failed to generate TRC-20 address" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
