import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard({ usn }) {
  const [shops] = useState([1, 2, 3, 4, 5]);
  const [selectedShop, setSelectedShop] = useState(1);
  const [queue, setQueue] = useState([]);
  const [fileName, setFileName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, [selectedShop]);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/queue/${selectedShop}`);
      setQueue(res.data);

      // Calculate total estimated time for pending jobs
      const totalTime = res.data
        .filter(job => job.status === 'pending')
        .reduce((acc, job) => acc + (job.estimated_time || 0), 0);
      setEstimatedTime(totalTime);
    } catch (err) {
      setError('Failed to load queue.');
      setQueue([]);
      setEstimatedTime(0);
    }
  };

  const submitPrintJob = async () => {
    if (!fileName.trim()) {
      alert('Please enter the file name');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/print/submit', {
        filename: fileName.trim(),
        usn: usn,
        shop_number: selectedShop,
      });

      if (response.status === 200) {
        alert('Print job submitted successfully');
        setFileName('');
        fetchQueue();
      } else {
        alert('Failed to submit print job');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit print job');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>

      <label>
        Select Stationery Shop:
        <select
          value={selectedShop}
          onChange={e => setSelectedShop(parseInt(e.target.value))}
        >
          {shops.map(shop => (
            <option key={shop} value={shop}>
              Shop {shop}
            </option>
          ))}
        </select>
      </label>

      <h3>Current Queue at Shop {selectedShop}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul className="queue-list">
        {queue.length === 0 && <li>No jobs in queue.</li>}
        {queue.map(job => (
          <li key={job.id} className={job.status === 'done' ? 'done' : ''}>
            {job.filename || job.file_name} — Status: {job.status} — Est. Time: {job.estimated_time || 0} mins
          </li>
        ))}
      </ul>

      <h3>Submit Print Job</h3>
      <input
        type="text"
        placeholder="Enter file name (no upload)"
        value={fileName}
        onChange={e => setFileName(e.target.value)}
      />
      <button onClick={submitPrintJob}>Submit</button>

      <p>
        Estimated time to print if submitted now: <strong>{estimatedTime} mins</strong>
      </p>
    </div>
  );
}

export default StudentDashboard;
