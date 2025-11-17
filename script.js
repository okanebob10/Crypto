const cryptos = [
  { id: "bitcoin", name: "Bitcoin (BTC)" },
  { id: "ethereum", name: "Ethereum (ETH)" },
  { id: "tether", name: "Tether (USDT)" },
  { id: "solana", name: "Solana (SOL)" },
  { id: "usd-coin", name: "USD Coin (USDC)" },
  { id: "ripple", name: "XRP (XRP)" },
  { id: "litecoin", name: "Litecoin (LTC)" },
  { id: "tether-gold", name: "Tether Gold (XAUT)" },
  { id: "pax-gold", name: "Paxos Gold (PAXG)" },
  { id: "pancakeswap", name: "PancakeSwap (CAKE)" },
  { id: "polygon", name: "Polygon (MATIC)" }
];

let chart;
let usdToBrlRate = 1;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOMContentLoaded disparado.");
  await loadExchangeRate();

  const select = document.getElementById("crypto-select");

  cryptos.forEach(crypto => {
    const option = document.createElement("option");
    option.value = crypto.id;
    option.textContent = crypto.name;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    console.log(`🔄 Selecionada criptomoeda: ${select.value}`);
    loadCryptoData(select.value);
  });

  console.log("🚀 Carregando dados iniciais para Bitcoin...");
  loadCryptoData("bitcoin");
});

async function loadExchangeRate() {
  console.log("🌐 Buscando taxa de câmbio USD/BRL...");
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    usdToBrlRate = data.rates.BRL || 5.4;
    console.log(`💰 Taxa USD/BRL obtida: ${usdToBrlRate}`);
  } catch (err) {
    console.warn("⚠️ Não foi possível obter a taxa USD/BRL. Usando valor padrão.", err);
    usdToBrlRate = 5.4;
  }
}

async function loadCryptoData(cryptoId) {
  console.log(`🔍 Buscando dados para: ${cryptoId}`);

  // 🔧 USANDO PROXY ALTERNATIVO: allorigins.win
  const priceUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=' + cryptoId + '&vs_currencies=usd')}`;
  const chartUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.coingecko.com/api/v3/coins/' + cryptoId + '/market_chart?vs_currency=usd&days=30&interval=daily')}`;

  // Buscar preço atual
  try {
    console.log(`📡 Requisição de preço: ${priceUrl}`);
    const priceResponse = await fetch(priceUrl);
    console.log(`📥 Resposta de preço: Status ${priceResponse.status}`);
    const priceDataRaw = await priceResponse.json();
    console.log("📦 Dados brutos do preço:", priceDataRaw);

    // Verifica se 'contents' existe
    if (!priceDataRaw || !priceDataRaw.contents) {
      throw new Error("Resposta inválida: 'contents' não encontrada.");
    }

    const priceData = JSON.parse(priceDataRaw.contents);
    console.log("📊 Preço processado:", priceData);

    const priceUsd = priceData[cryptoId]?.usd;

    if (priceUsd !== undefined) {
      const priceBrl = priceUsd * usdToBrlRate;
      document.getElementById("price-usd").textContent = `USD: $${priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      document.getElementById("price-brl").textContent = `BRL: R$${priceBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      console.log(`✅ Preço atualizado: USD $${priceUsd}, BRL R$${priceBrl}`);
    } else {
      document.getElementById("price-usd").textContent = "USD: —";
      document.getElementById("price-brl").textContent = "BRL: —";
      console.warn(`⚠️ Preço não encontrado para ${cryptoId}`);
    }
  } catch (err) {
    console.error("❌ Erro ao buscar preço atual:", err);
    document.getElementById("price-usd").textContent = "USD: Erro";
    document.getElementById("price-brl").textContent = "BRL: Erro";
  }

  // Buscar dados do gráfico
  try {
    console.log(`📡 Requisição de gráfico: ${chartUrl}`);
    const chartResponse = await fetch(chartUrl);
    console.log(`📥 Resposta de gráfico: Status ${chartResponse.status}`);
    const chartDataRaw = await chartResponse.json();
    console.log("📦 Dados brutos do gráfico:", chartDataRaw);

    // Verifica se 'contents' existe
    if (!chartDataRaw || !chartDataRaw.contents) {
      throw new Error("Resposta inválida: 'contents' não encontrada.");
    }

    const chartData = JSON.parse(chartDataRaw.contents);
    console.log("📊 Dados do gráfico processados:", chartData);

    renderChart(chartData.prices);
  } catch (err) {
    console.error("❌ Erro ao buscar dados do gráfico:", err);
    alert("Não foi possível carregar o gráfico. Tente novamente.");
  }
}

function renderChart(prices) {
  if (!prices || prices.length === 0) {
    console.warn("⚠️ Nenhum dado disponível para o gráfico.");
    return;
  }

  const labels = prices.map(item => new Date(item[0]).toLocaleDateString('pt-BR'));
  const values = prices.map(item => item[1]);

  const ctx = document.getElementById("crypto-chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
     {
      labels,
      datasets: [{
        label: "Preço (USD)",
         values,
        borderColor: "#6f42c1",
        backgroundColor: "rgba(111, 66, 193, 0.1)",
        borderWidth: 2,
        pointRadius: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Histórico de Preços – Últimos 30 Dias"
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: { display: true, text: "Preço (USD)" }
        },
        x: {
          title: { display: true, text: "Data" }
        }
      }
    }
  });
}
