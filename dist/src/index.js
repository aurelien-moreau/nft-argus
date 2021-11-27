"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const nft_attributes_1 = require("./models/nft-attributes");
const nft_item_1 = require("./models/nft-item");
const attributes_rarity_json_1 = __importDefault(require("../attributes-rarity.json"));
function parseAttributes(attrs) {
    const result = new nft_attributes_1.NftAttributes();
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
function parseItems(items) {
    const results = [];
    items
        .filter(item => item.name.indexOf('Babolex GT') === -1)
        .forEach(item => {
        const nft = new nft_item_1.NftItem();
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
function setRarity(items) {
    items
        .forEach(item => {
        let nftRarity = null;
        for (const attrName of Object.keys(attributes_rarity_json_1.default)) {
            const attrValue = item.attributes[attrName];
            let attrRarity = attributes_rarity_json_1.default[attrName][attrValue || 'None'];
            //if (!attrRarity){
            //console.log(`Rarity of ${attrName} is ${attrRarity} ${attrValue}`);
            // }
            nftRarity == null ? nftRarity = attrRarity : nftRarity = nftRarity * attrRarity;
            item.name;
        }
        //console.log(`Rarity of ${item.name} is  ${nftRarity} `);
        item.rarity = nftRarity;
    });
}
function setRankIndicator(items) {
    let sortedRarity = [...items];
    sortedRarity.sort((first, second) => 0 - (first.rarity > second.rarity ? -1 : 1));
    let sortedPrice = [...items];
    sortedPrice.sort((first, second) => 0 - (first.price < second.price ? -1 : 1));
    // sortedRarity.forEach(item => {console.log(`${item.name} ${item.price}`)});
    items
        .forEach(item => {
        item.rankRarity = sortedRarity.findIndex(x => x.id === item.id);
        item.rankPrice = sortedPrice.findIndex(x => x.id === item.id);
        item.rankIndicator = item.rankPrice - item.rankRarity;
    });
}
function getNftSalesInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=babolex');
            const items = response.data;
            const nftItems = parseItems(items);
            //  console.log(nftItems.length);
            // console.log(nftItems[4]);
            setRarity(nftItems);
            setRankIndicator(nftItems);
            let sortedIndicator = nftItems.sort((first, second) => 0 - (first.rankIndicator < second.rankIndicator ? -1 : 1));
            sortedIndicator
                .forEach(item => {
                console.log(`${item.name},${item.rankIndicator},${item.rankPrice},${item.rankRarity}`);
            });
            // maxPrice = Math.max.apply(Math, sortedRarity.map(function(o) {return o.price;}))
            // console.log(`${maxPrice}`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () { return yield getNftSalesInfo(); }))();
//# sourceMappingURL=index.js.map