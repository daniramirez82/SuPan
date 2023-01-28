import { writable } from "svelte/store";
import firebase from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import "firebase/firestore";
import { inventory } from "../Helpers/inventory";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
var db = firebase.firestore();

export const notes = writable([]);

export const notesStore = {
  subscribe: notes.subscribe,

  addNewNote:  (note) => {
    const id = note.noteId.toString();
    console.log(id);
    db.collection("notes").doc(id).set(note)
    .then(()=> console.log('grabado!!'))
    .catch(console.error);

    //change the inventary TOO!!
    inventory.addToInventory(note);

  },
};
