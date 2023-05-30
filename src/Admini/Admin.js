

  
     

  

  return (
    <div className="Profilside-body">
        <div className="profil-container">
        <div>
          <label>
            Epost:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button onClick={handleAdminChange}>Gi admin rettigheter</button>
        </div>
        <div>
          <button onClick={handleDeleteKonto}>Slett konto</button>
        </div>
        </div>
      </div>
    
  );

