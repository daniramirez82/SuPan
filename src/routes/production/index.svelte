<script context="module">
  import { firestore } from "../../firebase";
  export async function preload(page, session) {
    let db = await firestore();
    let productsList = await db.collection("productos").orderBy("nombre").get();
    return { products: productsList };
  }
</script>

<script>
  import CardPanel from "../../components/UI/CardPanel.svelte";
  import BottonLarge from "../../components/UI/BottonLarge.svelte";
  import state from "../../Stores/state.js";
  import productStore from '../../Stores/products';
  
  export let products = [];
  
  state.set("production");
  const productsOnStore = productStore.setProducts(products);
  
</script>

<CardPanel>
  <BottonLarge href={"/production/dailyplan"}>Plan Diario</BottonLarge>
</CardPanel>

<CardPanel>
  <BottonLarge href={"/production/incomingIngredients"}>Albaran Entrada Ingredientes</BottonLarge>
</CardPanel>

