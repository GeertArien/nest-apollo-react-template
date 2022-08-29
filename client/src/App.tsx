import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './App.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';

const GET_CATS = gql`
  query GetCats {
    cats {
      id
      name
      age
      owner {
        name
      }
    }
  }
`;

const ADD_CAT = gql`
  mutation CreateCat($input: CreateCatInput!) {
    createCat(createCatInput: $input) {
      id
      name
    }
  }
`;

function DisplayCats() {
  const { loading, error, data } = useQuery(GET_CATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: ${error.message}</p>;

  return (
  <TableContainer component={Paper} variant="outlined" >
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Age</TableCell>
            <TableCell align="right">Owner</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.cats.map(({ id, name, age, owner }: { id: number; name: string; age: number; owner: { name: string } }) => (
            <TableRow
              key={id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {id}
              </TableCell>
              <TableCell align="left">{name}</TableCell>
              <TableCell align="center">{age}</TableCell>
              <TableCell align="right">{owner?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AddCat() {
  const  [inputs, setInputs] = useState<{name: string; age: string}>({ name: '', age: '' });

  const [addCat, { data, loading, error }] = useMutation(ADD_CAT, {
    refetchQueries: [
      {query: GET_CATS}, // DocumentNode object parsed with gql
      'GetCats' // Query name
    ],
  });

  if (loading) return <p>'Submitting...'</p>;
  if (error) return <p>`Submission error! ${error.message}`</p>;

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    addCat({ variables: { input: { name: inputs.name, age: Number(inputs.age) } } });
    inputs.name = '';
    inputs.age = '';
  }

  return (
    <div>
      <form onSubmit={handleSubmit} >
        <Grid container spacing={4}>
          <Grid xs={8}>
            <TextField fullWidth id="input-name" label="Name" variant="standard" value={inputs.name || ""} 
              name="name" onChange={handleChange} />
          </Grid>
          <Grid xs={4}>
            <TextField fullWidth id="input-age" label="Age" variant="standard" type="number" value={inputs.age || ""} 
              name="age" onChange={handleChange} />
          </Grid>
          <Grid>
            <Button variant="contained" type="submit"  size="large">
              Add Cat
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

function App() {
  return (
    <div className='App'>
      <h2>Cats template</h2>
      <br/>
      <DisplayCats />
      <br/>
      <AddCat />
    </div>
  );
}

export default App;
