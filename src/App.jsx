import React, { useState } from 'react';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';

function App() {
  // Cada vez que se registra una venta, este número sube y la tabla se vuelve a cargar
  const [recarga, setRecarga] = useState(0);

  return (
    <div>
      <h1>Tienda de Electrónicos</h1>
      <FormularioVenta onVentaRegistrada={() => setRecarga(recarga + 1)} />
      <ListaVentas recarga={recarga} />
    </div>
  );
}

export default App;
