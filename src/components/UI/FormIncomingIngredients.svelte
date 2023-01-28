<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import InputText from "./InputText.svelte";
  export let options = [];
  let date = new Date().toLocaleDateString("en-GB");

  let selectedIngredient;
  let quantity;
  let lot = "";
  let dueDate;
  let buttonAvailable = false;
  let dispatch = createEventDispatcher();

  function validateForm() {
    if (
      selectedIngredient.value !== "" &&
      quantity > 0 &&
      lot !== "" &&
      dueDate.value !== ""
    ) {
      buttonAvailable = true;
    } else buttonAvailable = false;
  }

  function addIngredient() {
    let id;
    //search the ingredient id on data set form the DOM
    for (let item of selectedIngredient.children) {
      if (item.value === selectedIngredient.value) {
        id = item.dataset.id;
      }
    }

    const note = {
      ingredient: selectedIngredient.value,
      id,
      quantity,
      lot,
      dueDate: dueDate.value,
    };
    console.log(note);
    dispatch("ingredientToAdd", note);
    resetForm();
  }

  function resetForm() {
    selectedIngredient.value = "";
    quantity = "";
    lot = "";
    dueDate.value = date;
    buttonAvailable = false;
  }

  onMount(() => {
    var instance1 = M.Datepicker.init(dueDate, {
      format: "dd/mm/yyyy",
      autoClose: true,
      setDefaultDate: true,
    });

    dueDate.value = date;
  });
</script>

<form class="ingredient-form container" on:submit|preventDefault>
  <div class="row ingrediente">
    <div class="label col s4">Ingrediente:</div>

    <div class="ingredient-form-select col s8">
      <select
        class="browser-default selectInput"
        bind:this={selectedIngredient}
        on:blur={validateForm}
      >
        <option value="" disabled selected>Seleccione Ingrediente</option>
        {#each options as option}
          <option value={option.ingredientName} data-id={option.id}
            >{option.ingredientName}</option
          >
        {/each}
      </select>
    </div>
  </div>

  <div class="row cantidad">
    <div class="col s4">
      <span>Cantidad: </span>
    </div>
    <div class="col s8">
      <InputText
        bind:value={quantity}
        label="Cantidad"
        id="quantity"
        on:input={validateForm}
      />
    </div>
  </div>

  <div class="row lote">
    <div class="col s4">
      <span>Lote</span>
    </div>
    <div class="col s8">
      <InputText
        bind:value={lot}
        label="Lote"
        id="lot"
        on:input={validateForm}
      />
    </div>
  </div>
  <div class="row fecha-vencimiento">
    <div class="col s4">
      <span>Fecha de Vencimiento: </span>
    </div>
    <div class="col s8 fecha-vencimiento-input">
      <div class="ingredient-form-due-date">
        <label  for="due-date">Fecha Vencimiento</label>
        <input
          type="text"
          id="due-date"
          bind:this={dueDate}
          on:input={validateForm}
        />
      </div>
    </div>
  </div>

  <div class="ingredients-form-buttons row">
    <div class="col s6">
      <button
        on:click={() => resetForm()}
        class="waves-effect waves-light btn btn-flat">CANCELAR</button
      >
    </div>

    <div class="col s6">
      <button
        class="waves-effect waves-light btn"
        on:click={addIngredient}
        disabled={!buttonAvailable}>AGREGAR</button
      >
    </div>
  </div>
</form>

<style>
  .ingredients-form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .row{
    height: 54px;
    margin: 0;
    overflow: hidden;
  }
  .col.s4{
    height: 100%;
    background-color:#B2DFDB;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #797979;
    
  }

  .fecha-vencimiento{
    height: 100px;
  }

  .fecha-vencimiento-input{
    height: 100px;
  }

  .ingrediente {
    border-radius: 4px 0 0 0;
  }

  .fecha-vencimiento{
    border-radius: 0 0 0 4px;
  }
  .fecha-vencimiento>div>span{
    text-align: right;
  }
</style>
