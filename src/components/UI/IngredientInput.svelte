<script>
  import { createEventDispatcher } from "svelte";
  export let options = [];

  let idSelected = "";
  let quantity = "";
  let dispacher = createEventDispatcher();
  let addIngredientButton;

  function validateIngredientInput() {
    if (idSelected.length > 0 && (quantity.value > 0 && quantity.value < 101) ) {
      addIngredientButton.disabled = false;
    }else addIngredientButton.disabled = true;
  }

  function addIngredientInput(id) {
    let temIngredient = options.filter(p=> p.id === id);
    let ingredientToAdd = temIngredient[0];
    const ingredientData = {
      ...ingredientToAdd,
      ingredientQuantity: quantity.value
    };
    dispacher("ingredientToAdd", ingredientData);
    addIngredientButton.disabled = true;
    idSelected = "";
    quantity.value = "";
  }
</script>

<form class="input" on:submit|preventDefault>
  <select
    class="browser-default selectInput"
    bind:value={idSelected}
    on:input={validateIngredientInput}
  >
    <option value="" disabled idSelected>Seleccione Ingrediente</option>
    {#each options as option}
      <option value={option.id}>{option.ingredientName}</option>
    {/each}
  </select>
  <div class="numberInputAndButtonAdd">
    <input
      on:input={validateIngredientInput}
      class="numberInput"
      type="number"
      min="0"
      max="100"
      bind:this={quantity}
    />
    <button
      id="addButton"
      class="waves-effect waves-light btn"
      on:click={()=> addIngredientInput(idSelected)}
      bind:this={addIngredientButton}
      disabled><i class="material-icons"> playlist_add</i></button
    >
  </div>
</form>

<style>
  .input .numberInput {
    width: 30px;
    margin-left: 14px;
  }
  .numberInputAndButtonAdd #addButton {
    width: 33px;
    padding: 0 0;
  }

  form {
    display: flex;
    justify-content: space-between;
  }
  .selectInput {
    width: 70%;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
