import React from 'react';

function DeleteAllModal(props) {

  return (
    <div className="modal">
        <div className="modal-overlay"></div>
        <div className="modal-container delete-alert">
          <h4 className="danger-alert">Danger!!</h4>
          <p>This will delete all your stopwatches!</p>
            <div className="modal-buttons">
                <button className="button" onClick={props.closeModal}>Cancel</button>
                <button className="button go-ahead"  onClick={props.deleteAll}>Go Ahead</button>
            </div>
        </div>
    </div>
  );
}

export default DeleteAllModal;