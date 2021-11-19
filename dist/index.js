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
function getNftSalesInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=babolex');
            const items = response.data;
            const nftItems = parseItems(items);
            console.log(nftItems.length);
            console.log(nftItems[0]);
        }
        catch (error) {
            console.error(error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () { return yield getNftSalesInfo(); }))();
//# sourceMappingURL=index.js.map