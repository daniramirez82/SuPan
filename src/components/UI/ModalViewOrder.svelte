<script>
  import { createEventDispatcher } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import orders from "../../Stores/orders.js";
  import ModalBackdrop from './ModalBackdrop.svelte';

  export let id = null;

  let dispacher = createEventDispatcher();

  let madeFor;
  let date;
  let store;
  let orderBody = [];

  let unsubscribe = orders.subscribe((items) => {
    items.forEach((item) => {
      if (item["info"].id === id) {
        madeFor = item["info"].madeFor;
        date = item["info"].date;
        store = item["info"].store;
        for (const prop in item) {
          if (prop !== "info") {
            let productOrder = {};
            productOrder.product = prop;
            productOrder.value = item[prop];
            orderBody.push(productOrder);
          }
        }
      }
      // let orderToView = item.filter(i=> i['info'].id === id);
    });
  });
  unsubscribe();

  function deleteOrder(){
    orders.deleteOrder(id);
    dispacher('cancel');

  }
</script>

<ModalBackdrop on:cancel={()=> dispacher('cancel')} eventOnClick='cancel' />

<div class="card" in:fade={{ easing: quintOut }} out:blur>
  <div class="teal head">
    <i class="material-icons close" on:click={() => dispacher("cancel")}
      >close</i
    >
    <h5>Pedido</h5>
    <div class="orderInfo">
      <span>Fecha: {date}</span>
      <div>

        <span>Realizado por: {madeFor}  |</span>
        <span>  Tienda: {store}</span>
      </div>
    </div>
  </div>

  <div class="list">
    <ul class="collection">
      {#each orderBody as item}
        <li class="collection-item">
          <span>{item.product}</span>
          <span>{item.value}</span>
        </li>
      {/each}
    </ul>
  </div>
  <div class="card-action teal">
    <button on:click="{()=> dispacher('editOrder', id)}" class="waves-effect waves-light btn">Editar</button>
    <button on:click="{deleteOrder}" class="waves-effect waves-light btn">Borrar</button>
  </div>
</div>

<style>
  .close {
    position: absolute;
    z-index: 2;
    color: white;
    right: 24px;
    cursor: pointer;
  }
  
  .head{
    color: white;
    border-radius: 2px 2px 0 0;
    padding: 9px 16px 24px 16px;
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
    overflow:auto;
  }

  .card .card-action {
    padding-left: 9px;
  }
</style>
