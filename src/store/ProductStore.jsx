import { create } from "zustand";

const useStore = create((set, get) => ({
  products: [],
  cart: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://dummyjson.com/products?limit=100");
      const data = await res.json();
      set({ products: data.products });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: (product) => {
    const cart = get().cart;
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      set({ cart: cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) });
    } else {
      set({ cart: [...cart, { ...product, qty: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((item) => item.id !== id) });
  },

  clearCart: () => set({ cart: [] }),

  // Admin Functions
  addProduct: (product) => set({ products: [...get().products, product] }),
  updateProduct: (updatedProduct) => {
    set({ products: get().products.map(p => p.id === updatedProduct.id ? updatedProduct : p) });
  },
  removeProduct: (id) => {
    set({ products: get().products.filter(p => p.id !== id) });
  },
}));

export default useStore;
