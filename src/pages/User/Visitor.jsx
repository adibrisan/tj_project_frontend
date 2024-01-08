import React, { useState, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { Input, Button, Row, Col } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import useSetCurrentUser from "../../hooks/useSetCurrentUser";
import useGetAllCars from "../../hooks/useGetAllCars";

const Visitor = () => {
  const [filter, setFilter] = useState({
    brand: "",
    year: "",
    color: "",
  });
  const [carFilter, setCarFilter] = useState({
    brand: "",
    year: "",
    color: "",
  });
  useSetCurrentUser();
  const { carList } = useGetAllCars(carFilter);
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
    { headerName: "Year", field: "year", headerClass: "ag-header-cell-custom" },
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

  const onLogoutClick = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: "50px",
        marginRight: "50px",
      }}
    >
      {!!currentUser && <h2>Welcome, {currentUser.name}</h2>}
      <div
        className="ag-theme-balham"
        style={{
          height: "400px",
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
        justify="center"
        gutter={16}
        style={{
          marginTop: "20px",
        }}
      >
        <Col span={6}>
          <Input
            type="text"
            placeholder="Brand"
            name="brand"
            value={filter.brand}
            onChange={onFilterChange}
          />
        </Col>
        <Col span={6}>
          <Input
            type="number"
            placeholder="Min. Year"
            name="year"
            value={filter.year}
            onChange={onFilterChange}
          />
        </Col>
        <Col span={6}>
          <Input
            type="text"
            placeholder="Color"
            name="color"
            value={filter.color}
            onChange={onFilterChange}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={applyFilter}>
            Apply filter
          </Button>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Button onClick={onLogoutClick} style={{ marginTop: "20px" }}>
          Log Out
        </Button>
      </Row>
    </div>
  );
};

export default Visitor;
