<script>
    export let href = null;
    export let disabled;
  </script>
  
  <a {href}>
    <button class="waves-effect waves-light btn-small" on:click {disabled}>
      <slot />
    </button>
  </a>