export type PaymentCreate = {
  nrOperation: string
  paymentMethodId: number
  ammount: number
  paymentDate: Date
  stateId: number
}