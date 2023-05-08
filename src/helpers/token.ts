
import { ERC20 } from '../../generated/ERC20/ERC20'
import { Owner } from '../../generated/ERC20/Owner'

import { ERC20SymbolBytes } from '../../generated/ERC20/ERC20SymbolBytes'
import { ERC20NameBytes } from '../../generated/ERC20/ERC20NameBytes'

import { BigInt, Address } from '@graphprotocol/graph-ts'
import { isNullEthValue } from './index'
import { BLACKLIST } from './misc'
export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)
  if(BLACKLIST.includes(tokenAddress.toHexString())){
    return ""
  }
  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  let symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      } 
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress)
  if(BLACKLIST.includes(tokenAddress.toHexString())){
    return ""
  }
  // try types string and bytes32 for name
  let nameValue = 'unknown'
  let nameResult = contract.try_name()
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      } 
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let totalSupplyValue = null
  let totalSupplyResult = contract.try_totalSupply()
  if(BLACKLIST.includes(tokenAddress.toHexString())){
    return BigInt.fromI32(0)
  }
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult as i32
  }
  return BigInt.fromI32(totalSupplyValue as i32)
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = null
  if(BLACKLIST.includes(tokenAddress.toHexString())){
    return BigInt.fromI32(0)
  }
  let decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  } 

  return BigInt.fromI32(decimalValue as i32)
}


export function fetchTokenOwner(tokenAddress: Address): string {
  let contract = Owner.bind(tokenAddress)
  let ownerValue = ""
  if(BLACKLIST.includes(tokenAddress.toHexString())){
    return ""
  }
  let ownerResult = contract.try_owner()
  if (!ownerResult.reverted) {
    ownerValue = ownerResult.value.toHexString()
  }
  return ownerValue
}