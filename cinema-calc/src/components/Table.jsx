import React, { useState, useEffect } from 'react'
import "./Table.css"
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs"
import { Window } from './Window'
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import { usePDF } from 'react-to-pdf';  


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Table = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  // const [windowOpen, setWindowOpen] = useState(false);
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

  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getCalcData");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    // console.log("useEffect")
    fetchData();
  }, []);


  const handleAdd = async () => {
    setRows([...rows, row])
  };

  const deleteRow = async (id, name) => {
    console.log(id, name);
    
    if (window.confirm('Are you sure you want to delete this entry!!?')) {
      // Save it!
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
      // Do nothing!
      console.log('Thing was not deleted in the database.');
    }
  };

  // const editRow = async (id, name) => {
  //   console.log(id, name);
  //   setRowToEdit(id)
  //   setWindowOpen(true)
  // };

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

  // const handleSubmit = async (newRow) => {
  //   newRow.total = parseInt(newRow.price) + (parseInt(newRow.price) * parseInt(newRow.percentage) / 100);
  //   console.log("New Row total:", newRow.total)
  //   if (rowToEdit === null) {
  //     setRows([...rows, newRow])
  //     try {
  //       const response = await axios.post("http://localhost:8080/addCalcItems", newRow);
  //       console.log("Row created:", response.data);
  //     } catch (error) {
  //       console.error("Error creating post:", error);
  //     }
  //   } else {
  //     setRows(
  //       rows.map((currRow, idx) => {
  //         if (idx !== rowToEdit) return currRow;

  //         return newRow;
  //       })
  //     );
  //     try {
  //       const response = await axios.post("http://localhost:8080/updateCalcItem/" + newRow.name, newRow);
  //       console.log("Row Updated:", response.data);
  //     } catch (error) {
  //       console.error("Error creating post:", error);
  //     }

  //   }

  //   // rowToEdit === null
  //   //   ? setRows([...rows, newRow])
  //   //   : setRows(
  //   //     rows.map((currRow, idx) => {
  //   //       if (idx !== rowToEdit) return currRow;

  //   //       return newRow;
  //   //     })
  //   //   );

  // };

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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  return (
    <div ref={targetRef}>
      <button className='gradButton' onClick={() => handleAdd()}>Add New Item</button>
      {/* <Button variant="contained" onClick={() => handleAdd()} disableElevation>
      Add New Item    </Button> */}
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
                      {/* <BsFillPencilFill
                        className="edit-btn"
                        onClick={() => editRow(id, row.name)}
                      /> */}
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
