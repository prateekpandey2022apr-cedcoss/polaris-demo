import {
  Page,
  Card,
  DataTable,
  ButtonGroup,
  Button,
  Text,
  Icon,
  Select,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftMinor, ArrowRightMinor } from "@shopify/polaris-icons";
import tempUsers from "./data";
import Loader from "./Loader";
import Navbar from "./Navbar";

function Dashboard(props) {
  const navigate = useNavigate();

  const options = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
  ];

  const filterOptions = [
    { label: "Select option", value: "" },
    { label: "Equals", value: "1" },
    { label: "Not Equals", value: "2" },
    { label: "Contains", value: "3" },
    { label: "Does Not Contains", value: "4" },
    { label: "Starts With", value: "5" },
    { label: "Ends With", value: "6" },
  ];

  const [dataRows, setDataRows] = useState([]);
  const [rowPerPage, setRowPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  const [userId, setUserId] = useState();
  const [filters, setFilters] = useState([]);
  const [selArr, setSelArr] = useState(Array(8).fill("-1"));
  const [columns, setColumns] = useState([
    "user_id",
    "catalog",
    "username",
    "shops.email",
    "shopify_plan",
    "updated_at",
    "created_at",
    "shop_url",
  ]);
  const [queryString, setQueryString] = useState("");

  // debugger;
  // console.log(selArr);
  // let filters;

  const buildQueryString = () => {
    let result = "";

    // debugger;

    for (let key in filterParams) {
      console.log(key);
      if (filterParams[key].value) {
        result += `&filter[${key}][${filterParams[key].selectedOption}]=${filterParams[key].value}`;
      }
    }

    return result;
  };

  const renderFilters = () => {
    let result = [];

    columns.forEach((column) => {
      // console.log(column);
      result.push(
        <>
          <Select
            // label="Date range"
            options={filterOptions}
            onChange={(value) => {
              // const temp = {
              //   [column]: value
              // }

              const temp = filterParams;

              // if(!temp.hasOwnProperty(column)){
              temp[column] = { selectedOption: value };
              // } else {
              // temp[column] = { selectedOption: value };
              // }
              debugger;
              setFilterParams({ ...filterParams });
            }}
            value={filterParams[column]?.selectedOption ?? ""}
          />
          <TextField
            disabled={filterParams[column]?.selectedOption === undefined}
            value={filterParams[column]?.value ?? ""}
            onChange={(value) => {
              debugger;
              // debugger;
              const temp = filterParams;
              temp[column].value = value;

              setFilterParams({ ...filterParams });

              // if(!temp.hasOwnProperty(column)){
              //   temp[column] = { selectedOption: value };
              // } else {
              //   temp[column] = { selectedOption: value };
              // }
              // filterOptions[column][value] = value;
            }}
            autoComplete="off"
          />
        </>
      );
    });

    return result;
  };

  // console.log(renderFilters());
  // setFilters([...renderFilters()]);

  const {
    user,
    setUser,
    error,
    setError,
    isLoading,
    setIsLoading,
    token,
    setToken,
  } = props;

  let users = [];

  const handleSelectChange = useCallback((value) => setRowPerPage(value), []);
  // const handleUserIdChange = useCallback((value) => setUserId(value), []);

  useEffect(() => {
    setFilters([...renderFilters()]);
  }, [filterParams]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError({ generalError: "Login to view the page." });
      return navigate("/");
    }

    setIsLoading(true);
    fetch(
      `https://fbapi.sellernext.com/frontend/admin/getAllUsers?activePage=${currentPage}&count=${rowPerPage}${queryString}`,
      {
        // method: "GET",
        // body: JSON.stringify(user),
        headers: {
          // "Content-Type": "application/json",
          // Accept: "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.data.rows);
        data.data.rows.forEach((row, idx) => {
          users[idx] = [];
          users[idx].push(row.user_id);
          users[idx].push(row.catalog);
          users[idx].push(row.shopify.domain);
          users[idx].push(row.shopify.email);
          users[idx].push(row.shopify_plan);
          users[idx].push(row.updated_at);
          users[idx].push(row.created_at);
          users[idx].push(row.shop_url);
        });

        setFilters([...renderFilters()]);
        setDataRows([...users]);
        setTotalRows(data.data.count);
        // if (!data.success) {
        //   setError({ ...error, form: data.message });
        //   throw new Error("Invalid username or password");
        // }
        // localStorage.setItem("token", data.data.token);
        navigate(`/dashboard?activePage=${currentPage}&count=${rowPerPage}`);
      })
      .catch((error) => {
        console.error(error);
        // setError({ ...error, generalError: error.toString() });
        alert(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rowPerPage, currentPage, queryString]);

  return (
    <>
      {error.generalError && (
        <div style={{ marginTop: "4px", textAlign: "center" }}>
          <div>{error.generalError}</div>
        </div>
      )}
      {isLoading ? (
        <>
          <div className="center" style={{ marginTop: "20px" }}>
            <Loader />
            <div>We're loading data...</div>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <Page title="Sales by product">
            {/* <Select
              label="Date range@@@@@@"
              options={filterOptions}
              onChange={handleUserIdChange}
              value={userId}
            /> */}

            <Card title="Online store dashboard" sectioned>
              <div className="row logout">
                <Button
                  primary
                  onClick={() => {
                    localStorage.removeItem("token");
                    setError({ generalError: "You've been logged out" });
                    return navigate("/");
                  }}
                >
                  Logout
                </Button>
              </div>
              <div className="row filter-btn">
                <Button
                  primary
                  onClick={() => {
                    setQueryString(buildQueryString());
                  }}
                >
                  Apply Filter
                </Button>
              </div>
              <div className="row">
                <div>
                  Showing page {currentPage} of{" "}
                  {Math.ceil(totalRows / rowPerPage)} pages.
                </div>
              </div>
              <div className="row">
                <div className="">
                  <ButtonGroup>
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <Icon source={ArrowLeftMinor} color="base" />
                    </Button>
                    <Text>Results</Text>
                    <Button
                      disabled={
                        Math.ceil(totalRows / rowPerPage) === currentPage
                      }
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <Icon source={ArrowRightMinor} color="base" />
                    </Button>
                  </ButtonGroup>
                </div>

                <div>
                  <Select
                    label="Rows Per Page"
                    options={options}
                    onChange={handleSelectChange}
                    value={rowPerPage}
                  />
                </div>
              </div>
            </Card>
            <Card>
              <DataTable
                columnContentTypes={[
                  "text",
                  "numeric",
                  "numeric",
                  "numeric",
                  "numeric",
                ]}
                headings={[
                  "User ID",
                  "Catalog",
                  "Shop Domain",
                  "Shop Email",
                  "Shopify Plan",
                  "Updated At",
                  "Created At",
                  "Shop URL",
                ]}
                hasZebraStripingOnData={true}
                rows={[filters, ...dataRows]}
                // totals={filters}
              />
            </Card>
          </Page>
        </>
      )}
    </>
  );
}

export default Dashboard;
