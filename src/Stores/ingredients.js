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

const ingredients = writable([99]);

export const ingredientsStore = {
  subscribe: ingredients.subscribe,

  setIngredientsFromServer: (items) => {
    let loadedIngredients = [];
    items.forEach((item) => {
      loadedIngredients = [...loadedIngredients, item.data()];
    });
    ingredients.set(loadedIngredients);
    return loadedIngredients;
  },

  setIngredientsFromClient: async function () {
    let ingredientsList = await db
      .collection("ingredients")
      .orderBy("ingredientName")
      .get();
    let loadedIngredients = await this.setIngredientsFromServer(ingredientsList);
    return loadedIngredients;
  },

  addIngredient: (ingredientToLoad) => {
    let idIngredient = String(ingredientToLoad.id);
    db.collection("ingredients")
      .doc(idIngredient)
      .set(ingredientToLoad)
      .then(() => {
        ingredients.update((items) => {
          return [...items, ingredientToLoad];
        });
      })
      .catch((err) => console.log("Error Agregando Ingrediente: ", err));
  },
  deleteIngredient: (id) => {
    db.collection("ingredients")
      .doc(String(id))
      .delete()
      .then(() => {
        ingredients.update((items) => {
          return items.filter((i) => i.id !== id);
        });
      })
      .catch((err) => console.error("Error deleting: ", err));
  },

  editIngredient: (ingredientInfo) => {
    let idIngredient = ingredientInfo.id;
    db.collection("ingredients")
      .doc(idIngredient)
      .set(ingredientInfo)
      .then(() => {
        ingredients.update((items) => {
          let index = items.findIndex((i) => i.id === ingredientInfo.id);
          if (~index) {
            items[index] = ingredientInfo;
          }
          return items;
        });
      })
      .catch((err) => console.error("Error Editing Doc: ", err));
  },
};

export const inputsRecipeControl = writable([1]);
