import { useState, useEffect, useMemo } from 'react';
import './ProductList.css';

const CATEGORIAS = ["Hombres", "Niños", "Mujeres"];
const TIPOS = ["Prendas de abrigo", "Ropa interior", "Calzados"];

const ProductList = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [orden, setOrden] = useState("Relevantes");
    const [filtros, setFiltros] = useState({ categoria: [], tipo: [] });

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch("https://api-ten-jet.vercel.app/products");
                if (!response.ok) throw new Error("Error al obtener los productos");
                const data = await response.json();
                setProductos(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchProductos();
    }, []);

    const handleFilterChange = (key, value) => {
        setFiltros(prev => {
            const currentList = prev[key];
            const newList = currentList.includes(value)
                ? currentList.filter(item => item !== value)
                : [...currentList, value];
            return { ...prev, [key]: newList };
        });
    };

    const productosOrdenadosYFiltrados = useMemo(() => {
        let result = [...productos];

        if (filtros.categoria.length > 0) {
            result = result.filter(p => filtros.categoria.includes(p.categoria));
        }
        if (filtros.tipo.length > 0) {
            result = result.filter(p => filtros.tipo.includes(p.tipo));
        }

        return result.sort((a, b) => {
            if (orden === "Precio: Mayor a Menor") return b.precio - a.precio;
            if (orden === "Precio: Menor a Mayor") return a.precio - b.precio;
            return 0;
        });
    }, [productos, filtros, orden]);

    return (
        <section className='main-content'>
            <aside className='filters'>
                <h2>Filtros</h2>
                
         
                <div className="filters-category">
                    <div className="filter-category">
                        <h3>Categorías</h3>
                        {CATEGORIAS.map(cat => (
                            <label key={cat}>
                                <input 
                                    type="checkbox" 
                                    checked={filtros.categoria.includes(cat)}
                                    onChange={() => handleFilterChange('categoria', cat)} 
                                />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

               
                <div className="filters-category">
                    <div className="filter-category">
                        <h3>Tipos</h3>
                        {TIPOS.map(tipo => (
                            <label key={tipo}>
                                <input 
                                    type="checkbox" 
                                    checked={filtros.tipo.includes(tipo)}
                                    onChange={() => handleFilterChange('tipo', tipo)} 
                                />
                                <span>{tipo}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>
            
            <main className='collections'>
                <div className="options">
                    <h2>TODAS LAS COLECCIONES</h2>
                    <div className="sort-options">
                        <label className="label1">
                            Ordenar por:
                            <select onChange={(e) => setOrden(e.target.value)} value={orden}>
                                <option>Relevantes</option>
                                <option>Precio: Mayor a Menor</option>
                                <option>Precio: Menor a Mayor</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="products">
                    {error ? (
                        <p className='error-message'>{error}</p>
                    ) : (
                        productosOrdenadosYFiltrados.map((producto) => (
                            <div className="product-card" key={producto.id}>
                                <img 
                                    src={producto.image} 
                                    alt="Imagen del producto" 
                                    className="product-image" 
                                /> 
                                <h3>{producto.nombre}</h3>
                                <p>${producto.precio}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </section>
    );
};

export default ProductList;