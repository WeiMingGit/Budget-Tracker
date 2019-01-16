export class BudgetLimit{
  constructor(
    public limit: number,
    public category: string,
    public userId:string,
    public date:string,
  ){}
}
