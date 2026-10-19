import React, { useState, useEffect } from 'react';
import { api } from '../api';

function EditarVenta({ venta, onUpdate }) {
  const [formData, setFormData] = useState({
    vendedor_id: venta.vendedor_id,
    producto_id: venta.producto_id,
    cantidad: venta.cantidad,
    fecha: venta.fecha
  });

  const [vendedores, setVendedores] = useState([]);
  const [productos, setProductos] = useState([]);

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
    api.put(`/ventas/${venta.id}`, formData)
      .then(res => {
        alert(res.data.message);
        onUpdate(); // refresca la lista de ventas
      })
      .catch(err => {
        console.error('Error al actualizar venta:', err);
        alert('No se pudo actualizar la venta');
      });
  };

  return (
    <div>
      <h3>Editar venta #{venta.id}</h3>
      <form onSubmit={handleSubmit}>
        <select name="vendedor_id" value={formData.vendedor_id}
                onChange={handleChange} required>
          {vendedores.map(v => (
            <option key={v.id} value={v.id}>
              {v.nombre} - {v.sucursal}
            </option>
          ))}
        </select>

        <select name="producto_id" value={formData.producto_id}
                onChange={handleChange} required>
          {productos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} - ${p.precio}
            </option>
          ))}
        </select>

        <input type="number" name="cantidad" min="1"
               value={formData.cantidad}
               onChange={handleChange} required />

        <input type="date" name="fecha" value={formData.fecha}
               onChange={handleChange} required />

        <button type="submit">Actualizar Venta</button>
      </form>
    </div>
  );
}

export default EditarVenta;
