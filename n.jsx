import React from 'react';
import Chart from 'react-apexcharts';

const DashboardGraphs = () => {
  const data = {
    budget: 0,
    collaborateur_forme: [
      {
        classe_virtuelle: 0,
        cumul_total: 2,
        e_learning: 0,
        month: "2025_11",
        multimodal: 0,
        presentiel: 2,
        total_month: 2
      }
    ],
    consommation_du_mois: [
      {
        cost_by_month: 7000000,
        cumul_cost: 7278426.75,
        month: "2025_11"
      }
    ],
    nombre_heure_formation: [
      {
        cumul_hour: 16,
        etp_hour_number: 8,
        month: "2025_11",
        total_hour: 16
      }
    ]
  };

  // Graphique 1: Types de formation (Donut Chart)
  const formationTypesOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Présentiel', 'Classe Virtuelle', 'E-Learning', 'Multimodal'],
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
    title: {
      text: 'Répartition des Types de Formation',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const formationTypesSeries = [
    data.collaborateur_forme[0].presentiel,
    data.collaborateur_forme[0].classe_virtuelle,
    data.collaborateur_forme[0].e_learning,
    data.collaborateur_forme[0].multimodal
  ];

  // Graphique 2: Coûts (Bar Chart)
  const costsOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toLocaleString('fr-FR') + ' FCFA';
      }
    },
    xaxis: {
      categories: ['Coût du Mois', 'Coût Cumulé']
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toLocaleString('fr-FR');
        }
      }
    },
    colors: ['#775DD0'],
    title: {
      text: 'Consommation Budgétaire',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    }
  };

  const costsSeries = [{
    name: 'Montant (FCFA)',
    data: [
      data.consommation_du_mois[0].cost_by_month,
      data.consommation_du_mois[0].cumul_cost
    ]
  }];

  // Graphique 3: Heures de formation (Radial Bar)
  const hoursOptions = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%',
        },
        dataLabels: {
          name: {
            fontSize: '16px',
          },
          value: {
            fontSize: '20px',
            formatter: function (val) {
              return val + ' heures';
            }
          }
        }
      }
    },
    labels: ['Heures de Formation'],
    colors: ['#00E396'],
    title: {
      text: 'Heures de Formation du Mois',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    }
  };

  const hoursSeries = [data.nombre_heure_formation[0].total_hour];

  // Graphique 4: Statistiques globales (Mixed Chart)
  const mixedOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [0, 4]
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: [data.collaborateur_forme[0].month.replace('_', ' ')],
    xaxis: {
      type: 'category'
    },
    yaxis: [
      {
        title: {
          text: 'Collaborateurs Formés',
        }
      },
      {
        opposite: true,
        title: {
          text: 'Heures'
        }
      }
    ],
    colors: ['#008FFB', '#FEB019'],
    title: {
      text: 'Vue d\'ensemble Novembre 2025',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    }
  };

  const mixedSeries = [
    {
      name: 'Collaborateurs Formés',
      type: 'column',
      data: [data.collaborateur_forme[0].cumul_total]
    },
    {
      name: 'Heures de Formation',
      type: 'line',
      data: [data.nombre_heure_formation[0].cumul_hour]
    }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Tableau de Bord Formation - Novembre 2025
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Chart
            options={formationTypesOptions}
            series={formationTypesSeries}
            type="donut"
            height={350}
          />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Chart
            options={costsOptions}
            series={costsSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px'
      }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Chart
            options={hoursOptions}
            series={hoursSeries}
            type="radialBar"
            height={350}
          />
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Chart
            options={mixedOptions}
            series={mixedSeries}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardGraphs;
