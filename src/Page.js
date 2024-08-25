import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSelectChange = (event) => {
        const options = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedOptions(options);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Parse and validate JSON
            const jsonData = JSON.parse(inputValue);
            if (!jsonData || !Array.isArray(jsonData.data)) {
                throw new Error("Invalid JSON structure");
            }

            // Call the REST API
            const response = await axios.post('http://localhost:4000/bfhl', jsonData);
            setResponseData(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setResponseData(null);
        }
    };

    const renderResponse = () => {
        if (!responseData) return null;

        const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
        const selectedData = {};

        if (selectedOptions.includes('Numbers')) {
            selectedData.numbers = numbers;
        }
        if (selectedOptions.includes('Alphabets')) {
            selectedData.alphabets = alphabets;
        }
        if (selectedOptions.includes('Highest lowercase alphabet')) {
            selectedData.highest_lowercase_alphabet = highest_lowercase_alphabet;
        }

        return (
            <div>
                <h2>Filtered Response:</h2>
                <pre>{JSON.stringify(selectedData, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div>
            <h1>Your Roll Number</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Input JSON:
                    <textarea
                        rows="6"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder='{ "data": ["A", "C", "z"] }'
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            {error && (
                <div style={{ color: 'red' }}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
            {responseData && (
                <div>
                    <label>
                        Select Options:
                        <select multiple={true} onChange={handleSelectChange}>
                            <option value="Alphabets">Alphabets</option>
                            <option value="Numbers">Numbers</option>
                            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
                        </select>
                    </label>
                    {renderResponse()}
                </div>
            )}
        </div>
    );
};

export default Page;