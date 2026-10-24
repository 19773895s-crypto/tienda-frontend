import React, { useState } from 'react';
import './tienda.css';
import Tienda from './components/Tienda';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';

function App() {
  const [vista, setVista] = useState('tienda');
  // Cada vez que se registra una venta, este número sube y la tabla se vuelve a cargar
  const [recarga, setRecarga] = useState(0);

  return (
    <div>
      <header className="encabezado">
        <div className="encabezado-contenido">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
            </svg>
          </div>
          <div>
            <h1>TecnoStore</h1>
            <p>Tecnología al mejor precio</p>
          </div>
          <nav className="nav">
            <button className={vista === 'tienda' ? 'activo' : ''} onClick={() => setVista('tienda')}>Tienda</button>
            <button className={vista === 'panel' ? 'activo' : ''} onClick={() => setVista('panel')}>Panel de ventas</button>
          </nav>
        </div>
      </header>

      {vista === 'tienda' ? (
        <Tienda />
      ) : (
        <main className="contenedor">
          <FormularioVenta onVentaRegistrada={() => setRecarga(recarga + 1)} />
          <ListaVentas recarga={recarga} />
        </main>
      )}

      <footer className="pie">TecnoStore · Proyecto de Desarrollo de Software</footer>
    </div>
  );
}

export default App;
