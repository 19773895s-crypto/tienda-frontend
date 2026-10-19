import React, { useState, useEffect } from 'react';
import { api } from '../api';

function FormularioVenta({ onVentaRegistrada }) {
  const [formData, setFormData] = useState({
    vendedor_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
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
        setFormData({ vendedor_id: '', producto_id: '', cantidad: '', fecha: '' });
        onVentaRegistrada(); // avisa a App para que la tabla se actualice
      })
      .catch(err => {
        console.error('Error al registrar venta:', err);
        alert('No se pudo registrar la venta');
      });
  };

  return (
    <div>
      <h2>Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit}>
        <select name="vendedor_id" value={formData.vendedor_id}
                onChange={handleChange} required>
          <option value="">Seleccione vendedor</option>
          {vendedores.map(v => (
            <option key={v.id} value={v.id}>
              {v.nombre} - {v.sucursal}
            </option>
          ))}
        </select>

        <select name="producto_id" value={formData.producto_id}
                onChange={handleChange} required>
          <option value="">Seleccione producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} - ${p.precio}
            </option>
          ))}
        </select>

        <input type="number" name="cantidad" placeholder="Cantidad"
               min="1" value={formData.cantidad}
               onChange={handleChange} required />

        <input type="date" name="fecha" value={formData.fecha}
               onChange={handleChange} required />

        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
}

export default FormularioVenta;
