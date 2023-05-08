import { BigDecimal, Address, BigInt, ethereum,log } from '@graphprotocol/graph-ts';

import { Token,AddrManager,AddrRelation } from "../../generated/schema"
import { ERC20 } from '../../generated/ERC20/ERC20'


import {ZERO, ZERO_BD,ONE} from './constants';
import {fetchTokenDecimals, fetchTokenName, fetchTokenSymbol} from "./token";

export let BLACKLIST: string[] = [
  "0x2fd8847d91416c5d8bfc5cedcf59d021ff918222", 
  "0xbf09ddf250962fcc5d8d2828b63eb1d95f1e7eb8",
  "0xed31100bb3f791914b015b7f31707f9387f40d62",
  "0x73e7282ee4bd723770014e1e3456ab825aeee7e5",
  "0xd9c00b36bd4d2a60aeb9ad624efb9f85b92d0a13",
  "0x0e9b390eee1a3c6a7859661686449d9bc23615f8",
  "0xe8ac92beb88ecdb6826a82ddb58b7fe9371962cd"
];

// export function tokenToDecimal(amount: BigInt, decimals: i32): BigDecimal {
//   let scale = BigInt.fromI32(10)
//     .pow(decimals as u8)
//     .toBigDecimal();
//   return amount.toBigDecimal().div(scale);
// }
export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO; i.lt(decimals as BigInt); i = i.plus(ONE)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}


// export function getTokenUserId(tokenAddress: Address, userAddress: Address,timestamp:BigInt): string {
//   let dayID = timestamp.toI32() / 86400
//   return tokenAddress.toHex().concat('-').concat(userAddress.toHex()).concat('-').concat(dayID.toString());
// }
export function getTokenUserId(tokenAddress: Address, userAddress: Address): string {
  return tokenAddress.toHex().concat('-').concat(userAddress.toHex());
}



export function createAddr(addr: Address, timestamp:BigInt): void {

  let addrM = AddrManager.load(addr.toHexString());
  if(addrM==null){
    addrM = new AddrManager(addr.toHexString())
    addrM.firstTransferTime=timestamp
    addrM.save()
  }

  return 
}
export function updateOrCreateAddrRelation(from: Address, to:Address, timestamp:BigInt): void {
  let id=from.toHexString()+"-"+to.toHexString()
  let addrR = AddrRelation.load(id)
  if(addrR==null){
    addrR = new AddrRelation(id)
    addrR.from=from
    addrR.to=to
    addrR.count=ONE
    addrR.updateTime=timestamp
    addrR.createTime=timestamp
  }else{
    addrR.count=addrR.count.plus(ONE)
    addrR.updateTime=timestamp
  }

  addrR.save()

  return 
}