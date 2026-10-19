import React, { useEffect, useState } from 'react';
import { api } from '../api';
import EditarVenta from './EditarVenta';

// Convierte 549.99 en $549.99
const dinero = (n) =>
  Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function ListaVentas({ recarga }) {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const cargarVentas = () => {
    api.get('/ventas')
      .then(res => {
        setVentas(res.data);
        setError(false);
      })
      .catch(err => {
        console.error('Error al obtener ventas:', err);
        setError(true);
      })
      .finally(() => setCargando(false));
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
          // si se eliminó la venta que se estaba editando, cierra la ventana
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

  const totalVendido = ventas.reduce((suma, v) => suma + Number(v.total), 0);
  const unidades = ventas.reduce((suma, v) => suma + Number(v.cantidad), 0);

  return (
    <section>
      <div className="resumen">
        <div className="etiqueta">
          <small>Total vendido</small>
          <strong>{dinero(totalVendido)}</strong>
        </div>
        <div className="dato">
          <small>Ventas registradas</small>
          <strong>{ventas.length}</strong>
        </div>
        <div className="dato">
          <small>Unidades vendidas</small>
          <strong>{unidades}</strong>
        </div>
      </div>

      <div className="tabla-tarjeta">
        <div className="tabla-cabecera">
          <h2>Ventas de la tienda</h2>
        </div>

        {cargando ? (
          <p className="mensaje">
            Conectando con el servidor… la primera carga puede tardar hasta un minuto.
          </p>
        ) : error ? (
          <p className="mensaje error">
            No se pudieron cargar las ventas. Revisa que el servidor esté encendido y recarga la página.
          </p>
        ) : ventas.length === 0 ? (
          <p className="mensaje">Aún no hay ventas. Registra la primera con el formulario.</p>
        ) : (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Producto</th>
                  <th className="num">Cant.</th>
                  <th className="num">Precio</th>
                  <th className="num">Total</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ventas.map(v => (
                  <tr key={v.id}>
                    <td className="vendedor">{v.vendedor}</td>
                    <td>{v.producto}</td>
                    <td className="num"><span className="cantidad">{v.cantidad}</span></td>
                    <td className="num">{dinero(v.precio)}</td>
                    <td className="num total">{dinero(v.total)}</td>
                    <td>{formatearFecha(v.fecha)}</td>
                    <td>
                      <div className="acciones">
                        <button className="btn btn-editar" onClick={() => setVentaSeleccionada(v)}>Editar</button>
                        <button className="btn btn-eliminar" onClick={() => eliminarVenta(v.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ventaSeleccionada && (
        <div className="modal-fondo" onClick={() => setVentaSeleccionada(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <EditarVenta
              key={ventaSeleccionada.id}
              venta={ventaSeleccionada}
              onUpdate={() => {
                cargarVentas();
                setVentaSeleccionada(null); // cierra la ventana al terminar
              }}
            />
            <button className="btn btn-secundario" onClick={() => setVentaSeleccionada(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ListaVentas;
