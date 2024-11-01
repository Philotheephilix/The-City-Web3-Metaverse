import { CovalentClient } from "@covalenthq/client-sdk";

const ApiServices = async () => {
    const client = new CovalentClient("YOUR_API_KEY");
    const resp = await client.BaseService.getAddressActivity({chainName: "chainName", walletAddress: "walletAddress"});
    console.log(resp.data);
};

ApiServices();