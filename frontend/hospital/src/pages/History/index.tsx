import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { TitleContext } from "../../App";
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import { HistoryTransaction } from "../../types";

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.any.isRequired,
   value: PropTypes.any.isRequired,
};

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const LogHistory = observer(() => {
    const { setTitle } = useContext(TitleContext);
    const [value, setValue] = useState(0);
    const [debit, setDebit] = useState<HistoryTransaction[]>([]);
    const [credit, setCredit] = useState<HistoryTransaction[]>([]);
    const [open, setOpen] = useState(0);
    const [use, setUse] = useState<HistoryTransaction[]>([]);

    const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
        setValue(newValue);
      };
    
	useEffect(() => {
		setTitle('History');
	}, [setTitle]);

    useEffect(() => {
        axios.post('/transaction​/search​/group-by-service', {
            "page": 0,
            "pageSize": 0,
            "type": "Debit"
        }).then(({ data }) => setDebit(data));
    },[]);

    useEffect(() => {
        axios.post('/transaction​/search​/group-by-service', {
            "page": 0,
            "pageSize": 0,
            "type": "Credit"
        }).then(({ data }) => setCredit(data));
    },[]);

    function body(){
        if( open == 1 ){
            setUse(debit);
        }
        else{
            setUse(credit);
        }
        return(
            <>
                <div style={{ height: 700, width: '100%' }}>
                    <Table className="table-pin">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {use.map((u) => {
                                return (
                                    <TableRow>
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.date}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </>
        )
    };

    return(
        <>
            <h1>History</h1>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
                <Tab label="Recieve History" {...a11yProps(0)} />
                <Tab label="Withdrawn History" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                {body}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {body}
            </TabPanel>
        </>
    )
});

export default LogHistory;