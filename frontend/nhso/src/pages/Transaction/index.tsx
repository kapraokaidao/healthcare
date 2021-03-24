import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import dayjs from "dayjs";
import { debounce } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { TitleContext } from "../../App";
import { Transaction, Hospital, Token } from "../../types";
import "./style.scss";

const TransactionPage = () => {
  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle("Transaction");
  }, [setTitle]);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const fetchHospital = useCallback(
    debounce(async (name: string) => {
      const { data } = await axios.post("/hospital/search", {
        page: 1,
        pageSize: 100,
        hospital: {
          fullname: name,
        },
      });
      setHospitals(data.data);
    }, 1000),
    []
  );
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [serviceName, setServiceName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [checkHospital, setCheckHospital] = useState(false);
  const [checkServiceName, setCheckServiceName] = useState(false);
  const [checkName, setCheckName] = useState(false);
  const [checkStartDate, setCheckStartDate] = useState(false);
  const [checkEndDate, setCheckEndDate] = useState(false);
  useEffect(() => {
    const filter: any = {};
    if (checkHospital && selectedHospital) {
      filter["hospitalCode"] = selectedHospital.code9;
    }
    if (checkServiceName) filter["serviceName"] = serviceName;
    if (checkStartDate) filter["startDate"] = selectedStartDate.toISOString().split("T")[0];
    if (checkEndDate) filter["endDate"] = selectedEndDate.toISOString().split("T")[0];
    if (checkName) {
      filter["firstname"] = firstName;
      filter["lastname"] = lastName;
    }
    axios
      .post("/transaction/search", {
        page,
        pageSize: 20,
        ...filter,
      })
      .then(({ data }) => {
        setTransactions(data.data);
        setPage(data.page);
        setPageCount(data.pageCount);
      });
  }, [
    page,
    checkHospital,
    checkServiceName,
    checkName,
    checkStartDate,
    checkEndDate,
    selectedHospital,
    serviceName,
    firstName,
    lastName,
    selectedStartDate,
    selectedEndDate,
  ]);
  return (
    <>
      <h1>Transaction</h1>

      <table>
        <tr>
          <td>
            <Checkbox
              checked={checkHospital}
              onChange={(e) => {
                setCheckHospital(e.target.checked);
              }}
              color="primary"
            />
          </td>
          <td>Hospital</td>
          <td>
            <Autocomplete
              value={selectedHospital}
              onChange={(_, newValue) => {
                setSelectedHospital(newValue);
              }}
              onInputChange={(_, newInputValue) => {
                fetchHospital(newInputValue);
              }}
              options={hospitals}
              getOptionLabel={(option) => option.fullname || ""}
              style={{ width: 200 }}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox
              checked={checkServiceName}
              onChange={(e) => {
                setCheckServiceName(e.target.checked);
              }}
              color="primary"
            />
          </td>
          <td>Service Name</td>
          <td>
            <Input
              placeholder="optional"
              onChange={(e) => {
                setServiceName(e.target.value);
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox
              checked={checkName}
              onChange={(e) => {
                setCheckName(e.target.checked);
              }}
              color="primary"
            />
          </td>
          <td>Name</td>
          <td>
            <Input
              placeholder="First Name"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <Input
              placeholder="Last Name"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              style={{ marginLeft: 15 }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox
              checked={checkStartDate}
              onChange={(e) => {
                setCheckStartDate(e.target.checked);
              }}
              color="primary"
            />
          </td>
          <td>Start Date</td>
          <td>
            <TextField
              type="date"
              defaultValue={selectedStartDate.toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedStartDate(new Date(e.target.value));
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Checkbox
              checked={checkEndDate}
              onChange={(e) => {
                setCheckEndDate(e.target.checked);
              }}
              name="checkedB"
              color="primary"
            />
          </td>
          <td>End Date</td>
          <td>
            <TextField
              type="date"
              defaultValue={selectedEndDate.toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedEndDate(new Date(e.target.value));
              }}
            />
          </td>
        </tr>
      </table>

      <div style={{ height: 700, width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              return (
                <TableRow key={`row-${transaction.id}`}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>
                    {transaction.firstname} {transaction.lastname}
                  </TableCell>
                  <TableCell>{transaction.serviceName}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{dayjs(transaction.createdDate).format("DD/MM/YYYY H:mm")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="center mt-15">
          <Pagination
            count={pageCount}
            defaultPage={page}
            onChange={handlePageChange}
            size="large"
            showFirstButton
            showLastButton
            color="primary"
          />
        </div>
      </div>
    </>
  );
};

export default TransactionPage;
