import { useState, useEffect } from 'react';
import { Table, Checkbox, Button, Input } from 'antd';

const TableRenderer = () => {
  // State for fetched data
  const [data, setData] = useState([]);
  // State for columns
  const [columns, setColumns] = useState([]);
  // State for selected columns
  const [selectedColumns, setSelectedColumns] = useState([]);
  // State for filtered data
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setData(data);
      if (data.length > 0) {
        // Extract column names from the first object
        const firstObject = data[0];
        const keys = Object.keys(firstObject);
        setColumns(keys);
        // Initially select all columns
        setSelectedColumns(keys);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleColumnSelection = (selectedColumns) => {
    setSelectedColumns(selectedColumns);
  };

  const handleTableSubmit = () => {
    // Filter data to only include selected columns
    setFilteredData(data.map(item =>
      Object.fromEntries(selectedColumns.map(column => [column, item[column]]))
    ));
  };

  const handleSearch = (value) => {
    const filteredData = data.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const columnsSelection = columns.map(column => (
    <Checkbox key={column} value={column}>
      {column}
    </Checkbox>
  ));

  return (
    <div>
      <Checkbox.Group style={{ marginBottom: '1rem' }} value={selectedColumns} onChange={handleColumnSelection}>
        {columnsSelection}
      </Checkbox.Group>
      <Button type="primary" onClick={handleTableSubmit}>
        Submit
      </Button>
      <Input.Search
        placeholder="Search..."
        onSearch={handleSearch}
        style={{ width: 200, marginLeft: '1rem', marginBottom: '1rem' }}
      />
      <Table dataSource={filteredData} columns={selectedColumns.map(column => ({ title: column, dataIndex: column, key: column }))} />
    </div>
  );
};

export default TableRenderer;
