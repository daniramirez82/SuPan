
<script>
  import BottonLarge from "../components/UI/BottonLarge.svelte";
  import CardPanel from '../components/UI/CardPanel.svelte';
  import state from "../Stores/state";
  import { onMount } from "svelte";
  

  onMount(() => {
    state.set("main");
  });
</script>

<svelte:head>
  <title>::SuPan::</title>
</svelte:head>

<div class="ppalMenu teal">
  <CardPanel>
    <BottonLarge href={"/products"}>Productos</BottonLarge>
  </CardPanel>
  <CardPanel>
    <BottonLarge href={"/orders"}>Pedidos</BottonLarge>
  </CardPanel>
  <CardPanel>
    <BottonLarge href={"/ingredients"}>Ingredientes</BottonLarge>
  </CardPanel>
  <CardPanel>
    <BottonLarge href={"/production"}>Producción</BottonLarge>
  </CardPanel>
</div>

<style>
  .ppalMenu {
    padding: 1rem;
    height: 100%;
  }
</style>
