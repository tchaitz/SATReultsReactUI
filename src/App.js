import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const BACKEND_URL = "http://localhost:8080";
  const [selectedOption, setSelectedOption] = useState('');



  const InsertData = () => {
    const initialFormData = {
      name: '',
      address: {
        address_line1: '',
        city: '',
        country: '',
        pincode: '',
      },

      satScore: {
        score: ''
      },
    }
    const [formData, setFormData] = useState(initialFormData);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleAddressChange = (e) => {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [e.target.name]: e.target.value
        }
      });
      console.log(formData)
    };
    const handleScoreChange = (e) => {
      setFormData({
        ...formData, satScore: {
          ...formData.satScore,
          [e.target.name]: e.target.value
        }
      });
      console.log(formData)
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // Make a POST request to the backend to insert data
        const response = await axios.post(BACKEND_URL + '/save-results', formData);
        console.log(response.data); // Assuming backend returns a success message
        setSuccessMessage('Data inserted successfully!');
      } catch (error) {
        console.error('Error inserting data:', error);
        setSuccessMessage('');
      }
      setFormData(initialFormData);
    };

    return (
      <div className="insert-data-container">
        <h2>Insert Data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <br />

          <label>
            Address:
            <input type="text" name="address_line1" value={formData.address.address_line1} onChange={handleAddressChange} />
          </label>
          <br />

          <label>
            City:
            <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
          </label>
          <br />

          <label>
            Country:
            <input type="text" name="country" value={formData.address.country} onChange={handleAddressChange} />
          </label>
          <br />

          <label>
            Pincode:
            <input type="text" name="pincode" value={formData.address.pincode} onChange={handleAddressChange} />
          </label>
          <br />

          <label>
            SAT Score:
            <input type="text" name="score" value={formData.satScore.score} onChange={handleScoreChange} />
          </label>
          <br />

          <button type="submit">Submit</button>
        </form>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    );
  };
  // Component for Viewing All Data
  const ViewData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Make a GET request to the backend to fetch all data
          const response = await axios.get(BACKEND_URL + '/results');
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Automatically fetch data when the component mounts
    }, []); // Empty dependency array ensures this runs once on mount

    return (
      <div className="view-data-container">
        <h2>View All Data</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  // Component for Getting Rank
  const GetRank = () => {
    const [name, setName] = useState('');
    const [rank, setRank] = useState(null);

    const handleGetRank = async (name) => {
      try {
        // Make a GET request to the backend to get rank by name
        const response = await axios.get(`${BACKEND_URL}/results/${name}`);
        console.log(response)
        setRank(response.data);
      } catch (error) {
        console.error('Error getting rank:', error);
      }
    };

    return (
      <div className="get-rank-container">
        <h2>Get Rank</h2>
        <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => handleGetRank(name)}>Get Rank</button>
        {rank !== null ? <p > Rank: {rank}</p> : <p>No rank available</p>}
      </div>
    );
  };

  // Component for Updating Score
  const UpdateScore = () => {
    const [name, setName] = useState('');
    const [newScore, setNewScore] = useState(0);
    const [updateMessage, setUpdateMessage] = useState('');
    const handleUpdateScore = async (name) => {
      try {
        // Make a PUT request to the backend to update the score by name
        await axios.put(`${BACKEND_URL}/results/${name}`, { score: newScore });
        setUpdateMessage('Score updated successfully!');
      } catch (error) {
        console.error('Error updating score:', error);
        setUpdateMessage('');
      }
      // Reset input fields after update
      setName('');
      setNewScore(0);
    };

    return (
      <div className='update-score-container'>
        <h2>Update Score</h2>
        <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Enter new score" value={newScore} onChange={(e) => setNewScore(e.target.value)} />
        <button onClick={() => handleUpdateScore(name)}>Update Score</button>
        {updateMessage && <p style={{ color: 'green' }}>{updateMessage}</p>}
      </div>
    );
  };

  // Component for Deleting Record
  const DeleteRecord = () => {
    const [name, setName] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const handleDeleteRecord = async (name) => {
      try {
        // Make a DELETE request to the backend to delete a record by name
        const response = await axios.delete(`${BACKEND_URL}/results/${name}`);
        setDeleteMessage("Deleted record succcessfully")
      } catch (error) {
        console.error('Error deleting record:', error);
        setDeleteMessage("")
      }
      setName('')
    };

    return (
      <div className="delete-record-container">
        <h2>Delete Record</h2>
        <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => handleDeleteRecord(name)}>Delete Record</button>
        {deleteMessage && <p style={{ color: 'green' }}>{deleteMessage}</p>}
      </div>
    );
  };
  const renderComponent = () => {
    switch (selectedOption) {
      case 'insertData':
        return <InsertData />;
      case 'viewData':
        return <ViewData />;
      case 'getRank':
        return <GetRank />;
      case 'updateScore':
        return <UpdateScore />;
      case 'deleteRecord':
        return <DeleteRecord />;
      default:
        return null;
    }
  };

  // Example usage of components in your main App component

  return (
    <div className='container'>
      <h2>Select an Option</h2>
      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="">Select an option</option>
        <option value="insertData">Insert Data</option>
        <option value="viewData">View All Data</option>
        <option value="getRank">Get Rank</option>
        <option value="updateScore">Update Score</option>
        <option value="deleteRecord">Delete Record</option>
      </select>

      {renderComponent()}
    </div>
  );


}

export default App;
