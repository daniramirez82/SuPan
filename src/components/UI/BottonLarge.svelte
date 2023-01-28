<script>
  export let href = null;
  export let disabled = false;
</script>

<a {href}>
  <button class="waves-effect waves-light btn-large" on:click {disabled}>
    <slot />
  </button>
</a>

<style>
  .btn-large {
    font-family: "Oswald", sans-serif, -apple-system, BlinkMacSystemFont,
      Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
    /* font-size: 14px; */
    line-height: 1.5;
  }
</style>
