

  
     

  // Jørgen, laget en kort og grei side hvor det er 2 knapper 1 som skal gi Admin rettigheter
  // og en som skal slette konto.
  // Brukte ChatBot til å generere EventHandlers derfor er de ikke med.

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

