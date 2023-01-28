<script>
  import { createEventDispatcher } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import productsStore from '../../Stores/products.js';
  import ModalBackdrop from './ModalBackdrop.svelte';
  import {areYouSure} from '../../Helpers/helpers.js';

  export let cardTitle = "Pan";
  export let recipeArray = [];
  export let id = null;
  export let peso = null;
  export let imageUrl =
    "https://static2.diariovasco.com/www/multimedia/202004/16/media/cortadas/pan-casero-como-hacer-pan-kdDE-U100925325432XOG-624x385@Diario%20Vasco.jpg";

    let dispacher = createEventDispatcher();

  function deleteProduct(){
    productsStore.deleteProduct(id);
    dispacher("cancel");
  }
</script>

<ModalBackdrop on:cancel={()=> dispacher('cancel')} eventOnClick='cancel' />

<div class="card" in:fade={{ easing: quintOut }} out:blur>
  <div class="card-image waves-effect waves-block waves-light">
    <i class="material-icons close" on:click={() => dispacher("cancel")}
      >close</i
    >
    <img class="activator" alt={cardTitle} src={imageUrl} />
  </div>
  <div class="card-content">
    <span class="card-title activator grey-text text-darken-4"
      >{cardTitle}<i class="material-icons right">more_vert</i></span
    >
  </div>
  <div class="card-reveal">
    <span class="card-title grey-text text-darken-4"
      >{cardTitle}<i class="material-icons right">close</i>
    </span>
    <p>
      Peso: {peso}.
    </p>
    <div>
      Receta:
      <ul>
        {#each recipeArray as ingredient }
        <li>{ingredient.ingredientName}: {ingredient.ingredientQuantity}%.</li> 
        {/each}
      </ul>
    </div>
    <div class="buttons">
      <button on:click="{()=> dispacher('editProduct', id )}" class="waves-effect waves-light btn">Edit</button>
      <button on:click={()=> areYouSure(deleteProduct)} class="waves-effect waves-light btn">Delete</button>
    </div>
  </div>
</div>

<style>
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
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .close {
    position: absolute;
    z-index: 2;
    color: black;
    right: 0;
    margin: 15px;
  }
</style>
