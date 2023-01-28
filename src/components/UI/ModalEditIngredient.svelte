<script>
  import { createEventDispatcher } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import {ingredientsStore} from "../../Stores/ingredients";
  import { isEmpty } from "../../Helpers/helpers";
  import ModalBackdrop from './ModalBackdrop.svelte';

  export let id = null;

  let dispacher = createEventDispatcher();

  let ingredientName = "";
  let costPerKilo = "";
  let isAFlour = false;

  $: validatedForm =
    !isEmpty(ingredientName) && !isEmpty(toString(costPerKilo));

  //works for assign values from store of this product to the form to edit it
  if (id) {
    let unsubscribe = ingredientsStore.subscribe((item) => {
      let editedIngredient = item.find((i) => i.id === id);
      ingredientName = editedIngredient.ingredientName;
      costPerKilo = editedIngredient.costPerKilo;
      isAFlour = editedIngredient.isAFlour;
    });
    unsubscribe();
  }

  function saveIngredient() {
    //if id exist the function will be edit
    if (id) {
      let ingredientToEdit = {
        id: String(id),
        ingredientName: ingredientName,
        costPerKilo: costPerKilo,
        isAFlour: isAFlour
      };
      ingredientsStore.editIngredient(ingredientToEdit);
      //if id does not exist the function will be add a new one
    } else {
      let ingredientToLoad = {
        id: String(Date.now()),
        ingredientName: ingredientName,
        costPerKilo: costPerKilo,
        isAFlour: isAFlour
      };
      ingredientsStore.addIngredient(ingredientToLoad);
    }

    dispacher("cancel");
  }
</script>

<ModalBackdrop on:cancel={()=> dispacher('cancel')} eventOnClick='cancel' />

<div class="card" in:fade={{ easing: quintOut }} out:blur>
  {#if id}
    <h5>Editar Ingrediente</h5>
  {:else}
    <h5>Nuevo Ingrediente</h5>
  {/if}
  <div class="form row">
    <div class="input-field col s12">
      <input
        bind:value={ingredientName}
        id="ingredientName"
        type="text"
        class="validate"
      />
      <label for="ingredientName" id="ingredientName-label" class="active">
        Nombre del Ingrediente
      </label>
    </div>
    <div class="row">
      <div class="input-field col s6">
        <input
          bind:value={costPerKilo}
          id="costPerKilo"
          type="number"
          class="validate"
          placeholder="0.00"
          min="0"
          step="0.01"
          pattern="^\d+(?:\.\d{(1, 2)})?$"
        />
        <label class="active" for="costPerKilo">Costo por Kilogramo</label>
      </div>
      <div class="input-field col s6">
        <p>
          <label for="isAFlour">
            <input type="checkbox" id="isAFlour" class="filled-in is-a-flour" bind:checked={isAFlour} />
            <span>Es una Harina?</span>
          </label>
        </p>
        
      </div>
    </div>
  </div>
  <div class="card-action">
    {#if id}
      <button on:click={saveIngredient} class="waves-effect waves-light btn"
        >Guardar Cambios</button
      >
    {:else}
      <button
        on:click={saveIngredient}
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
  }

  .card .card-action {
    padding-left: 9px;
  }
</style>
