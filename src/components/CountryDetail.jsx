import React, { useEffect, useState } from "react";
import "./CountryDetail.css";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import CountryDetailShimmer from "./CountryDetailShimmer";
import { useTheme } from "../contexts/ThemeContext";

export default function CountryDetail() {
  //const countryName = new URLSearchParams(location.search).get("name");
  const [notFound, setNotFound] = useState("");
  const { state } = useLocation();
  console.log(state);
  const params = useParams();
  console.log(params);
  const countryName = params.country;
  const [countryData, setCountryData] = useState(null);
  const { isDark } = useTheme();

  const updateCountryData = (country) => {
    setCountryData({
      name: country.name.common,
      nativeName: Object.values(country.name.nativeName || {})[0]?.common,
      population: country.population,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital,
      flag: country.flags.svg,
      tld: country.tld,
      languages: Object.values(country.languages || {}).join(", "),
      currencies: Object.values(country.currencies || {})
        .map((currency) => currency.name)
        .join(", "),
      borders: [],
    });
    if (!country.borders) {
      country.borders = [];
    }

    Promise.all(
      country.borders.map((border) => {
        return axios
          .get(`https://restcountries.com/v3.1/alpha/${border}`)
          .then(({ data }) => {
            const borderCountry = data[0];
            return borderCountry.name.common;
          });
      })
    ).then((allBorderNames) => {
      setTimeout(() =>
        setCountryData((prevState) => ({
          ...prevState,
          borders: allBorderNames,
        }))
      );
    });
  };

  useEffect(() => {
    if (state) {
      updateCountryData(state);
      return;
    }
    axios
      .get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)

      .then(({ data }) => {
        console.log(data[0]);
        const country = data[0];
        console.log(country);
        updateCountryData(country);
      })
      .catch((error) => {
        // console.log(error);
        setNotFound("Country Not Found");
      });
  }, [countryName]);

  if (notFound)
    return (
      <div className="error">
        <span>{notFound}</span>
      </div>
    );

  return (
    <main className={`${isDark ? "dark" : ""}`}>
      <div className="country-details-container">
        <span className="back-button" onClick={() => history.back()}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>

        {countryData === null ? (
          <CountryDetailShimmer />
        ) : (
          <div className="country-details">
            <img src={countryData.flag} alt={`${countryData.name} flag`} />
            <div className="details-text-container">
              <h1>{countryData.name}</h1>
              <div className="details-text">
                <p>
                  <b>
                    Native Name: {countryData.nativeName || countryData.name}
                  </b>
                  <span className="native-name"></span>
                </p>
                <p>
                  <b>
                    Population: {countryData.population.toLocaleString("en-IN")}
                  </b>
                  <span className="population"></span>
                </p>
                <p>
                  <b>Region: {countryData.region}</b>
                  <span className="region"></span>
                </p>
                <p>
                  <b>Sub Region: {countryData.subregion}</b>
                  <span className="sub-region"></span>
                </p>
                <p>
                  <b>Capital: {countryData.capital?.join(", ")}</b>
                  <span className="capital"></span>
                </p>
                <p>
                  <b>Top Level Domain: {countryData.tld}</b>
                  <span className="top-level-domain"></span>
                </p>
                <p>
                  <b>Currencies: {countryData.currencies}</b>
                  <span className="currencies"></span>
                </p>
                <p>
                  <b>Languages: {countryData.languages}</b>
                  <span className="languages"></span>
                </p>
              </div>
              {countryData.borders.length !== 0 && (
                <div className="border-countries">
                  <b>Border Countries: </b>&nbsp;
                  {countryData.borders.map((border) => (
                    <Link key={border} to={`/${border}`}>
                      {border}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
