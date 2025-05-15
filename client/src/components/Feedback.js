import React, { useState } from 'react';

function Feedback() {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // TODO: POST feedback to backend
    console.log('Feedback submitted:', message);
    setMessage('');
  };

  return (
    <div className="feedback-section">
      <h3>Feedback</h3>
      <textarea
        placeholder="Your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Feedback;
