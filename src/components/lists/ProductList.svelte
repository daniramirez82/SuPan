<script>
  import { createEventDispatcher } from "svelte";
  import BottonIcon from '../UI/BottonIcon.svelte'
  import products from "../../Stores/products";

  let dispacher = createEventDispatcher();

  let listOfProducts = products;
</script>

<ul class="collection">
  {#each $listOfProducts as item}
    <li class="collection-item" on:click={() => dispacher("verProducto", item)}>
      <span class="cursor">{item.nombre}</span>
      <span class="material-icons cursor">open_in_new</span>
    </li>
  {/each}
</ul>

<style>
  .collection-item {
    display: flex;
    justify-content: space-between;
  }

  .cursor {
    cursor: pointer;
  }
</style>
