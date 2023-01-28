<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let dailyPlan = [];
</script>

<ul class="collection with-header">
  <li class="collection-header row">
    <h4 class="col s11">Produccion del Día</h4>
  </li>
  {#if dailyPlan}
    {#each dailyPlan as { dailyQuantity, dailyRecipe, product }, i}
      <li class="collection-item product-cont row">
        <i
          class="material-icons close"
          on:click={() => dispatch("deleteFromList", product)}>close</i
        >

        <div class="product-cont-name col s4 teal white-text text-darken-2">
          <h6>{product.nombre}</h6>
          <p>
            Peso:<br /><span class="product-weight-product"
              >{product.peso}
            </span>
          </p>
          <p>
            Cantidad:<br />
            <span class="product-daily-quantity">{dailyQuantity} </span>
          </p>
        </div>
        <div class="product-cont-recipe col s8">
          {#each dailyRecipe as ingredient}
            <li>
              <p>
                <label>
                  <input type="checkbox" class="filled-in" bind:checked={ingredient.done} on:change='{()=> dispatch('changeCheckbox',{ checkboxStatus: ingredient.done, productId: product.id, ingredientName: ingredient.ingredientName })}' />
                  <span
                    >{ingredient.ingredientName} : {ingredient.ingredientWeight} {ingredient.measure}</span
                  >
                </label>
              </p>
            </li>
          {/each}
        </div>
      </li>
    {/each}
  {/if}
</ul>


<style>
  .product-cont {
    display: flex;
  }

  .product-weight-product {
    font-size: large;
  }

  .product-daily-quantity {
    font-size: large;
  }

  .close {
    position: absolute;
    z-index: 2;
    color: rgb(65, 65, 65);
    right: 0;
    margin-right: 8px;
    cursor: pointer;
  }

  a {
    color: inherit;
  }
</style>
