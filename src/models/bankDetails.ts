export class BankDetails{
  constructor(
    public accountName: string,
    public accountNumber: string,
    public availableBalance: number,
    public id: string,
    public bank: string,
  ){}
}
