import firebase from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import "firebase/firestore";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
var db = firebase.firestore();

//in this object i´ll manage all about ingredientes inventoy
//in as outs and methods to add increase or decrease inventory

export const inventory = {
  addToInventory: (data) => {
    const lot = data.content.lot;
    const dueDate = data.content.dueDate;
    const operationDay = data.date;
    const quantity = data.content.quantity;
    const idFromModifier = data.noteId;
    const ingredientName = data.content.ingredientName;
    const ingredientId = data.content.id;
    db.collection("inventory")
      .doc(idFromModifier.toString())
      .get()
      .then((doc) => {
        if (doc.exist) {
          //add the new log to the array of LOGS
          const logToAdd = {
            operationDay,
            quantity,
            dueDate,
            lot,
            in: true,
            idFromModifier,
          };
          let newArrayTemp = doc.logs;
          newArrayTemp = [...newArrayTemp, logToAdd];
          const doc = db.collection("inventory").doc(idFromModifier.toString());
          return doc
            .update({
              logs: newArrayTemp,
            })
            .then(() => {
              console.log("Document successfully updated!");
            })
            .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });
        } else {
          //create the hole ingradient info on teh DB
          db.collection("inventory")
            .doc(idFromModifier.toString())
            .set({
              ingredient: ingredientName,
              ingredientId,
              logs: [
                {
                  operationDay,
                  quantity,
                  dueDate,
                  lot,
                  in: true,
                  idFromModifier,
                },
              ],
            })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      });
  },
};
