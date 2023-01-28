import { writable } from "svelte/store";
import firebase from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import "firebase/firestore";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
var db = firebase.firestore();

const orders = writable([]);

const orderStore = {
  subscribe: orders.subscribe,

  getOrders: (ordersDB) => {
    let loadedOrders = [];
    ordersDB.forEach((item) => {
      loadedOrders = [...loadedOrders, item.data()];
    });
    orders.set(loadedOrders);
  },

  addOrder: (orderToAdd, id) => {
    db.collection("pedidos")
      .doc(orderToAdd["info"].id)
      .set(orderToAdd)
      .then(() => {
        orders.update((items) => {
          if (id) {
            let itemIndex = items.findIndex((i) => i["info"].id === id);
            let itemsCopy = [...items];
            itemsCopy[itemIndex] = orderToAdd;
            return itemsCopy;
          } else {
            return (items = [...items, orderToAdd]);
          }
        });
      })
      .catch((err) => console.log("Pedido no guardado, ocurrio un error", err));
  },

  deleteOrder: (id) => {
    // buscar id en base de datos de este pedido con id
    db.collection("pedidos").get();

    db.collection("pedidos")
      .doc(id)
      .delete()
      .then(() => {
        orders.update((items) => {
          return items.filter((i) => i["info"].id !== id);
        });
      })
      .catch((err) => console.log("Error Deleting Occur: ", err));
  },

  productAmount: (orderId, productName) => {
    let value;
    return (value = new Promise((resolve, reject) => {
      orders.subscribe((ords) => {
        let selectedOrd = ords.filter((i) => i["info"].id === orderId);
        let object0InArray = selectedOrd[0];
        if (object0InArray.hasOwnProperty(productName)) {
          resolve(object0InArray[productName]);
        }
      });
    }));
  },
};

export default orderStore;
