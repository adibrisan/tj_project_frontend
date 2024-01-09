import React, { useState, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { Input, Button, Row, Col, Select } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useNavigate } from "react-router-dom";
import useSetCurrentUser from "../../hooks/useSetCurrentUser";
import { UserContext } from "../../context/UserContext";
import useGetAllCars from "../../hooks/useGetAllCars";
import axios from "axios";
import toast from "react-hot-toast";

const { Option } = Select;

function convertStringToNumber(str) {
  if (/^-?\d+$/.test(str)) {
    return parseInt(str, 10);
  } else if (/^-?\d+\.\d+$/.test(str)) {
    return parseFloat(str);
  } else {
    return str;
  }
}

const Operator = () => {
  const [filter, setFilter] = useState({
    brand: "",
    year: "",
    fuelType: "",
  });
  useSetCurrentUser();
  const [carFilter, setCarFilter] = useState({
    brand: "",
    year: "",
    fuelType: "",
  });
  const { carList, setCarList } = useGetAllCars(carFilter);
  const { currentUser } = useContext(UserContext);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();

  const columnDefs = [
    {
      headerName: "Registration Number",
      field: "registrationNumber",
      headerClass: "ag-header-cell-custom",
      width: "200px",
    },
    {
      headerName: "Brand",
      field: "brand",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Model",
      field: "model",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Color",
      field: "color",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Year",
      field: "year",
      valueGetter: (params) => Number(params.data?.year),
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Engine Capacity",
      field: "engineCapacity",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Fuel Type",
      field: "fuelType",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Power",
      field: "power",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Torque",
      field: "torque",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Trunk Volume",
      field: "trunkVolume",
      headerClass: "ag-header-cell-custom",
    },
    {
      headerName: "Price",
      field: "price",
      headerClass: "ag-header-cell-custom",
    },
  ];

  const [formData, setFormData] = useState({
    registrationNumber: "",
    brand: "",
    model: "",
    color: "",
    year: "",
    engineCapacity: "",
    fuelType: "Diesel",
    power: "",
    torque: "",
    trunkVolume: "",
    price: "",
  });

  const resetFormData = () => {
    setFormData({
      registrationNumber: "",
      brand: "",
      model: "",
      color: "",
      year: "",
      engineCapacity: "",
      fuelType: "Diesel",
      power: "",
      torque: "",
      trunkVolume: "",
      price: "",
    });
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: convertStringToNumber(value),
    }));
  };

  const handleSelectChange = (value) => {
    handleInputChange("fuelType", value);
  };

  const handleAdd = async () => {
    const { registrationNumber, ...restCar } = formData;
    restCar.userId = currentUser.userId;
    const carBody = restCar;
    try {
      if (formData.registrationNumber) {
        const response = await axios.post(
          `http://localhost:8080/api/cars/${formData.registrationNumber}`,
          carBody
        );
        if (response.status === 200) {
          toast.success("Successfully added a new car !");
          setCarList((prev) => [...prev, { ...carBody, registrationNumber }]);
        }
      } else {
        toast.error("Registration Number field is required !!!");
      }
    } catch (_err) {
      toast.error("Car not added: An error has occured.");
    }
    resetFormData();
  };

  const handleEdit = async () => {
    const { registrationNumber, ...restCar } = formData;
    restCar.userId = currentUser.userId;
    const carBody = restCar;
    try {
      if (formData.registrationNumber) {
        const response = await axios.put(
          `http://localhost:8080/api/cars/${formData.registrationNumber}`,
          carBody
        );
        if (response.status === 200) {
          toast.success("Successfully edited a car !");
          setCarList(
            carList.map((car) => {
              if (car.registrationNumber === registrationNumber) {
                return { ...car, ...carBody };
              }
              return car;
            })
          );
        }
      } else {
        toast.error("Registration Number field is required !!!");
      }
    } catch (_err) {
      toast.error("Car not edited: An error has occured.");
    }
    resetFormData();
  };

  const handleDelete = async () => {
    try {
      if (formData.registrationNumber) {
        const response = await axios.delete(
          `http://localhost:8080/api/cars/${formData.registrationNumber}`
        );
        if (response.status === 200) {
          toast.success("Successfully deleted a car !");
          setCarList(
            carList.filter(
              (car) => car.registrationNumber !== formData.registrationNumber
            )
          );
        }
      } else {
        toast.error("Registration Number field is required !!!");
      }
    } catch (_err) {
      toast.error("Car not deleted: An error has occured.");
    }
    resetFormData();
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const applyFilter = () => {
    setCarFilter(filter);
  };

  const clearFilter = () => {
    setCarFilter({
      brand: "",
      year: "",
      fuelType: "",
    });
    setFilter({
      brand: "",
      year: "",
      fuelType: "",
    });
  };

  const onLogoutClick = () => {
    navigate("/");
  };

  const colStyle = { width: "50%", margin: "0 auto" };
  return (
    <>
      {!!currentUser && (
        <h2 style={{ marginLeft: "50px" }}>Welcome, {currentUser.name}</h2>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: "50px",
          marginRight: "50px",
          gap: "5px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) =>
                handleInputChange("registrationNumber", e.target.value)
              }
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Model"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Color"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Year"
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Engine Capacity"
              type="number"
              value={formData.engineCapacity}
              onChange={(e) =>
                handleInputChange("engineCapacity", e.target.value)
              }
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Power"
              type="number"
              value={formData.power}
              onChange={(e) => handleInputChange("power", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Torque"
              type="number"
              value={formData.torque}
              onChange={(e) => handleInputChange("torque", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Trunk Volume"
              type="number"
              value={formData.trunkVolume}
              onChange={(e) => handleInputChange("trunkVolume", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Input
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} style={colStyle}>
            <Select
              placeholder="Fuel Type"
              value={formData.fuelType}
              onChange={handleSelectChange}
            >
              <Option value="Diesel">Diesel</Option>
              <Option value="Petrol">Petrol</Option>
              <Option value="Hybrid">Hybrid</Option>
              <Option value="EV">EV</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col span={2} style={{ width: "50%", margin: "0 auto" }}>
            <Button type="primary" onClick={handleAdd}>
              Add a car
            </Button>
          </Col>
          <Col span={2} style={{ width: "20%", margin: "0 auto" }}>
            <Button type="default" onClick={handleEdit}>
              Update car details
            </Button>
          </Col>
          <Col span={2} style={{ width: "20%", margin: "0 auto" }}>
            <Button type="default" danger={true} onClick={handleDelete}>
              Delete a car by RN
            </Button>
          </Col>
        </Row>
      </div>
      <div className="dashboard-container">
        <div
          className="ag-theme-balham"
          style={{
            height: "400px",
            marginLeft: "50px",
            marginRight: "50px",
          }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={carList}
            onGridReady={onGridReady}
            enableFilter={true}
            floatingFilter={true}
            domLayout="autoWidth"
          />
        </div>
        <Row
          gutter={16}
          className="filter-container"
          style={{ marginTop: "20px", marginLeft: "50px" }}
        >
          <Col span={6}>
            <Input
              type="text"
              placeholder="Brand"
              name="brand"
              value={filter.brand}
              onChange={onFilterChange}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              type="number"
              placeholder="Min. Year"
              name="year"
              value={filter.year}
              onChange={onFilterChange}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              type="text"
              placeholder="Fuel Type"
              name="fuelType"
              value={filter.fuelType}
              onChange={onFilterChange}
              allowClear
            />
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={applyFilter}>
              Apply filter
            </Button>
          </Col>
          <Col span={2}>
            <Button type="default" onClick={clearFilter}>
              Clear filter
            </Button>
          </Col>
        </Row>
        <Row justify="center" style={{ margin: "15px 0" }}>
          <Button onClick={onLogoutClick} style={{ marginTop: "20px" }}>
            Log Out
          </Button>
        </Row>
      </div>
    </>
  );
};

export default Operator;
