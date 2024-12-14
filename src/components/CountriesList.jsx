import React, { useEffect, useState } from "react";
import CountryCard from "./CountryCard";
import axios from "axios";
import CountriesListShimmer from "./CountriesListShimmer";

export default function CountriesList({ query }) {
  const [isError, setIsError] = useState(null);
  const [countriesData, setCountriesData] = useState([]);

  // Filter the countries based on the search query
  const filteredCountries = countriesData.filter(
    (country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase()) ||
      country.region.toLowerCase().includes(query.toLowerCase())
  );

  console.log(filteredCountries);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountriesData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setIsError(error.message);
      });
  }, []);

  console.log(countriesData);

  if (isError)
    return (
      <div className="error">
        <span>{isError}</span>
      </div>
    );

  if (!countriesData.length) {
    return <CountriesListShimmer />;
  }

  return (
    <>
      <div className="countries-container">
        {filteredCountries.length ? (
          filteredCountries.map((country) => (
            <CountryCard
              key={country.name.common}
              name={country.name.common}
              flag={country.flags.svg}
              population={country.population}
              region={country.region}
              capital={country.capital?.[0]}
              data={country}
            />
          ))
        ) : (
          <div className="not-found">Country not found</div>
        )}
      </div>
    </>
  );
}
