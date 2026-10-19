import React, { useEffect, useState } from 'react';
import { api } from '../api';
import EditarVenta from './EditarVenta';

function ListaVentas({ recarga }) {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const cargarVentas = () => {
    api.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al obtener ventas:', err));
  };

  // Se ejecuta al iniciar y cada vez que se registra una venta nueva (recarga)
  useEffect(() => {
    cargarVentas();
  }, [recarga]);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      api.delete(`/ventas/${id}`)
        .then(res => {
          alert(res.data.message);
          // si se eliminó la venta que se estaba editando, cierra el formulario
          if (ventaSeleccionada && ventaSeleccionada.id === id) {
            setVentaSeleccionada(null);
          }
          cargarVentas(); // refrescar lista
        })
        .catch(err => {
          console.error('Error al eliminar venta:', err);
          alert('No se pudo eliminar la venta');
        });
    }
  };

  // Pasa de 2026-10-01 a 01/10/2026 para mostrarla en la tabla
  const formatearFecha = (fecha) => fecha.split('-').reverse().join('/');

  return (
    <div>
      <h2>Ventas de la Tienda de Electrónicos</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.vendedor}</td>
              <td>{v.producto}</td>
              <td>{v.cantidad}</td>
              <td>${v.precio}</td>
              <td>${v.total}</td>
              <td>{formatearFecha(v.fecha)}</td>
              <td>
                <button onClick={() => setVentaSeleccionada(v)}>Editar</button>
                <button onClick={() => eliminarVenta(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaSeleccionada && (
        <div>
          <EditarVenta
            key={ventaSeleccionada.id}
            venta={ventaSeleccionada}
            onUpdate={() => {
              cargarVentas();
              setVentaSeleccionada(null); // cierra el formulario al terminar
            }}
          />
          <button onClick={() => setVentaSeleccionada(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default ListaVentas;
