<script>
  import { fade, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { createEventDispatcher } from "svelte";

  export let eventOnClick = "";

  let dispach = createEventDispatcher();
</script>

<div
  class="modal-backdrop"
  on:click={() => dispach(eventOnClick)}
  in:fade={{ easing: quintOut }}
  out:blur
/>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }
</style>
