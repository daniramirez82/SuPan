<script>
  import Icon from "../UI/Icon.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatchEvent = createEventDispatcher();
  export let ingredientsArray = [];
</script>

<ul class="collection with-header">
  <li class="collection-header"><h6>Ingredientes de la Receta:</h6></li>
  {#each ingredientsArray as { id, ingredientName, ingredientQuantity }, i}
    <li class="collection-item">
      <div class="rowContent">
        <span class="ingredientRowContent">
          <span class="ingredientName">{ingredientName}</span>
          <span>{ingredientQuantity}</span>
        </span>

        <span href="#!" class="secondary-content cursor">
          <Icon
            id="deleteButton"
            iconName="delete_forever"
            eventName="deleteRow"
            on:deleteRow={() => dispatchEvent("deleteThisRow", id)}
          />
        </span>
      </div>
    </li>
  {/each}
</ul>

<style>
  .ingredientName{
    display: inline-block;
    width: 70%;
  }

  .cursor {
    cursor: pointer;
  }

</style>
