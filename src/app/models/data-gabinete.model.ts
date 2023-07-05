export interface DataGabineteModel {
  gabinete: string,
  anos: [
    {
      ano: string,
      meses: [
        {
          mes: string,
          resumo: [
            {
              gastos: number,
              n_funcionarios: string
            }
          ]
        }
      ]
    }
  ]
}
