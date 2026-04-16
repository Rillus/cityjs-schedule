import React from 'react';
import './HidePastActsToggle.scss';

const HidePastActsToggle = ({ hidePastActs, onToggle }) => {
  return (
    <button 
      className={`HidePastActsToggle ${hidePastActs ? 'HidePastActsToggle--active' : ''}`}
      onClick={onToggle}
      title={hidePastActs ? 'Currently hiding past sessions. Click to show all.' : 'Currently showing all sessions. Click to hide past ones.'}
    >
      <span className="HidePastActsToggle-icon">
        {hidePastActs ? '🙈' : '👁️'}
      </span>
      <span className="HidePastActsToggle-text">
        {hidePastActs ? 'Past hidden' : 'Past shown'}
      </span>
    </button>
  );
};

export default HidePastActsToggle; 