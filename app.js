const getCurrencyOptions = async () => {
  const apiUrl = "https://api.exchangerate.host/symbols";

  const response = await fetch(apiUrl);
  const json = await response.json();
  return json.symbols;

  // return fetch(apiUrl)
  //     .then((res) => res.json())
  //     .then((data) => data.symbols);
};

const getCurrencyRates = async (fromCurrency, toCurrency) => {
  const apiUrl = "https://api.exchangerate.host/convert";
  const currencyConvertUrl = new URL(apiUrl);
  currencyConvertUrl.searchParams.append("from", fromCurrency);
  currencyConvertUrl.searchParams.append("to", toCurrency);

  // console.log(currencyConvertUrl);
  //   const response = await fetch(currencyConvertUrl);
  //   const json = await response.json();

  //   console.log(json.result);
  //   return json.result;

  //or
  const response = fetch(currencyConvertUrl)
    .then((response) => response.json())
    .then((data) => data.result);
  return response;
};

// getCurrencyRates("NGN", "USD")

const appendOptionsElToSelectEl = (optionItem, selectEl) => {
  const optionEl = document.createElement("option");
  optionEl.value = optionItem.code;
  optionEl.textContent = optionItem.description;
  selectEl.appendChild(optionEl);
};

const populateSelectEl = (selectEl, optionItems) => {
  optionItems.forEach((optionItem) =>
    appendOptionsElToSelectEl(optionItem, selectEl)
  );
};

const setUpCurrencies = async () => {
  const fromCurrency = document.querySelector("#fromCurrency");
  const toCurrency = document.querySelector("#toCurrency");

  const currencyOptions = await getCurrencyOptions();
  const currenciesArray = Object.keys(currencyOptions);
  const currencies = currenciesArray.map(
    (currencyKey) => currencyOptions[currencyKey]
  );
  // console.log(currencies);

  populateSelectEl(fromCurrency, currencies);
  populateSelectEl(toCurrency, currencies);
};
setUpCurrencies();

const setUpEventListener = () => {
  const formEl = document.querySelector("#convert");
  formEl.addEventListener("submit", async (event) => {
    event.preventDefault(); //it prevent page to refresh after the form submission

    const fromCurrency = document.querySelector("#fromCurrency");
    const toCurrency = document.querySelector("#toCurrency");
    const amount = document.querySelector("#amount");
    const convertResultEl = document.querySelector("#result");

    try {
      const rates = await getCurrencyRates(
        fromCurrency.value,
        toCurrency.value
      );
      const amountValue = Number(amount.value);
      const conversionRate = Number(amountValue * rates).toFixed(2);
      convertResultEl.textContent = `${amountValue} ${fromCurrency.value} = ${conversionRate} ${toCurrency.value}`;
    } 
    catch (err) {
        convertResultEl.textContent = `there is an error: ${err.message}`;
        convertResultEl.classList.add("error")

    }

  });
};

setUpEventListener();
