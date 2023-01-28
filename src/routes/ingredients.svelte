<script context="module">
  import { firestore } from "../firebase";
  export async function preload(page, session) {
    let db = await firestore();
    let ingredientsList = await db
      .collection("ingredients")
      .orderBy("ingredientName")
      .get();
    return { ingredients: ingredientsList };
  }
</script>

<script>
  import { onDestroy } from "svelte";
  import state from "../Stores/state";
  import {ingredientsStore} from "../Stores/ingredients";
  import IngredientsList from "../../src/components/lists/IngrediensList.svelte";
  import BottonFloat from "../components/UI/BottonFloat.svelte";
  import ModalEditIngredient from "../components/UI/ModalEditIngredient.svelte";

  export let ingredients = [];
  let ingredientsArray = [];
  ingredientsStore.setIngredientsFromServer(ingredients);

  let modalEditIngredient = false;
  let idIngredientToEdit;
  let idToDelete;

  state.set("ingredients");

  function activeAddIngredientModal() {
    modalEditIngredient = true;
  }

  function closeModalEditIngredient() {
    modalEditIngredient = false;
    idIngredientToEdit = null;
  }

  function editIngredient(e) {
    idIngredientToEdit = e.detail.id;
    modalEditIngredient = true;
  }

  function deleteIngredient(e) {
    idToDelete = e.detail.id;
    ingredientsStore.deleteIngredient(idToDelete);
  }

  let unsubscribe = ingredientsStore.subscribe((items) => {
    ingredientsArray = items;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>::Ingredientes::</title>
</svelte:head>

<div class="allIngredients">
  <div class="floatContainer">
    <BottonFloat on:click={activeAddIngredientModal} type="add" />
  </div>
  <div class="list">
    <IngredientsList
      ingredients={ingredientsArray}
      on:editIngredient={editIngredient}
      on:deleteIngredient={deleteIngredient}
    />
  </div>
</div>

<!-- markdown of the modal to Add or Edit a ingredient -->
{#if modalEditIngredient}
  <ModalEditIngredient
    on:cancel={closeModalEditIngredient}
    id={idIngredientToEdit}
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
