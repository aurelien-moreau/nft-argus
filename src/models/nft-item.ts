import { NftAttributes } from "./nft-attributes";

export class NftItem {
    id: number;
    collectionId: number;
    tokenAdd: string;
    price: number;
    forSale: boolean;
    linkImg: string;
    name: string;
    escrowAdd: string;
    sellerAddress: string;
    attributes: NftAttributes;
    skin: any;
    type: string;
    ranking: any;
    lastSoldPrice: any;
}