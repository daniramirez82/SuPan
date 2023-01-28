<script>
  import { createEventDispatcher } from "svelte";
  import {  onDestroy } from "svelte";
  import orders from '../../Stores/orders';

  let ordersInfo = [];

  let unsubscribe = orders.subscribe((items) => {
    ordersInfo = [];
    items.forEach((i) => {
      ordersInfo = [...ordersInfo, i.info];
    });
  });

  onDestroy(() => {
    unsubscribe();
    ordersInfo = [];
  });
  let dispacher = createEventDispatcher();
</script>

<ul class="collection">
  {#each ordersInfo as order, i}
    <li
      class="collection-item"
      on:click={() => dispacher("activeViewOrderModal", order.id)}
    >
      <span>{order.date}</span>
      <span>{order.store}</span>
      <span>{order.madeFor}</span>
    </li>
  {/each}
</ul>
