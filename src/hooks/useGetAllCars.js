import { useState, useEffect } from "react";
import axios from "axios";

const useGetAllCars = (filter) => {
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/cars/filter-cars?color=${filter.color}&brand=${filter.brand}&year=${filter.year}`
      )
      .then((res) => {
        setCarList(res.data);
      });
  }, [filter.brand, filter.year, filter.color]);
  return { carList, setCarList };
};

export default useGetAllCars;
