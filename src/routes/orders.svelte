<script context="module">
  import { firestore } from "../firebase";
  export async function preload(page, session) {
    let db = await firestore();
    let ordersList = await db.collection("pedidos").get();
    return { orders: ordersList.docs };
  }
</script>

<script>
  import orderStore from "../Stores/orders";
  import state from "../Stores/state";
  import OrdersList from "../components/lists/OrdersList.svelte";
  import BottonFloat from "../components/UI/BottonFloat.svelte";
  import ModalNewOrder from "../components/UI/ModalNewOrder.svelte";
  import ModalViewOrder from "../components/UI/ModalViewOrder.svelte";

  export let orders = [];
  let modalNewOrder = false;
  let idOrderToEdit;
  let idOrderToView;
  let modalViewOrder;

  state.set("orders");

  orderStore.getOrders(orders);

  function newOrder() {
    modalNewOrder = true;
  }

  function closeModalNewOrder() {
    modalNewOrder = false;
    idOrderToEdit = null;
  }

  function viewOrderModal(e) {
    idOrderToView = e.detail;
    modalViewOrder = true;
  }

  function editOrder(e) {
    idOrderToEdit = e.detail;
    modalViewOrder = false;
    modalNewOrder = true;
  }
</script>

<svelte:head>
  <title>::Pedidos::</title>
</svelte:head>

<div class="allOrders">
  <div class="floatContainer">
    <BottonFloat on:click={newOrder} type="add" />
  </div>
  <div class="list">
    <OrdersList on:activeViewOrderModal={viewOrderModal} />
  </div>
</div>

<!-- markdown of the modal to add a new order -->
{#if modalNewOrder}
  <ModalNewOrder on:cancel={closeModalNewOrder} id={idOrderToEdit} />
{/if}

<!-- markdown of the modal to view a order -->
{#if modalViewOrder}
  <ModalViewOrder
    id={idOrderToView}
    on:cancel={() => (modalViewOrder = false)}
    on:editOrder={editOrder}
  />
{/if}

<style>
  .floatContainer {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    height: auto;
  }

  .list {
    margin-top: 40px;
  }
</style>
