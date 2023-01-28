
<script context="module">
	import { firestore } from '../firebase';
	export async function preload(page, session) {
	  let db = await firestore();
	  let productsList = await db.collection("productos")
      .orderBy("nombre")
      .get();
	  return { products: productsList };
	}
  </script>
<script>
  import state from "../Stores/state";
  import {ingredientsStore} from '../Stores/ingredients'
  import ProductList from "../components/lists/ProductList.svelte";
  import BottonFloat from "../components/UI/BottonFloat.svelte";
  import ModalProducts from "../components/UI/ModalProducts.svelte";
  import ModalEdit from "../components/UI/ModalEdit.svelte";
  import productStore from '../Stores/products';

  export let products = [];
//send to the store the products list just recived from DB
  productStore.setProducts(products);
  
  state.set("products");

  

  let modalEdit = false;
  let modalProducts;
  let productNameDetail;
  let pesoNameDetail;
  let idDetail;
  let idToEdit;
  let recipeArray;

 

  function addModal() {
    modalProducts = false;
    modalEdit = true;
    //call to the ingredients DB and fill the ingredients store
    ingredientsStore.setIngredientsFromClient();
  }

  function lookProduct(e) {
    productNameDetail = e.detail.nombre;
    pesoNameDetail = e.detail.peso;
    idDetail = e.detail.id;
    recipeArray = e.detail.recipe;
    modalProducts = true;
  }

  function editProduct(e) {
    idToEdit = e.detail;
    modalProducts = false;
    modalEdit = true;
  }

  function closeModalEdit() {
    modalEdit = false;
    idToEdit = null;
  }
</script>

<svelte:head>
	<title>::Productos::</title>
</svelte:head>

<div class="allProducts">
  <div class="floatContainer">
    <BottonFloat on:click={addModal}  type="add" />
  </div>
  <div class="list">
    <ProductList on:verProducto={lookProduct} />
  </div>
</div>

<!-- markdown of the modal to Add or Edit a product -->
{#if modalEdit}
  <ModalEdit on:cancel={closeModalEdit} id={idToEdit} />
{/if}

<!-- markdown of hte modal to see the selected product, then edit or delete it -->
{#if modalProducts}
  <ModalProducts
    on:cancel={() => (modalProducts = false)}
    on:editProduct={editProduct}
    cardTitle={productNameDetail}
    peso={pesoNameDetail}
    id={idDetail}
    {recipeArray}
  />
{/if}

<style>
  .floatContainer {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    height: auto;
  }
  .list {
    margin-top: 40px;
  }
</style>
