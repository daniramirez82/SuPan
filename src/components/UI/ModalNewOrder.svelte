<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import products from "../../Stores/products.js";
  import orders from "../../Stores/orders.js";
  import { isEmpty, validateAll } from "../../Helpers/helpers";
  import ModalBackdrop from './ModalBackdrop.svelte';

  export let id = null;

  products.callProductsFromDB();

  let dispacher = createEventDispatcher();
  let productsNames = [];
  let pedido = {};
  let madeFor = "";
  let store = "";
  let idTemp;
  var inputsValidated = false;
  let inputsObj = {};

  $: infoValidated = !isEmpty(store) && !isEmpty(madeFor);
  $: allValidated = infoValidated && inputsValidated;

  function validateInput() {
    inputsValidated = validateAll(inputsObj);
  }

  // search on the store of products the products names to populate the markdown of the order
  let unsubscribe = products.subscribe((items) => {
    items.forEach((i) => {
      productsNames = [...productsNames, i.nombre];
    });
    productsNames.sort();
  });
  unsubscribe();

  onMount(() => {
    //search the id of the order in the orders stores to populate the value inputs of the markdown
    if (id) {
      let arrayProducts = [];

      let closeStore = orders.subscribe((items) => {
        items.forEach((ord) => {
          if (ord["info"].id === id) {
            madeFor = ord["info"].madeFor;
            store = ord["info"].store;
            //made an array with the products and the amount
            for (const p in ord) {
              if (p !== "info") {
                arrayProducts.push({ product: p, amount: ord[p] });
              }
            }
            //select the inputs elements and itereate over then to find
            //if the inputs id matches with the product on the arrayProducts
            
            for (var input in inputsObj) {
              arrayProducts.forEach((arrayEl) => {
                if (input === arrayEl.product) { 
                  inputsObj[input].value = arrayEl.amount;
                }
              });
            }
          }
        });
      });

      closeStore();
    }
  });

  function enviarPedido() {
    let fecha = new Date().toLocaleDateString();

    if (id) {
      idTemp = id;
    } else {
      //construct a unique id for the orders
      idTemp = Date.now() + "_" + fecha.replace(/\//g, "") + store.charAt(0);
    }

    let orderInfo = {
      id: idTemp,
      madeFor: madeFor,
      store: store,
      date: fecha,
    };

    pedido["info"] = orderInfo;

    //iterate over the inputs html elements and get them values and made an array
    for (var input in inputsObj) {
      if (inputsObj[input].value !== "" && inputsObj[input].value > 0) {
        pedido[input] = inputsObj[input].value;
      }
    }

    orders.addOrder(pedido, id);

    closeModal();
  }

  function closeModal() {
    dispacher("cancel");
    pedido = {};
  }

</script>

<ModalBackdrop on:cancel={()=> dispacher('cancel')} eventOnClick='cancel' />

<div class="card" in:fade={{ easing: quintOut }} out:blur>
  <i class="material-icons close" on:click={closeModal}>close</i>
  {#if id}
    <h5>Editar Pedido</h5>
  {:else}
    <h5>Nuevo Pedido</h5>
  {/if}

  <div class="col s12">
    <div class="row">
      <div class="input-field col s6">
        <input
          bind:value={madeFor}
          placeholder="Hecho por"
          id="madeFor"
          type="text"
          class="validate"
        />
        <label class="active" for="madeFor">Nombre</label>
      </div>
      <div class="input-field col s6">
        <select bind:value={store} id="tiendas" required>
          <option value="" disabled selected>Seleccione Tienda</option>
          <option value="Unamuno">Unamuno</option>
          <option value="Torre">Torre Laguna</option>
        </select>
        <label class="active" for="tiendas">Tienda</label>
      </div>
    </div>
  </div>
  <div class="row">
    {#each $products as product (product.id)}
      <div class=" col s12 input-line">
        <span class="name">{product.nombre}</span>
        <span class="input">
          {#if id}
            <input
              id={product.nombre}
              type="number"
              class="validate"
              name="input"
              on:input={validateInput}
              bind:this={inputsObj[product.nombre]}
            />
          {:else}
            <input
              id={product.nombre}
              type="number"
              class="validate"
              name="input"
              on:input={validateInput}
              bind:this={inputsObj[product.nombre]}
            />
          {/if}
        </span>
      </div>
    {/each}
  </div>
  <div class="card-action">
    {#if id}
      <button on:click={enviarPedido} disabled={!allValidated}
        >Guardar Cambios</button
      >
    {:else}
      <button on:click={enviarPedido} disabled={!allValidated}
        >Enviar Pedido</button
      >
    {/if}
  </div>
</div>

<style>
  .close {
    position: absolute;
    z-index: 2;
    color: #333;
    right: 15px;
    cursor: pointer;
  }

  select {
    display: block;
  }

  .validate {
    text-align: center;
  }
  .input-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .input {
    width: 40px;
  }

  .name {
    width: 80%;
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
    overflow: scroll;
  }

  .card .card-action {
    padding: 0;
    padding-left: 9px;
  }
</style>
