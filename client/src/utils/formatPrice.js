export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return 'Rs. 0'
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`
}

export const formatDiscount = (original, sale) => {
  if (!sale || sale >= original) return null
  return Math.round(((original - sale) / original) * 100)
}
