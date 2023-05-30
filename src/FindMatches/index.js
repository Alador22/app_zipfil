import React from 'react'
import "./style.css";
const FindMatches = () => {
  return (
    <div className="FindMatches-body">
    <div>
      <h1>Find Matches</h1>
      <form>
        <label>Select skill level:</label>
        <select>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button>Find matches</button>
      </form>
      <div>
        <h2>Available matches:</h2>
        <ul>
          <li>Torjus (Intermediate)</li>
          <li>Alador (Advanced)</li>
          <li>Perry (Beginner)</li>
          <li>Abdi (Intermediate)</li>
          <li>Jorgen (Advanced)</li>
          <li>Preben (Beginner)</li>
        </ul>
      </div>
    </div>
    </div>
  
  )
}

export default FindMatches