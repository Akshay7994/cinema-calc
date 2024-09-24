import React, { useState, useEffect } from 'react'
import "./Table.css"
import { BsFillTrashFill } from "react-icons/bs"
import axios from 'axios';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as XLSX from 'xlsx';
import { usePDF } from 'react-to-pdf';  


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Table = () => {
  const [rows, setRows] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});  

  const row = {
    name: "",
    price: "",
    percentage: "",
    total: ""
  }

  var grossTotal = 0;

  // Get Data on load
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getCalcData");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // getData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Add Item
  const handleAdd = async () => {
    setRows([...rows, row])
  };

  // Delete Row
  const deleteRow = async (id, name) => {
    // Confirmation 
    if (window.confirm('Are you sure you want to delete this entry!!?')) {
      console.log('This was deleted in the database.');
      setRows(rows.filter((_, idx) => idx !== id));
      try {
        const response = await axios.delete("http://localhost:8080/deleteCalcItem/" + name);
        console.log("Row Deleted:", response.data);
        setAlert({ open: true, message: 'Row deleted successfully!', severity: 'success' });
      } catch (error) {
        console.error("Error creating post:", error);
        setAlert({ open: true, message: 'Failed to Delete the Row!', severity: 'error' });
      }
    } else {
      console.log('Thing was not deleted in the database.');
    }
  };

  // API call to add and update data
  const submitData = async (newRow) => {
    if(newRow.name !== "" && newRow.price !== "" && newRow.percentage !== ""){
      console.log("Sent: ",newRow)
      try {
        const response = await axios.post("http://localhost:8080/addCalcItems", newRow);
        console.log("Row created:", response.data);
        // Show success alert
      setAlert({ open: true, message: 'Data submitted successfully!', severity: 'success' });
      } catch (error) {
        console.error("Error creating post:", error);
        setAlert({ open: true, message: 'Error submitting data', severity: 'error' });
      }
    }
  }

  // Handling Input 
  const onChangeInput = (e, id) => {
    const { name, value } = e.target
    console.log(id, name, value)
    const updatedRows = rows.map((item, i) => {
      if (i === id) {
        const updatedItem = { ...item, [name]: value.trim() };
        const price = parseFloat(updatedItem.price) || 0;
        const percentage = parseFloat(updatedItem.percentage) || 0;

        const total = price + (price * percentage) / 100;
        return { ...updatedItem, total: total};
      }
      return item;
    });
    
    setRows(updatedRows)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      submitData(updatedRows[id]);
    }, 1000); 

    setDebounceTimeout(timeout);
  }

  // Close Alert
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  // Export Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  return (
    <div ref={targetRef}>
      <button className='gradButton' onClick={() => handleAdd()}>Add New Item</button>
      <Card className='card-rad'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Percentage</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, id) => {
              grossTotal = grossTotal + (parseInt(row.price) + parseInt((row.price * row.percentage) / 100))
              return (
                <tr key={id}>
                  <td><TextField
                    id="outlined-basic"
                    name="name"
                    label="Name"
                    value={row.name}
                    fullWidth
                    onChange={(e) => onChangeInput(e, id)}
                    variant="outlined" />
                  </td>
                  <td><TextField
                    id="outlined-basic"
                    name="price"
                    label="Price"
                    type='number' 
                    fullWidth
                    value={row.price}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                      },
                    }}
                    onChange={(e) => onChangeInput(e, id)}
                    variant="outlined" />
                  </td>
                  <td>
                    <TextField
                      id="outlined-basic"
                      name="percentage"
                      label="Percentage"
                      type='number' 
                      fullWidth
                      value={row.percentage}
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        },
                      }}
                      onChange={(e) => onChangeInput(e, id)}
                      variant="outlined" />
                  </td>
                  <td>
                    <TextField
                      id="outlined-basic"
                      name="total"
                      label="Total"
                      fullWidth
                      value={row.total}
                      slotProps={{
                        input: {
                          readOnly: true,
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        },
                      }}

                      variant="outlined" />
                  </td>
                  <td className="fit" >
                    <span className="actions">
                      <BsFillTrashFill
                        className="delete-btn"
                        onClick={() => deleteRow(id, row.name)}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot >
            <tr>
              <th className='footbg'></th>
              <th className='footbg'></th>
              <th className='footbg foot'>Gross Total:</th>
              <th className='footbg'>{grossTotal}€</th>
              <th className='footbg'></th>
            </tr>
          </tfoot>
        </table>
      </Card>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>

      </Snackbar>
      <button className='xls-btn' onClick={() => downloadExcel()}></button>
      <button className='pdf-btn' onClick={() =>  toPDF()}></button>

     
    </div>
  )
}
