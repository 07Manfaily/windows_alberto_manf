Voici le code avec des données sur 4 mois et un graphique d'évolution budgétaire amélioré :

```jsx
import React from 'react';
import Chart from 'react-apexcharts';

const DashboardFormation = () => {
  const data = {
    budget: 205000000,
    collaborateur_forme: [
      {
        classe_virtuelle: 0,
        cumul_total: 2,
        e_learning: 0,
        month: "2025_08",
        multimodal: 0,
        presentiel: 2,
        total_month: 2
      },
      {
        classe_virtuelle: 1,
        cumul_total: 5,
        e_learning: 1,
        month: "2025_09",
        multimodal: 0,
        presentiel: 3,
        total_month: 5
      },
      {
        classe_virtuelle: 2,
        cumul_total: 9,
        e_learning: 2,
        month: "2025_10",
        multimodal: 1,
        presentiel: 4,
        total_month: 9
      },
      {
        classe_virtuelle: 1,
        cumul_total: 12,
        e_learning: 1,
        month: "2025_11",
        multimodal: 0,
        presentiel: 3,
        total_month: 12
      }
    ],
    consommation_du_mois: [
      {
        cost_by_month: 5500000,
        cumul_cost: 5500000,
        month: "2025_08"
      },
      {
        cost_by_month: 6800000,
        cumul_cost: 12300000,
        month: "2025_09"
      },
      {
        cost_by_month: 8200000,
        cumul_cost: 20500000,
        month: "2025_10"
      },
      {
        cost_by_month: 7000000,
        cumul_cost: 27500000,
        month: "2025_11"
      }
    ],
    nombre_heure_formation: [
      {
        cumul_hour: 12,
        etp_hour_number: 6,
        month: "2025_08",
        total_hour: 12
      },
      {
        cumul_hour: 26,
        etp_hour_number: 7,
        month: "2025_09",
        total_hour: 14
      },
      {
        cumul_hour: 44,
        etp_hour_number: 9,
        month: "2025_10",
        total_hour: 18
      },
      {
        cumul_hour: 60,
        etp_hour_number: 8,
        month: "2025_11",
        total_hour: 16
      }
    ]
  };

  // Calculs pour le dernier mois
  const dernierMois = data.consommation_du_mois[data.consommation_du_mois.length - 1];
  const tauxConsommation = ((dernierMois.cumul_cost / data.budget) * 100).toFixed(2);
  const budgetRestant = data.budget - dernierMois.cumul_cost;

  // Préparation des données pour les graphiques
  const moisLabels = data.consommation_du_mois.map(item => {
    const [annee, mois] = item.month.split('_');
    const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return moisNoms[parseInt(mois) - 1] + ' ' + annee;
  });

  // Graphique d'évolution budgétaire (Line + Bar combiné)
  const budgetEvolutionOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1200
      },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 10,
        opacity: 0.1
      }
    },
    stroke: {
      width: [0, 4, 3],
      curve: 'smooth',
      dashArray: [0, 0, 5]
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 8
      }
    },
    fill: {
      type: ['gradient', 'solid', 'solid'],
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#764ba2'],
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100]
      }
    },
    colors: ['#667eea', '#f5576c', '#43e97b'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
      formatter: function (val) {
        return (val / 1000000).toFixed(1) + 'M';
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold'
      },
      background: {
        enabled: true,
        borderRadius: 6,
        padding: 4,
        opacity: 0.9
      }
    },
    xaxis: {
      categories: moisLabels,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Montant (FCFA)',
          style: {
            fontSize: '13px',
            fontWeight: 600
          }
        },
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0) + 'M';
          },
          style: {
            fontSize: '12px',
            fontWeight: 500
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Budget Total',
          style: {
            fontSize: '13px',
            fontWeight: 600,
            color: '#43e97b'
          }
        },
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0) + 'M';
          },
          style: {
            fontSize: '12px',
            fontWeight: 500,
            colors: ['#43e97b']
          }
        },
        min: 0,
        max: data.budget
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 600,
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 15
      }
    },
    grid: {
      borderColor: '#e9ecef',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 10
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function(val, opts) {
          if (opts.seriesIndex === 2) {
            return val.toLocaleString('fr-FR') + ' FCFA (Budget)';
          }
          return val.toLocaleString('fr-FR') + ' FCFA';
        }
      }
    }
  };

  const budgetEvolutionSeries = [
    {
      name: 'Coût Mensuel',
      type: 'column',
      data: data.consommation_du_mois.map(item => item.cost_by_month)
    },
    {
      name: 'Coût Cumulé',
      type: 'line',
      data: data.consommation_du_mois.map(item => item.cumul_cost)
    },
    {
      name: 'Budget Total',
      type: 'line',
      data: data.consommation_du_mois.map(() => data.budget)
    }
  ];

  // Gauge Budget
  const budgetGaugeOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1500,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
        },
        track: {
          background: '#f0f0f0',
          strokeWidth: '100%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            fontWeight: 600,
            color: '#333',
            offsetY: 50
          },
          value: {
            offsetY: -10,
            fontSize: '44px',
            fontWeight: 'bold',
            color: '#667eea',
            formatter: function (val) {
              return val.toFixed(1) + "%";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#f093fb', '#f5576c'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Consommation Budget']
  };

  const budgetGaugeSeries = [parseFloat(tauxConsommation)];

  // Évolution des collaborateurs formés
  const collaborateursEvolutionOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1200
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: moisLabels,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nombre de personnes',
        style: {
          fontSize: '13px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    colors: ['#43e97b', '#667eea'],
    legend: {
      position: 'top',
      fontSize: '13px',
      fontWeight: 600
    },
    grid: {
      borderColor: '#e9ecef',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + ' personnes';
        }
      }
    }
  };

  const collaborateursEvolutionSeries = [
    {
      name: 'Cumulé',
      data: data.collaborateur_forme.map(item => item.cumul_total)
    },
    {
      name: 'Du Mois',
      data: data.collaborateur_forme.map(item => item.total_month)
    }
  ];

  // Évolution des heures
  const heuresEvolutionOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1200
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: moisLabels,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Heures',
        style: {
          fontSize: '13px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    colors: ['#fa709a', '#fee140'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#f093fb', '#ffa502'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 100]
      }
    },
    legend: {
      position: 'top',
      fontSize: '13px',
      fontWeight: 600
    },
    grid: {
      borderColor: '#e9ecef',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + ' heures';
        }
      }
    }
  };

  const heuresEvolutionSeries = [
    {
      name: 'Heures du Mois',
      data: data.nombre_heure_formation.map(item => item.total_hour)
    },
    {
      name: 'Heures ETP',
      data: data.nombre_heure_formation.map(item => item.etp_hour_number)
    }
  ];

  // Donut Types de formation (données agrégées)
  const formationTotaux = data.collaborateur_forme.reduce((acc, item) => {
    acc.presentiel += item.presentiel;
    acc.classe_virtuelle += item.classe_virtuelle;
    acc.e_learning += item.e_learning;
    acc.multimodal += item.multimodal;
    return acc;
  }, { presentiel: 0, classe_virtuelle: 0, e_learning: 0, multimodal: 0 });

  const formationOptions = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1200
      },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 10,
        opacity: 0.2
      }
    },
    labels: ['Présentiel', 'Classe Virtuelle', 'E-Learning', 'Multimodal'],
    colors: ['#667eea', '#43e97b', '#f5576c', '#ffa502'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 600,
      markers: {
        width: 14,
        height: 14,
        radius: 14
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              fontWeight: 600,
              color: '#333'
            },
            value: {
              show: true,
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#667eea',
              formatter: function (val) {
                return val;
              }
            },
            total: {
              show: true,
              label: 'Total Formés',
              fontSize: '16px',
              fontWeight: 600,
              color: '#6c757d',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        },
        expandOnClick: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        opacity: 0.8
      }
    }
  };

  const formationSeries = [
    formationTotaux.presentiel,
    formationTotaux.classe_virtuelle,
    formationTotaux.e_learning,
    formationTotaux.multimodal
  ];

  const kpiCards = [
    {
      title: "Budget Total",
      value: (data.budget / 1000000).toFixed(0) + "M",
      subtitle: data.budget.toLocaleString('fr-FR') + " FCFA",
      icon: "💰",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadow: "0 10px 40px rgba(102, 126, 234, 0.3)"
    },
    {
      title: "Budget Consommé",
      value: (dernierMois.cumul_cost / 1000000).toFixed(2) + "M",
      subtitle: tauxConsommation + "% du budget",
      icon: "📊",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadow: "0 10px 40px rgba(245, 87, 108, 0.3)"
    },
    {
      title: "Budget Restant",
      value: (budgetRestant / 1000000).toFixed(0) + "M",
      subtitle: budgetRestant.toLocaleString('fr-FR') + " FCFA",
      icon: "💵",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      shadow: "0 10px 40px rgba(79, 172, 254, 0.3)"
    },
    {
      title: "Collaborateurs",
      value: data.collaborateur_forme[data.collaborateur_forme.length - 1].cumul_total,
      subtitle: "Formés au total",
      icon: "👥",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      shadow: "0 10px 40px rgba(67, 233, 123, 0.3)"
    },
    {
      title: "Heures Totales",
      value: data.nombre_heure_formation[data.nombre_heure_formation.length - 1].cumul_hour + "h",
      subtitle: "Formation cumulée",
      icon: "⏱️",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      shadow: "0 10px 40px rgba(250, 112, 154, 0.3)"
    },
    {
      title: "Dernier Mois",
      value: (dernierMois.cost_by_month / 1000000).toFixed(1) + "M",
      subtitle: dernierMois.cost_by_month.toLocaleString('fr-FR') + " FCFA",
      icon: "📅",
      gradient: "linear-gradient(135deg, #ffa502 0%, #ff6348 100%)",
      shadow: "0 10px 40px rgba(255, 165, 2, 0.3)"
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 25px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '50px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          letterSpacing: '-1px'
        }}>
          Dashboard Formation 2025
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c757d',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          📊 Août - Novembre 2025 - Analyse Complète sur 4 Mois
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        {kpiCards.map((kpi, index) => (
          <div key={index} style={{
            background: kpi.gradient,
            borderRadius: '20px',
            padding: '28px',
            color: 'white',
            boxShadow: kpi.shadow,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer',
            transform: 'translateY(0)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <div style={{
                fontSize: '48px',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
              }}>
                {kpi.icon}
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                backdropFilter: 'blur(10px)'
              }}>
                2025
              </div>
            </div>
            
            <div style={{
              fontSize: '16px',
              opacity: '0.95',
              marginBottom: '10px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              {kpi.title}
            </div>
            
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              marginBottom: '8px',
              letterSpacing: '-1px',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              {kpi.value}
            </div>
            
            <div style={{
              fontSize: '13px',
              opacity: '0.9',
              fontWeight: '500'
            }}>
              {kpi.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Graphique principal - Évolution Budgétaire */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '35px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '25px'
        }}>
          <div style={{
            fontSize: '32px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}>
            📈
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#333',
            margin: 0
          }}>
            Évolution Budgétaire Mensuelle
          </h3>
        </div>
        
        <Chart
          options={budgetEvolutionOptions}
          series={budgetEvolutionSeries}
          type="line"
          height={400}
        />
      </div>

      {/* Graphiques secondaires */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* Gauge Budget */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '35px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '32px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              📊
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#333',
              margin: 0
            }}>
              Taux de Consommation
            </h3>
          </div>
          
          <Chart
            options={budgetGaugeOptions}
            series={budgetGaugeSeries}
            type="radialBar"
            height={320}
          />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '25px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '13px', opacity: '0.9', marginBottom: '8px', fontWeight: '600' }}>
                Consommé
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>
                {(dernierMois.cumul_cost / 1000000).toFixed(2)}M
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '13px', opacity: '0.9', marginBottom: '8px', fontWeight: '600' }}>
                Restant
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>
                {(budgetRestant / 1000000).toFixed(0)}M
              </div>
            </div>
          </div>
        </div>

        {/* Types de formation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '35px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '32px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              📚
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#333',
              margin: 0
            }}>
              Types de Formation
            </h3>
          </div>
          
          <Chart
            options={formationOptions}
            series={formationSeries}
            type="donut"
            height={370}
          />
        </div>
      </div>

      {/* Évolutions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '30px'
      }}>
        {/* Évolution Collaborateurs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '35px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '32px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              👥
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#333',
              margin: 0
            }}>
              Collaborateurs Formés
            </h3>
          </div>
          
          <Chart
            options={collaborateursEvolutionOptions}
            series={collaborateursEvolutionSeries}
            type="area"
            height={320}
          />
        </div>

        {/* Évolution Heures */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '35px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '32px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              ⏱️
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#333',
              margin: 0
            }}>
              Distribution des Heures
            </h3>
          </div>
          
          <Chart
            options={heuresEvolutionOptions}
            series={heuresEvolutionSeries}
            type="bar"
            height={320}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardFormation;
```

🎯 **Nouveautés ajoutées :**

1. **Données sur 4 mois** : Août à Novembre 2025
2. **Graphique d'évolution budgétaire principal** :
   - Barres pour le coût mensuel
   - Ligne pour le coût cumulé
   - Ligne de référence pour le budget total
   - Permet de voir l'évolution mois par mois et le respect du budget

3. **Nouveaux graphiques d'évolution** :
   - Évolution des collaborateurs formés (mensuel vs cumulé)
   - Évolution des heures de formation (barres empilées)

4. **Amélioration de la visualisation** :
   - Labels des mois en français
   - DataLabels sur les graphiques
   - Tooltips détaillés
   - Légendes interactives

Le dashboard montre maintenant clairement la progression sur 4 mois et permet de suivre l'évolution du budget ! 📊✨
