import { DataGabineteModel } from './models/data-gabinete.model';
import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataModel } from './models/data.model';
import { Chart } from 'chart.js';
import * as Utils from './utils/utils.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private URL = '../assets/json/gastos_com_funcionarios_por_gabinete.json';
  private data: DataModel[];
  gabinetes;
  gabinetesNovo = [];
  dataGabinetes: DataGabineteModel[] = [];
  gabineteSelecionado;
  seletorAnos = [];
  anosArray;
  dataGraph;
  graph;
  firstTime = true;

  selecoes = [
    { value: 'selecao-1', viewValue: 'Por ano e meses' },
    { value: 'selecao-2', viewValue: 'Por gabinete, ano e meses' },
  ];

  constructor(private httpClient: HttpClient) {
    this.httpClient
      .get(this.URL)
      .subscribe((res: DataModel[]) => (this.data = res));
  }

  ngOnInit() {
    setTimeout(() => {});

    setTimeout(() => {
      const filteredObjects = this.filterObjectsByProperty(
        this.data,
        'ano',
        '2017'
      );
      this.gabinetes = this.data[0].meses[0].resumo.map((obj) => obj.gabinete);

      console.log(this.data);

      this.data.forEach((dataModel) => {
        dataModel.meses.forEach((mes) => {
          mes.resumo.forEach((item) => {
            if (!this.gabinetesNovo.includes(item.gabinete)) {
              this.gabinetesNovo.push(item.gabinete);
            }

            const existingGabinete = this.dataGabinetes.find(
              (dataGabinete) => dataGabinete.gabinete === item.gabinete
            );

            if (existingGabinete) {
              const existingAno = existingGabinete.anos.find(
                (ano) => ano.ano === dataModel.ano
              );

              if (existingAno) {
                const existingMes = existingAno.meses.find(
                  (existingMes) => existingMes.mes === mes.mes
                );

                if (existingMes) {
                  existingMes.resumo.push({
                    gastos: Number(item.gastos),
                    n_funcionarios: item.n_funcionarios,
                  });
                } else {
                  existingAno.meses.push({
                    mes: mes.mes,
                    resumo: [
                      {
                        gastos: Number(item.gastos),
                        n_funcionarios: item.n_funcionarios,
                      },
                    ],
                  });
                }
              } else {
                existingGabinete.anos.push({
                  ano: dataModel.ano,
                  meses: [
                    {
                      mes: mes.mes,
                      resumo: [
                        {
                          gastos: Number(item.gastos),
                          n_funcionarios: item.n_funcionarios,
                        },
                      ],
                    },
                  ],
                });
              }
            } else {
              this.dataGabinetes.push({
                gabinete: item.gabinete,
                anos: [
                  {
                    ano: dataModel.ano,
                    meses: [
                      {
                        mes: mes.mes,
                        resumo: [
                          {
                            gastos: Number(item.gastos),
                            n_funcionarios: item.n_funcionarios,
                          },
                        ],
                      },
                    ],
                  },
                ],
              });
            }
          });
        });
      });

      this.onSelectGabinete(this.gabinetesNovo[0]);

      console.log(this.gabinetes);
      console.log(this.gabinetesNovo);
      console.log(this.dataGabinetes);
    }, 100);
  }

  filterObjectsByProperty(jsonArray, property, value) {
    return jsonArray.filter((obj) => obj[property] === value).map((obj) => obj);
  }

  onSelectGabinete(gabineteNome: string) {
    const dataGabinete = this.dataGabinetes.find(obj => obj.gabinete === gabineteNome);
    this.anosArray = [];

    dataGabinete.anos.forEach((ano) => {
      this.anosArray.push(ano.ano);
    });

    this.callChart(dataGabinete.gabinete, dataGabinete.anos[0].ano);
  }

  callChart(gabineteSelecao, anoSelecao) {
    const DATA_COUNT = 12;

    const fullData = {
      labels: Utils.months(12),
      min:0,
      max: 10000,
      datasets: [
        {
          data: [],
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }
      ],
    };

    const gabinete = this.dataGabinetes.find((gabinete) => gabinete.gabinete === gabineteSelecao);
    const ano = gabinete.anos.find((ano) => ano.ano === anoSelecao);


    ano.meses.forEach(mes => {
      fullData.datasets[0].data.push(mes.resumo[0].gastos);
    });

    this.dataGraph = fullData;
    console.log(this.dataGraph.datasets[0].data);


    this.carregarChart();
  }

  carregarChart() {
    const graphRef: HTMLCanvasElement = document.querySelector(
      '#grafico'
    );

    if (graphRef) {
      if(this.firstTime) {
        const graphCtx = graphRef.getContext('2d');
        this.graph = new Chart(graphCtx, this.configureGraph());
      } else {
        this.graph.data = this.dataGraph;
      }

      this.graph.update();
    }
  }

  configureGraph() {
    const DATA_COUNT = 12;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

    const labels = Utils.months({count: 12});

    const datas = {
      labels: labels,
      datasets: [
        {
          data: Utils.numbers(NUMBER_CFG),
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }
      ]
    };

    return {
      type: 'line',
      data: this.dataGraph,
      options: {
        responsive: true,
          legend: {
            display: false,
          }
      },
    };
  }
  // Usage example
  @HostListener('window:resize', ['$event'])
onResize() {
  this.graph.update();
}
}


