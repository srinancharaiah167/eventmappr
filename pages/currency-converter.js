import React, { useState, useEffect } from "react";
import Head from "next/head";

const CURRENCIES = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  CHF: { name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  RUB: { name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  ZAR: { name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  MXN: { name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  SEK: { name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  NOK: { name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  DKK: { name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  PLN: { name: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" }
};
const CURRENCY_CODES = Object.keys(CURRENCIES);
const POPULAR = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "INR", "CNY"];
const USD_RATES = {
  USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 155.5, AUD: 1.51, CAD: 1.37, CHF: 0.9, CNY: 7.25, INR: 83.3, BRL: 5.1, RUB: 90.5, ZAR: 18.8, MXN: 17.2, SGD: 1.35, NZD: 1.65, SEK: 10.4, NOK: 10.6, DKK: 6.85, PLN: 3.95, HKD: 7.8
};
function buildRates() {
  const rates = {};
  for (const from in USD_RATES) {
    rates[from] = {};
    for (const to in USD_RATES) {
      rates[from][to] = +(USD_RATES[to] / USD_RATES[from]).toFixed(4);
    }
  }
  return rates;
}
const RATES = buildRates();

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [converted, setConverted] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [dark, setDark] = useState(false);
  const [swapRotated, setSwapRotated] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
    return () => document.body.classList.remove("dark-mode");
  }, [dark]);

  function convertCurrency() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) {
      setConverted("");
      setShowResult(false);
      return;
    }
    const rate = RATES[from][to];
    const result = (amt * rate).toFixed(2);
    setConverted(result);
    setShowResult(true);
  }

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
    setShowResult(false);
    setSwapRotated(true);
    setTimeout(() => setSwapRotated(false), 400);
  }

  function handlePopular(code) {
    setFrom("USD");
    setTo(code);
    setAmount("1");
    setTimeout(() => convertCurrency(), 0);
  }

  function handleThemeToggle() {
    setDark((d) => !d);
  }

  useEffect(() => {
    if (showResult) convertCurrency();
    // eslint-disable-next-line
  }, [from, to]);

  return (
    <div className="currency-converter-page">
      <Head>
        <title>Currency Converter</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <header>
        
        
      </header>
      <div className="container">
        <h1><i className="fas fa-exchange-alt"></i><span style={{color:"black"}}>Currency </span> <span style={{color:"#2563eb"}}>Converter</span></h1>
        <div className="converter-container">
          <div className="converter-row">
            <div className="converter-box">
              <h3>From</h3>
              <div className="input-group">
                <label htmlFor="from-amount">Amount</label>
                <input
                  type="number"
                  id="from-amount"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="from-currency">Currency</label>
                <select
                  id="from-currency"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                >
                  {CURRENCY_CODES.map(code => (
                    <option key={code} value={code}>
                      {CURRENCIES[code].flag} {code} - {CURRENCIES[code].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className={`exchange-icon${swapRotated ? " rotated" : ""}`}
              onClick={swapCurrencies}
              onMouseEnter={() => setSwapRotated(true)}
              onMouseLeave={() => setSwapRotated(false)}
              style={{ transition: "transform 0.4s" }}
            >
              <i className="fas fa-exchange-alt" style={{color:"#2563eb"}}></i>
            </div>
            <div className="converter-box">
              <h3>To</h3>
              <div className="input-group">
                <label htmlFor="to-amount">Amount</label>
                <input
                  type="number"
                  id="to-amount"
                  placeholder="Converted amount"
                  value={showResult ? converted : ""}
                  readOnly
                />
              </div>
              <div className="input-group">
                <label htmlFor="to-currency">Currency</label>
                <select
                  id="to-currency"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                >
                  {CURRENCY_CODES.map(code => (
                    <option key={code} value={code}>
                      {CURRENCIES[code].flag} {code} - {CURRENCIES[code].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button className="btn" type="button" onClick={convertCurrency}>
            <i className="fas fa-calculator"></i> Convert
          </button>
          <div className={`result${showResult ? "" : " hidden"}`} id="result">
            <span id="conversion-result">{converted}</span> <span id="conversion-currency">{CURRENCIES[to].symbol} {to}</span>
          </div>
        </div>
        <div className="popular-currencies">
          <h3>Popular Currencies</h3>
          <div className="currency-grid">
            {POPULAR.map(code => (
              <div
                className="currency-card"
                key={code}
                onClick={() => handlePopular(code)}
              >
                <div>{CURRENCIES[code].flag}</div>
                <p>{code}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer>
        &copy; 2025 WanderHub. All rights reserved.
      </footer>
      <style jsx>{`
        * {
          margin:0;
          margin-top:0px;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        .currency-converter-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-image: url("https://images.unsplash.com/photo-1536698658763-878a02695d1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRvdXJpc218ZW58MHx8MHx8fDA%3D");
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .dark-mode .currency-converter-page,
        .currency-converter-page.dark-mode {
          background: #1a1a1a;
          color: #f5f5f5;
        }
        header {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .logo {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        .logo:hover {
          transform: scale(1.05);
        }
        .logo img {
          height: 40px;
          width: 40px;
          margin-right: 15px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .logo:hover img {
          border-color: rgba(255, 255, 255, 0.5);
          transform: rotate(10deg);
        }
        nav {
          display: flex;
          gap: 25px;
          align-items: center;
        }
        nav a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          padding: 8px 15px;
          border-radius: 20px;
          transition: all 0.3s ease;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        nav a::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #fff;
          transition: width 0.3s ease;
        }
        nav a:hover::before {
          width: 100%;
        }
        nav a:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .theme-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .theme-toggle:hover {
          transform: scale(1.1);
        }
        .container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 30px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          animation: fadeIn 0.5s ease-out;
          // color:green;
        }


  //       background-image: linear-gradient(#2563eb, white), linear-gradient(white, white); /* border gradient + background fill */
  // background-origin: border-box;
  // background-clip: border-box, padding-box;
        .dark-mode .container {
          background: rgba(45, 45, 45, 0.9);
          color: #f5f5f5;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight:bold;
          // color: #1d4e42;
          // color:#2563eb;
          color:black;
          margin-bottom: 20px;
          text-align: center;
        }
        .dark-mode h1 {
          color: #f5f5f5;
        }
        .converter-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .converter-row {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
        }
        .converter-box {
          flex: 1;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          // transformation:scale(1.2);

          border:1px black solid;
        }
        .dark-mode .converter-box {
          background: #333;
        }
        .converter-box:hover {
          // transform: translateY(-5px);
          // background:black;
          // color:white;
          color:blue;
          transform:scale(1.2);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .converter-box h3 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #333;
        }
        .dark-mode .converter-box h3 {
          color: #f5f5f5;
        }
        .converter-box h3:hover{
          color:white;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          color: #555;
        }
        .dark-mode .input-group label {
          color: #ddd;
        }
        .input-group select, .input-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          background: #fff;
          transition: all 0.3s ease;
        }
        .dark-mode .input-group select, .dark-mode .input-group input {
          background: #444;
          border-color: #555;
          color: #f5f5f5;
        }
        .input-group select:focus, .input-group input:focus {
          border-color: #1d4e42;
          box-shadow: 0 0 10px rgba(29, 78, 66, 0.2);
          outline: none;
        }
        .btn {
          // background: linear-gradient(45deg, #1d4e42, #2c7a5d);
          
          background:#2563eb;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn:hover {
          // background: linear-gradient(45deg, #2c7a5d, #1d4e42);
          background:black;

          color:white;

          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .result {
          margin-top: 30px;
          padding: 20px;
          background: #f0f7f4;
          border-radius: 10px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          color: #1d4e42;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .dark-mode .result {
          background: #2a3a35;
          color: #f5f5f5;
        }
        .result.hidden {
          display: none;
        }
        .exchange-icon {
          font-size: 24px;
          color: #1d4e42;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          margin: 0 10px;
        }
        .dark-mode .exchange-icon {
          color: #f5f5f5;
        }
        .exchange-icon.rotated {
          transform: rotate(180deg);
        }
        .exchange-icon:hover {
          transform: rotate(180deg);
        }
        .popular-currencies {
          margin-top: 30px;
        }
        .popular-currencies h3 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #333;
        }
        .dark-mode .popular-currencies h3 {
          color: #f5f5f5;
        }
        .currency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          align-items: center;

        }
        .currency-card {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          border:1px black solid;
          
        }
        .dark-mode .currency-card {
          background: #333;
        }
        .currency-card:hover {
          transform:scale(1.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          background:black;
          color:#50ABEF;
          

        }
        .currency-card img {
          width: 40px;
          height: 40px;
          margin-bottom: 10px;
        }
        .currency-card p {
          font-size: 14px;
          color: #555;
        }
        .dark-mode .currency-card p {
          color: #ddd;
        }
        footer {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 20px;
          margin-top: auto;
        }
        @media (max-width: 768px) {
          .converter-row {
            flex-direction: column;
          }
          .exchange-icon {
            transform: rotate(90deg);
            margin: 10px 0;
          }
          .exchange-icon:hover {
            transform: rotate(270deg);
          }
          .currency-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
