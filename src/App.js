import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "./App.css";
import LineGraph from "./components/LineGraph";
import CovidSummary from "./components/CovidSummary";
import axios from "./axios";

function App() {
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalRecovered, setTotalRecovered] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [loading, setLoading] = useState(false);
  const [covidSummary, setCovidSummary] = useState({});
  const [days, setDays] = useState(7);
  const [country, setCountry] = useState("");
  const [coronaCountAr, setCoronaCountAr] = useState([]);
  const [label, setLabel] = useState([]);

  const dispatch = useDispatch();

  const state = useSelector((state) => state);

  //ComponentDidMount
  useEffect(() => {
    setLoading(true);
    axios
      .get("/summary")
      .then((res) => {
        setLoading(false);

        if (res.status === 200) {
          dispatch({type:"UPDATEDDATA",data:res.data})
          setTotalConfirmed(state.data ? state.data.Global.TotalConfirmed : res.data.Global.TotalConfirmed);
          setTotalRecovered(state.data ? state.data.Global.NewRecovered : res.data.Global.NewRecovered);
          setTotalDeaths(state.data ? state.data.Global.TotalDeaths : res.data.Global.TotalDeaths);
          setCovidSummary(state.data ? state.data : res.data);
        }
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    //2021-5-4
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const _date = d.getDate();
    return `${year}-${month}-${_date}`;
  };

  const countryHandler = (e) => {
    setCountry(e.target.value);

    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - days));

    // console.log(from, to);

    getCoronaReportByDateRange(e.target.value, from, to);
  };

  const daysHandler = (e) => {
    setDays(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - e.target.value));
    getCoronaReportByDateRange(country, from, to);
  };

  const getCoronaReportByDateRange = (countrySlug, from, to) => {
    axios
      .get(
        `/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
      )
      .then((res) => {
        console.log(res);

        const yAxisCoronaCount = res.data.map((d) => d.Cases);
        const xAxisLabel = res.data.map((d) => d.Date);

        const covidDetails = covidSummary.Countries.find(
          (country) => country.Slug === countrySlug
        );

        setCoronaCountAr(yAxisCoronaCount);
        setTotalConfirmed(covidDetails.TotalConfirmed);
        setTotalRecovered(covidDetails.TotalRecovered);
        setTotalDeaths(covidDetails.TotalDeaths);
        setLabel(xAxisLabel);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <p>Fetching Data from API....</p>;
  }

  return (
    <div className="App">
      <CovidSummary
        totalConfirmed={totalConfirmed}
        totalRecoverd={totalRecovered}
        totalDeaths={totalDeaths}
        country={""}
      />
      <div>
        <select value={country} onChange={countryHandler}>
          <option value="">Select Country</option>
          {covidSummary.Countries &&
            covidSummary.Countries.map((country) => (
              <option key={country.Slug} value={country.Slug}>
                {country.Country}
              </option>
            ))}
        </select>
        <select value={days} onChange={daysHandler}>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <LineGraph yAxis={coronaCountAr} label={label} />
    </div>
  );
}

export default App;
