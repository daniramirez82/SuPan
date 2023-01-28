import { firebaseConfig } from "../firebaseConfig";
import { writable } from "svelte/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { Product } from "../Helpers/blueprints";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
var db = firebase.firestore();

// Firestore data converter
var productConverter = {
  toFirestore: function (product) {
    return {
      id: product.id,
      nombre: product.nombre,
      peso: product.peso,
      presentacion: product.presentacion,
      recipe: product.recipe,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Product(
      data.id,
      data.nombre,
      data.peso,
      data.presentacion,
      data.recipe
    );
  },
};

const products = writable([]);

const productsStore = {
  subscribe: products.subscribe,

  setProducts: (items) => {
    let loadedProducts = [];
    items.forEach((p) => {
      loadedProducts = [...loadedProducts, p.data()];
    });
    products.set(loadedProducts);
    return loadedProducts;
  },

  addProduct: (productInfo) => {
    console.log(productInfo);
    let idProduct = "id" + productInfo.id;
    db.collection("productos")
      .doc(idProduct)
      .withConverter(productConverter)
      .set(productInfo)
      .then(() => {
        products.update((p) => {
          return [...p, productInfo];
        });
      })
      .catch((err) => console.log(err));
  },

  editProduct: (productToEdit) => {
    let idProduct = "id" + productToEdit.id;
    db.collection("productos")
      .doc(idProduct)
      .withConverter(productConverter)
      .set(productToEdit)
      .then(() => {
        products.update((p) => {
          let index = p.findIndex((i) => i.id === productToEdit.id);
          if (~index) {
            p[index] = productToEdit;
          }
          return p;
        });
      })
      .catch((err) => console.error("Error Editing Doc: ", err));
  },

  deleteProduct: (id) => {
    let idProduct = "id" + id;
    db.collection("productos")
      .doc(idProduct)
      .delete()
      .then(() => {
        products.update((items) => {
          return items.filter((i) => i.id !== id);
        });
      })
      .catch((err) => console.error("Error deleting: ", err));
  },

  callProductsFromDB: async function () {
    let _tempArray;
    this.subscribe(val=>{_tempArray=val});
    const storeValues = _tempArray;
    if (storeValues.length < 1) {
      let productsList = await db
        .collection("productos")
        .orderBy("nombre")
        .get();
      let loadedProducts = await this.setProducts(productsList);
      return loadedProducts;
    } else {
      return storeValues;
    }
  }
};

export default productsStore;
