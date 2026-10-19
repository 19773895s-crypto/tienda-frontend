import React, { useState, useEffect } from 'react';
import { api } from '../api';

// Fecha de hoy en formato AAAA-MM-DD (hora local)
const hoy = () => new Date().toLocaleDateString('en-CA');

function FormularioVenta({ onVentaRegistrada }) {
  const [formData, setFormData] = useState({
    vendedor_id: '',
    producto_id: '',
    cantidad: '',
    fecha: hoy()
  });

  const [vendedores, setVendedores] = useState([]);
  const [productos, setProductos] = useState([]);

  // Cargar listas de vendedores y productos al iniciar
  useEffect(() => {
    api.get('/vendedores')
      .then(res => setVendedores(res.data))
      .catch(err => console.error('Error al obtener vendedores:', err));

    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/ventas', formData)
      .then(res => {
        alert(res.data.message);
        setFormData({ vendedor_id: '', producto_id: '', cantidad: '', fecha: hoy() });
        onVentaRegistrada(); // avisa a App para que la tabla se actualice
      })
      .catch(err => {
        console.error('Error al registrar venta:', err);
        alert('No se pudo registrar la venta');
      });
  };

  return (
    <aside className="formulario-tarjeta">
      <h2>Registrar venta</h2>
      <p className="ayuda">Elige quién vendió, qué producto y cuántas unidades.</p>

      <form className="formulario" onSubmit={handleSubmit}>
        <label className="campo">
          Vendedor
          <select name="vendedor_id" value={formData.vendedor_id}
                  onChange={handleChange} required>
            <option value="">Selecciona un vendedor</option>
            {vendedores.map(v => (
              <option key={v.id} value={v.id}>
                {v.nombre} - {v.sucursal}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          Producto
          <select name="producto_id" value={formData.producto_id}
                  onChange={handleChange} required>
            <option value="">Selecciona un producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} - ${p.precio}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          Cantidad
          <input type="number" name="cantidad" placeholder="Ej. 2" min="1"
                 value={formData.cantidad} onChange={handleChange} required />
        </label>

        <label className="campo">
          Fecha
          <input type="date" name="fecha" value={formData.fecha}
                 onChange={handleChange} required />
        </label>

        <button className="btn btn-primario" type="submit">Registrar venta</button>
      </form>
    </aside>
  );
}

export default FormularioVenta;
