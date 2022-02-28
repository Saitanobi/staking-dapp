import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface IResponseData {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    num_market_pairs: string;
    date_added: string;
    tags: string[];
    max_supply: number;
    circulating_supply: number;
    self_reported_market_cap: number;
    is_active: number;
    platform: any;
    cmc_rank: number;
    is_fiat: number;
    last_updated: string;
    quote: any;
}

interface IReturnData {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    circSupply: number;
}

const calcMarketCap = (reported: number | null, price: number, supply: number): number => {
    if (!reported) {
        return price * supply;
    } else {
        return reported;
    }
}

const getPrices = async(tokens: string): Promise<IReturnData[]> => {
    let url: string = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=' + tokens;
    let options: AxiosRequestConfig = {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_KEY
        }
    }

    const res: any = await axios.get(url, options).then((res: AxiosResponse) => {
        return res.data;
    }).catch((err: Error) => {
        console.log(err);
        return [];
    });

    const data: any = Object.values(res.data);
    const resObj: IReturnData[] = data.reduce((prev, curr: IResponseData) => {
        prev.push({
            name: curr['name'],
            symbol: curr['symbol'],
            price: curr['quote']['USD'].price,
            circSupply: curr['circulating_supply'] ? curr['circulating_supply'] : curr['self_reported_circulating_supply'],
            marketCap: calcMarketCap(curr['self_reported_market_cap'], curr['quote']['USD'].price, curr['circulating_supply'])
        });

        return prev;
    }, []);

    return resObj;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const tokens = req.query.tokens;
    const res = await getPrices(tokens);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: res,
        headers: {   
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Request-Headers': 'X-Custom-Header'
          }
    };

};

export default httpTrigger;