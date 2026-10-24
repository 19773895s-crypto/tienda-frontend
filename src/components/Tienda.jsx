import React, { useEffect, useState } from 'react';
import { api } from '../api';

const dinero = (n) =>
  Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const hoy = () => new Date().toLocaleDateString('en-CA');
const formatearFecha = (fecha) => fecha.split('-').reverse().join('/');

// Como la base de datos no guarda imágenes, el icono y la categoría
// se deducen del nombre del producto.
const CATALOGO = [
  { claves: ['laptop'], icono: '💻', categoria: 'Computación' },
  { claves: ['monitor'], icono: '🖥️', categoria: 'Computación' },
  { claves: ['teclado'], icono: '⌨️', categoria: 'Computación' },
  { claves: ['mouse'], icono: '🖱️', categoria: 'Computación' },
  { claves: ['smartphone', 'celular'], icono: '📱', categoria: 'Celulares' },
  { claves: ['tablet'], icono: '📲', categoria: 'Celulares' },
  { claves: ['audífonos', 'audifonos'], icono: '🎧', categoria: 'Audio' },
  { claves: ['bocina'], icono: '🔊', categoria: 'Audio' },
  { claves: ['tv'], icono: '📺', categoria: 'Video' },
  { claves: ['cargador'], icono: '🔌', categoria: 'Accesorios' }
];
const infoProducto = (nombre) => {
  const n = nombre.toLowerCase();
  return CATALOGO.find(c => c.claves.some(k => n.includes(k)))
    || { icono: '📦', categoria: 'Accesorios' };
};
const CATEGORIAS = ['Todos', 'Computación', 'Celulares', 'Audio', 'Video', 'Accesorios'];

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [comprando, setComprando] = useState(null);
  const [compra, setCompra] = useState({ cantidad: 1, vendedor_id: '' });

  const cargarVentas = () => {
    api.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al obtener ventas:', err));
  };

  useEffect(() => {
    Promise.all([api.get('/productos'), api.get('/vendedores')])
      .then(([p, v]) => {
        setProductos(p.data);
        setVendedores(v.data);
      })
      .catch(err => console.error('Error al cargar la tienda:', err))
      .finally(() => setCargando(false));
    cargarVentas();
  }, []);

  const abrirCompra = (producto) => {
    setCompra({ cantidad: 1, vendedor_id: '' });
    setComprando(producto);
  };

  const confirmarCompra = (e) => {
    e.preventDefault();
    api.post('/ventas', {
      vendedor_id: compra.vendedor_id,
      producto_id: comprando.id,
      cantidad: compra.cantidad,
      fecha: hoy()
    })
      .then(res => {
        alert(res.data.message);
        setComprando(null);
        cargarVentas();
      })
      .catch(err => {
        console.error('Error al registrar la compra:', err);
        alert('No se pudo registrar la compra');
      });
  };

  const visibles = productos.filter(p =>
    (categoria === 'Todos' || infoProducto(p.nombre).categoria === categoria) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const destacado = productos.length
    ? productos.reduce((a, b) => (Number(b.precio) > Number(a.precio) ? b : a))
    : null;

  const recientes = [...ventas].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="tienda">
      <div className="promo">Garantía en todos nuestros productos</div>

      <section className="hero">
        <div className="hero-texto">
          <h2>Tecnología para tu día a día</h2>
          <p>Laptops, celulares, audio y accesorios. Elige tu producto y compra en un momento.</p>
          <a className="btn btn-claro" href="#catalogo">Ver productos</a>
        </div>
        {destacado && (
          <div className="hero-destacado">
            <span className="hero-icono">{infoProducto(destacado.nombre).icono}</span>
            <div>
              <small>Producto destacado</small>
              <h3>{destacado.nombre}</h3>
              <div className="etiqueta"><strong>{dinero(destacado.precio)}</strong></div>
            </div>
            <button className="btn btn-primario" onClick={() => abrirCompra(destacado)}>Comprar</button>
          </div>
        )}
      </section>

      <section id="catalogo" className="catalogo">
        <div className="catalogo-barra">
          <h2>Nuestros productos</h2>
          <input className="buscador" type="search" placeholder="Buscar producto"
                 value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        <div className="categorias">
          {CATEGORIAS.map(c => (
            <button key={c} className={c === categoria ? 'chip activo' : 'chip'}
                    onClick={() => setCategoria(c)}>{c}</button>
          ))}
        </div>

        {cargando ? (
          <p className="mensaje">Conectando con el servidor… la primera carga puede tardar hasta un minuto.</p>
        ) : visibles.length === 0 ? (
          <p className="mensaje">No encontramos productos con esa búsqueda.</p>
        ) : (
          <div className="productos">
            {visibles.map(p => {
              const info = infoProducto(p.nombre);
              return (
                <article className="producto" key={p.id}>
                  <div className="producto-imagen">{info.icono}</div>
                  <span className="producto-categoria">{info.categoria}</span>
                  <h3>{p.nombre}</h3>
                  <p className="producto-precio">{dinero(p.precio)}</p>
                  <button className="btn btn-primario" onClick={() => abrirCompra(p)}>Comprar</button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="recientes">
        <h2>Ventas recientes</h2>
        <div className="tabla-tarjeta">
          {recientes.length === 0 ? (
            <p className="mensaje">Todavía no hay ventas registradas.</p>
          ) : (
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Atendió</th>
                    <th>Producto</th>
                    <th className="num">Cant.</th>
                    <th className="num">Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes.map(v => (
                    <tr key={v.id}>
                      <td className="vendedor">{v.vendedor}</td>
                      <td>{v.producto}</td>
                      <td className="num"><span className="cantidad">{v.cantidad}</span></td>
                      <td className="num total">{dinero(v.total)}</td>
                      <td>{formatearFecha(v.fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {comprando && (
        <div className="modal-fondo" onClick={() => setComprando(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar compra</h3>
            <p className="ayuda">{infoProducto(comprando.nombre).icono} {comprando.nombre} a {dinero(comprando.precio)} cada uno</p>
            <form className="formulario" onSubmit={confirmarCompra}>
              <label className="campo">
                Cantidad
                <input type="number" min="1" value={compra.cantidad} required
                       onChange={(e) => setCompra({ ...compra, cantidad: e.target.value })} />
              </label>
              <label className="campo">
                Vendedor que te atiende
                <select value={compra.vendedor_id} required
                        onChange={(e) => setCompra({ ...compra, vendedor_id: e.target.value })}>
                  <option value="">Selecciona un vendedor</option>
                  {vendedores.map(v => (
                    <option key={v.id} value={v.id}>{v.nombre} - {v.sucursal}</option>
                  ))}
                </select>
              </label>
              <div className="resumen-compra">
                <small>Total a pagar</small>
                <strong>{dinero(Number(comprando.precio) * Number(compra.cantidad || 0))}</strong>
              </div>
              <button className="btn btn-primario" type="submit">Confirmar compra</button>
            </form>
            <button className="btn btn-secundario" onClick={() => setComprando(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tienda;
