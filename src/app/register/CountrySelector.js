"use client";
import React, { useState, useEffect } from "react";
import LoadingModal from "../components/loadingModal/LoadingModal";

function CountrySelector({ selectedOption, setSelectedOption }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/countries");
      const data = await res.json();
      setCountries(data);
      setLoading(false);
    }

    fetchData();
  }, [setSelectedOption]);

  return (
    <div>
      {loading ? (
        <LoadingModal></LoadingModal>
      ) : (
        <select
          id="country"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {countries.map((country) => (
            <option key={country.id} value={country.dial_code}>
              {country.emoji} {country.code} ({country.dial_code})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default CountrySelector;
