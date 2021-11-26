import axios from "axios";
import { NftAttributes } from "./models/nft-attributes";
import { NftItem } from "./models/nft-item";
import attributesRarity from '../attributes-rarity.json';
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from "constants";

function parseAttributes(attrs: string): NftAttributes | null {
    const result: NftAttributes = new NftAttributes();
    const entries = attrs.split(",");
    
    entries.forEach(entry => {
        const e = entry.split(": "); // ["Background", "Yellow"]
        const key = e[0];
        const value = e[1];
        switch (key) {
            case "Background":
                result.background = value;
                break;
            case "Skin":
                result.skin = value;
                break;
            case "Eyes":
                result.eyes = value;
                break;
            case "Tusk":
                result.tusk = value;
                break;
            case "Clothes":
                result.clothes = value;
                break;
            case "Glasses":
                result.glasses = value;
                break;
            case "Neck":
                result.neck = value;
                break;
            case "Wrist":
                result.wrist = value;
                break;
            case "Head":
                result.head = value;
                break;
            case "Piercing":
                result.piercing = value;
                break;
            case "Specials":
                result.specials = value;
                break;
            default:
                return null;
        }
    });

    return result;

}

function parseItems(items: any[]): NftItem[] {
    const results: NftItem[] = [];

    items
    .filter(item => item.name.indexOf('Babolex GT') === -1)
    .forEach(item => {
        const nft = new NftItem();
        nft.id = item.id;
        nft.name = item.name;
        nft.tokenAdd = item.token_add;
        nft.price = item.price;
        nft.forSale = item.for_sale === 1;
        nft.linkImg = item.link_img;
        nft.collectionId = parseInt(item.name.substring(item.name.indexOf("#") + 1));
        nft.escrowAdd = item.escrowAdd;
        nft.attributes = parseAttributes(item.attributes);
        nft.sellerAddress = item.seller_address;
        nft.skin = item.skin;
        nft.type = item.type;
        nft.ranking = item.ranking;
        nft.lastSoldPrice = item.lastSoldPrice;
        results.push(nft);
    });

    return results;
}

function setRarity(items: NftItem[]) {
    items
    .forEach(item => {
        let nftRarity = null;
        for (const attrName of Object.keys(attributesRarity)) {
            const attrValue = item.attributes[attrName];
            let attrRarity = attributesRarity[attrName][attrValue || 'None'];
            //if (!attrRarity){
            //console.log(`Rarity of ${attrName} is ${attrRarity} ${attrValue}`);
           // }
            nftRarity == null ? nftRarity = attrRarity : nftRarity = nftRarity * attrRarity;
            item.name
        }
        //console.log(`Rarity of ${item.name} is  ${nftRarity} `);
        item.rarity = nftRarity;
    }
    );
                
} 

async function getNftSalesInfo() {
    try {
        const response = await axios.get('https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=babolex');
        const items = response.data;
        
        
        const nftItems = parseItems(items);
      //  console.log(nftItems.length);
       // console.log(nftItems[4]);
        setRarity(nftItems);

        let sortedRarity = nftItems.sort((first, second) => 0 - (first.rarity > second.rarity ? -1 : 1));
        console.log(sortedRarity[1]);

    } catch (error) {
        console.error(error);
    }
}

(async () => await getNftSalesInfo())();