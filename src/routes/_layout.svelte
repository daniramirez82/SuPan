<script>
  import Header from "../components/UI/Header.svelte";
</script>

<Header />

<main>
  <slot />
</main>
<style>
  main{
    height: 100%;
  }
</style>
