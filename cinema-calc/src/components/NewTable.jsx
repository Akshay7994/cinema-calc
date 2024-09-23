import React, { useState, useEffect } from 'react'
import "./Table.css"
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs"
import { Window } from './Window'
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';



export const Table = () => {
  const [rowToEdit, setRowToEdit] = useState(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const row = {
    name: "",
    price : "",
    percentage: "",
    total :""
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


  const handleAdd = async()=>{
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
      } catch (error) {
        console.error("Error creating post:", error);
      }
    } else {
      // Do nothing!
      console.log('Thing was not deleted in the database.');
    }
  };

  const editRow = async (id, name) => {
    console.log(id, name);
    setRowToEdit(id)
    setWindowOpen(true)
  };

  const handleSubmit = async (newRow) => {
    newRow.total = parseInt(newRow.price) + (parseInt(newRow.price) * parseInt(newRow.percentage)/100); 
    console.log("New Row total:", newRow.total)
    if (rowToEdit === null) {
      setRows([...rows, newRow])
      try {
        const response = await axios.post("http://localhost:8080/addCalcItems", newRow);
        console.log("Row created:", response.data);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    } else {
      setRows(
        rows.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;

          return newRow;
        })
      );
      try {
        const response = await axios.post("http://localhost:8080/updateCalcItem/"+newRow.name, newRow);
        console.log("Row Updated:", response.data);
      } catch (error) {
        console.error("Error creating post:", error);
      }

    }

    // rowToEdit === null
    //   ? setRows([...rows, newRow])
    //   : setRows(
    //     rows.map((currRow, idx) => {
    //       if (idx !== rowToEdit) return currRow;

    //       return newRow;
    //     })
    //   );

  };


  return (
    <div>
      <button className='gradButton' onClick={() => handleAdd()}>Add New Item</button>
      {windowOpen && (
        <Window
          closeWindow={() => {
            setWindowOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && rows[rowToEdit]}
        />
      )}
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
                <td name="Name"><TextField id="outlined-basic" label="Name" variant="outlined"></TextField></td>
                <td name="Price"><TextField id="outlined-basic" label="Price" variant="outlined"/>€</td>
                <td name="Percentage">
                <TextField id="outlined-basic" label="Percentage" variant="outlined"/>%
                </td>
                <td name="Total">
                <TextField id="outlined-basic" label="Total" variant="outlined"/>€
                </td>
                <td className="fit" >
                  <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => deleteRow(id, row.name)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editRow(id, row.name)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th></th>
            <th className='foot'>Gross Total:</th>
            <th>{grossTotal}€</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
      </Card>
    </div>
  )
}
