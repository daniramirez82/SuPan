<script>
  import { createEventDispatcher,  } from "svelte";
 export let ingredients = [];

  let dispacher = createEventDispatcher();
 
</script>

<ul class="collection">
  {#each ingredients as item}
    <li class="collection-item">
      <span>{item.ingredientName}</span>
      <div>
        <span
          class="material-icons cursor"
          on:click={() => dispacher("editIngredient", item)}>edit</span
        >
        <span
          class="material-icons cursor"
          on:click={() => dispacher("deleteIngredient", item)}>delete</span
        >
      </div>
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
