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

const dailyPlan = writable([]);

const dailyPlanStore = {
  subscribe: dailyPlan.subscribe,

  addNewDP: (_dailyPlan) => {
    const doc = _dailyPlan.day.replace(/\//g, "");
    db.collection("dailyPlans").doc(doc).set(_dailyPlan);
    dailyPlan.set(_dailyPlan.plan);
    console.log(_dailyPlan.plan);
  },

  setDailyPlan: (plan) => {
    if (plan.exists) {
      const planOfTheDay = plan.data();
      dailyPlan.set(planOfTheDay.plan);
      return planOfTheDay.plan;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return [];
    }
  },

  searchDailyPlanDB: async (date) => {
    let dailyPlan;
    const cleanDate = date.toLocaleDateString("en-GB").replace(/\//g, "");
    console.log(cleanDate);
    const _dailyPlan = await db.collection("dailyPlans").doc(cleanDate).get();

    if (_dailyPlan.exists) {
      dailyPlan = _dailyPlan.data();
      return dailyPlan.plan;
    } else {
      console.log("no such document");
      return [];
    }
  },

  checkboxIngredientToggle: async () => {
    
  },
};

export default dailyPlanStore;
