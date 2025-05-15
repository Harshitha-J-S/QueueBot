import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VendorDashboard({ shopNumber }) {
  const [queue, setQueue] = useState([]);
  const [timeUpdates, setTimeUpdates] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/queue/${shopNumber}`);
      setQueue(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load queue');
      setQueue([]);
    }
  };

  const updateTime = async (id) => {
    const time = parseInt(timeUpdates[id]);
    if (!time || time <= 0) {
      alert('Please enter a valid positive number for time.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/vendor/update-time', { id, estimated_time: time });
      fetchQueue();
    } catch {
      alert('Failed to update time');
    }
  };

  const markDone = async (id) => {
    try {
      await axios.post('http://localhost:5000/api/vendor/mark-done', { id });
      fetchQueue();
    } catch {
      alert('Failed to mark job as done');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.post('http://localhost:5000/api/vendor/delete', { id });
      fetchQueue();
    } catch {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Vendor Dashboard - Shop {shopNumber}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Print Queue</h3>
      {queue.length === 0 && <p>No print jobs currently.</p>}
      <ul className="queue-list">
        {queue.map((job) => (
          <li key={job.id} className={job.status === 'done' ? 'done' : ''}>
            <div>
              <strong>{job.file_name}</strong> by <em>{job.student_usn}</em> — Status: {job.status} — Est. Time: {job.estimated_time} mins
            </div>
            {job.status === 'pending' && (
              <div className="actions">
                <input
                  type="number"
                  min="1"
                  placeholder="Update time (mins)"
                  value={timeUpdates[job.id] || ''}
                  onChange={e => setTimeUpdates({ ...timeUpdates, [job.id]: e.target.value })}
                />
                <button onClick={() => updateTime(job.id)}>Update Time</button>
                <button onClick={() => markDone(job.id)}>Mark Done</button>
                <button onClick={() => deleteJob(job.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VendorDashboard;
