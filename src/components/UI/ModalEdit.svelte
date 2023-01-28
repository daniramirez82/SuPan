<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import productsStores from "../../Stores/products";
  import { ingredientsStore } from "../../Stores/ingredients";
  import { isEmpty } from "../../Helpers/helpers";
  import { Product } from "../../Helpers/blueprints";
  import IngredientInput from "./IngredientInput.svelte";
  import IngredientsRecipeList from "../lists/IngredientsRecipeList.svelte";
  import InputText from "./InputText.svelte";
  import InputNumber from "./InputNumber.svelte";
  import ModalBackdrop from "./ModalBackdrop.svelte";

  export let id = null;

  let dispacher = createEventDispatcher();

  let name = "";
  let weight = "";
  let presentation = "";
  let view = "generalInfo";
  let recipeDiv;
  let generalInfoDiv;
  let ingredientsArray = [];
  let ingredientsFromStore = [];

  //get the ingredients from store to and array to populate the selection of ingredients in recipes
  async function getIngredients() {
    ingredientsFromStore = await ingredientsStore.setIngredientsFromClient();
  }

  getIngredients();

  $: validatedForm =
    !isEmpty(name) && !isEmpty(toString(weight)) && !isEmpty(presentation);

  //if is not a new product so the id exist (edit mode)
  //assign values from store of this product to the form to edit it
  if (id) {
    let unsubscribe = productsStores.subscribe((p) => {
      let editedProduct = p.find((p) => p.id === id);
      name = editedProduct.nombre;
      weight = editedProduct.peso;
      presentation = editedProduct.presentacion;
      if (editedProduct.recipe) {
        ingredientsArray = editedProduct.recipe;
      }
    });
    unsubscribe();
  }

  function saveProduct() {
    //if id exist the function will be edit
    if (id) {
      const productToEdit = new Product(
        id,
        name,
        weight,
        presentation,
        ingredientsArray
      );
      productsStores.editProduct(productToEdit);
      //if id does not exist the function will be add a new one
    } else {
      const id = Date.now();
      const productToLoad = new Product(
        id,
        name,
        weight,
        presentation,
        ingredientsArray
      );
      console.log(ingredientsArray);
      productsStores.addProduct(productToLoad);
    }
    dispacher("cancel");
  }

  function addToIngredientsObject(event) {
    let ingredient = event.detail;
    let weightFlourControl = 0;

    //check if the ingredient already exist in the ingredients array
    const existingIng = ingredientsArray.find(
      (ing) => ing.ingredientName === ingredient.ingredientName
    );
    if (existingIng) {
      return;
    }

    if (ingredient.isAFlour) {
      //check if is a Flour to control the weight of the flours
      ingredientsArray.forEach((ing) => {
        if (ing.isAFlour) {
          weightFlourControl += parseInt(ing.ingredientQuantity);
        }
      });
      //check if the FlourControl exceeds the max = 100%
      if (weightFlourControl + parseInt(ingredient.ingredientQuantity) > 100) {
        alert("No puede tener Harinas por mas del 100% de la receta.");
        return;
      }
    }

    //add the ingredient to the ingredients array
    ingredientsArray = [...ingredientsArray, ingredient];
  }

  function deleteIngredientFromList(data) {
    const id = data.detail;
    const tempArray = ingredientsArray.filter((ing) => ing.id != id);
    ingredientsArray = tempArray; //to force update the DOM
  }
</script>

<ModalBackdrop on:cancel={() => dispacher("cancel")} eventOnClick="cancel" />

<div class="card" in:fade={{ easing: quintOut }} out:blur>
  {#if id}
    <h5>Editar Producto</h5>
  {:else}
    <h5>Nuevo Producto</h5>
  {/if}

  <ul class="pagination">
    <li
      class={view === "generalInfo" ? "active amber" : "waves-effect"}
      on:click={() => (view = "generalInfo")}
    >
      <a href="javascript:;">Informacion General</a>
    </li>
    <li
      class={view === "recipe" ? "active amber" : "waves-effect"}
      on:click={() => (view = "recipe")}
    >
      <a href="javascript:;">Receta</a>
    </li>
  </ul>

  <div
    bind:this={generalInfoDiv}
    class={view === "generalInfo" ? "generalInfo" : "generalInfo hide"}
  >
    <div class="row">
      <InputText
        bind:value={name}
        smallColumns="s12"
        id="name"
        classInput="validate"
        forLabel="name"
        classLabel="active"
        label="Nombre del Producto"
      />
      <div class="row">
        <InputNumber
          bind:value={weight}
          smallColumns="s6"
          id="weight"
          classInput="validate"
          classLabel="active"
          forLabel="weight"
          label="Peso"
        />
        <InputText
          bind:value={presentation}
          smallColumns="s6"
          id="presentation"
          classInput="validate"
          placeholder="Presentacion del Producto"
          forLabel="presentation"
          classLabel="active"
          label="Presentación"
        />
      </div>
    </div>
  </div>

  <div
    bind:this={recipeDiv}
    class={view === "recipe" ? "recipe" : "recipe hide"}
  >
    <div>
      <IngredientInput
        options={ingredientsFromStore}
        on:ingredientToAdd={addToIngredientsObject}
      />
      <IngredientsRecipeList
        {ingredientsArray}
        on:deleteThisRow={deleteIngredientFromList}
      />
    </div>
  </div>

  <div class="card-action">
    {#if id}
      <button on:click={saveProduct} class="waves-effect waves-light btn"
        >Guardar Cambios</button
      >
    {:else}
      <button
        on:click={saveProduct}
        disabled={!validatedForm}
        class="waves-effect waves-light btn">Grabar Nuevo</button
      >
    {/if}
    <button
      class="waves-effect waves-light btn"
      on:click={() => dispacher("cancel")}>Cancelar</button
    >
  </div>
</div>

<style>
  h5 {
    margin: 0.093rem 0px 0.656rem 9px;
  }

  .pagination {
    border-bottom: 1px solid rgba(160, 160, 160, 0.2);
    padding-bottom: 10px;
  }
  .hide {
    display: none;
  }

  button {
    margin: 5px;
  }

  .card {
    display: block;
    position: fixed;
    top: 15vh;
    width: 80%;
    max-width: 650px;
    left: 50%;
    transform: translateX(-50%);
    max-height: 80vh;
    background: white;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 15px;
    overflow-y: scroll;
    transition: all 0.5s linear;
  }

  .card .card-action {
    padding-left: 9px;
  }
</style>
