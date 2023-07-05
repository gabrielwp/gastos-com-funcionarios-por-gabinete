export interface DataModel {
  ano: string,
  meses: [
    {
      mes: string,
      resumo: [
        {
          gabinete: string,
          gastos: number,
          n_funcionarios: string
        }
      ]
    }
  ]
}
