<script>
  import ModalBackdrop from "../UI/ModalBackdrop.svelte";
  import { createEventDispatcher } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import InputNumber from "../UI/InputNumber.svelte";
  import ButtonSmall from "../UI/ButtonSmall.svelte";

  const dispatch = createEventDispatcher();
  let quantityByTray;
  let quantityByCart;
  let finalQuantity = 0;

  function calculateQuantity() {
    console.log("calculo de cantidad");
    finalQuantity = quantityByTray * quantityByCart;
    console.log(quantityByTray, "x ", quantityByCart, "= ", finalQuantity);
  }
</script>

<ModalBackdrop on:cancel={() => dispatch("cancel")} eventOnClick="cancel" />
<div class="card" in:fade={{ easing: quintOut }} out:blur>
  <i class="material-icons close" on:click={() => dispatch("cancel")}>close</i>
  <div class="inputs">
    <InputNumber
      smallColumns="s6"
      bind:value={quantityByTray}
      id="quantityByTray"
      label="Unidades por Bandeja"
      on:input={calculateQuantity}
    />
    <InputNumber
      smallColumns="s6"
      bind:value={quantityByCart}
      id="quantityByCart"
      label="Unidades por Carro"
      on:input={calculateQuantity}
    />
  </div>
  <ButtonSmall on:click={() => dispatch("calculated", finalQuantity)}>
    Calcular</ButtonSmall
  >
  <h4>
    {#if finalQuantity > 0}
      {finalQuantity}
    {:else}
      0
    {/if}
  </h4>
</div>

<style>
  .card {
    position: absolute;
    z-index: 100;
    transform: translate(-50%, -50%);
    top: 50vh;
    left: 50vw;
    padding: 10px;
  }

  .close {
    cursor: pointer;
  }
</style>
