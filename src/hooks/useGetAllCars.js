import { useState, useEffect } from "react";
import axios from "axios";

const useGetAllCars = (filter) => {
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/cars/filter-cars?fuelType=${filter.fuelType}&brand=${filter.brand}&year=${filter.year}`
      )
      .then((res) => {
        setCarList(res.data);
      });
  }, [filter.brand, filter.year, filter.fuelType]);
  return { carList, setCarList };
};

export default useGetAllCars;
