import { log, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/ERC20/ERC20"
import { TransferEntity, Token } from "../generated/schema"
import { ZERO_ADDRESS, ZERO_BD, ZERO, ONE } from "./helpers/constants"

import { fetchTokenSymbol, fetchTokenName,fetchTokenOwner, fetchTokenTotalSupply, fetchTokenDecimals } from './helpers/token'

import { createAddr,convertTokenToDecimal ,updateOrCreateAddrRelation} from './helpers/misc'


export function handleTransfer(event: Transfer): void {
    let token = Token.load(event.address.toHexString())
    if (token === null) {
        token = new Token(event.address.toHexString())
        let decimals = fetchTokenDecimals(event.address)
    
        if (decimals === null) {
            decimals=ZERO
        }
        token.decimals=decimals

        token.save()
    }
    
 

    let id=event.transaction.hash.toHexString()+"-"+event.logIndex.toHexString()
    let entity = TransferEntity.load(id)
    if (entity == null) {
        entity = new TransferEntity(id)
    }
    entity.contract=event.address
    entity.transferTo = event.params.to
    entity.transferFrom = event.params.from
    
    entity.value = convertTokenToDecimal(event.params.value, token.decimals)
    if (event.transaction.to != null) {
        entity.transactionTo = event.transaction.to as Bytes
    }
    if (event.transaction.from != null) {
        entity.transactionFrom = event.transaction.from as Bytes
    }
    entity.hash = event.transaction.hash
    entity.height = event.block.number
    entity.logIndex=event.logIndex
    entity.timestamp = event.block.timestamp

    entity.save()
  
    updateOrCreateAddrRelation(event.params.from,event.params.to,event.block.timestamp)
    
    createAddr(event.transaction.from,event.block.timestamp)
}